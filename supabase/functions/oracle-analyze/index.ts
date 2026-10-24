import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Authenticate
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing auth header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const {  user, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Fetch urges from last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const {  urges } = await supabase
      .from('urges')
      .select('*')
      .eq('user_id', user.id)
      .gte('occurred_at', thirtyDaysAgo.toISOString())

    // Fetch profile
    const {  profile } = await supabase
      .from('profiles')
      .select('streak_days, morale, total_points')
      .eq('id', user.id)
      .single()

    // Calculate statistics
    const byHour = new Array(24).fill(0)
    const byDayOfWeek = new Array(7).fill(0)
    const byTrigger: Record<string, number> = {}
    let resistedCount = 0
    let defeatedCount = 0

    for (const urge of urges || []) {
      const date = new Date(urge.occurred_at)
      byHour[date.getHours()]++
      byDayOfWeek[(date.getDay() + 1) % 7]++
      byTrigger[urge.trigger_context] = (byTrigger[urge.trigger_context] || 0) + 1
      
      if (urge.resisted) resistedCount++
      else defeatedCount++
    }

    const totalUrges = (urges || []).length
    const resistanceRate = totalUrges > 0 ? (resistedCount / totalUrges) * 100 : 0

    // Find top patterns
    const topHour = byHour.indexOf(Math.max(...byHour))
    const topDay = byDayOfWeek.indexOf(Math.max(...byDayOfWeek))
    const topTrigger = Object.entries(byTrigger).sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown'

    // Tomorrow's day of week
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowDayIndex = (tomorrow.getDay() + 1) % 7
    const dayNames = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه']

    // Check if we have enough data
    if (totalUrges < 3) {
      // Not enough data - return basic prediction
      const prediction = {
        risk_level: 'medium' as const,
        risk_window: 'نامشخص',
        reason: `داده‌ی کافی برای تحلیل دقیق نیست. فقط ${totalUrges} حمله در ۳۰ روز اخیر ثبت شده.`,
        suggestion: 'سنگرهای روزانه‌ات را تقویت کن و حملات را ثبت کن تا تحلیل دقیق‌تری ارائه شود.',
      }

      // Save prediction
      const today = new Date().toISOString().split('T')[0]
      await supabase.from('oracle_predictions').upsert({
        user_id: user.id,
        for_date: today,
        risk_level: prediction.risk_level,
        risk_window: prediction.risk_window,
        reason: prediction.reason,
        suggestion: prediction.suggestion,
      }, { onConflict: 'user_id,for_date' })

      return new Response(JSON.stringify(prediction), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Try AI prediction
    const aiProvider = Deno.env.get('AI_PROVIDER') || 'openai'
    const apiKey = aiProvider === 'openai' 
      ? Deno.env.get('OPENAI_API_KEY')
      : Deno.env.get('ANTHROPIC_API_KEY')

    let prediction = null

    if (apiKey) {
      try {
        const prompt = `تو اوراکل «قلعه‌ی ذهن» هستی. بر اساس داده‌ی زیر، پیش‌بینی فردا را بساز.

داده:
- امروز: ${dayNames[(tomorrow.getDay()) % 7]}
- فردا: ${dayNames[tomorrowDayIndex]}
- ساعات پرخطر ۳۰ روز اخیر: ساعت ${topHour}
- روز پرخطر: ${dayNames[topDay]}
- trigger غالب: ${topTrigger}
- نرخ پیروزی: ${resistanceRate.toFixed(0)}%
- streak فعلی: ${profile?.streak_days || 0} روز
- مورال: ${profile?.morale || 0}
- تعداد کل حملات: ${totalUrges}

خروجی را در این JSON بده:
{
  "risk_level": "low"|"medium"|"high"|"critical",
  "risk_window": "مثلاً 'بین ۲۲ تا ۲۴'",
  "reason": "یک جمله‌ی فارسی",
  "suggestion": "یک پیشنهاد عملی مشخص فارسی"
}

لحن: حماسی، بدون شرم، بدون کلمات ممنوعه.`

        let aiResponse = ''

        if (aiProvider === 'openai') {
          const model = Deno.env.get('AI_MODEL') || 'gpt-4o-mini'
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: 'system', content: 'تو اوراکل قلعه‌ی ذهن هستی. فقط JSON خروجی بده.' },
                { role: 'user', content: prompt }
              ],
              max_tokens: 300,
              temperature: 0.7,
            }),
          })

          if (response.ok) {
            const data = await response.json()
            aiResponse = data.choices[0].message.content
          }
        } else {
          const model = Deno.env.get('AI_MODEL') || 'claude-3-5-haiku-latest'
          const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': apiKey,
              'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
              model,
              max_tokens: 300,
              messages: [{ role: 'user', content: prompt }],
            }),
          })

          if (response.ok) {
            const data = await response.json()
            aiResponse = data.content[0].text
          }
        }

        if (aiResponse) {
          // Parse JSON from response
          const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            prediction = JSON.parse(jsonMatch[0])
          }
        }
      } catch (e) {
        console.error('AI prediction failed:', e)
      }
    }

    // Fallback: statistical prediction
    if (!prediction) {
      let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'medium'
      if (resistanceRate > 80) riskLevel = 'low'
      else if (resistanceRate > 50) riskLevel = 'medium'
      else if (resistanceRate > 20) riskLevel = 'high'
      else riskLevel = 'critical'

      prediction = {
        risk_level: riskLevel,
        risk_window: `ساعت ${topHour} تا ${topHour + 1}`,
        reason: `بر اساس ${totalUrges} حمله در ۳۰ روز اخیر، فردا (${dayNames[tomorrowDayIndex]}) ممکن است چالش‌برانگیز باشد.`,
        suggestion: resistanceRate > 50 
          ? 'سنگرهای روزانه‌ات را حفظ کن. تو در مسیر درستی هستی.'
          : 'سنگر خواب و ورزش را تقویت کن. دکمه‌ی SOS را در دسترس نگه‌دار.',
      }
    }

    // Save prediction
    const today = new Date().toISOString().split('T')[0]
    await supabase.from('oracle_predictions').upsert({
      user_id: user.id,
      for_date: today,
      risk_level: prediction.risk_level,
      risk_window: prediction.risk_window,
      reason: prediction.reason,
      suggestion: prediction.suggestion,
    }, { onConflict: 'user_id,for_date' })

    return new Response(JSON.stringify(prediction), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    )
  }
})
