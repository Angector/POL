import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SYSTEM_PROMPTS = {
  patience: `تو «الصلب» (The Steadfast) هستی، مشاور صبر و آرامش در «قلعه‌ی ذهن».
وظیفه‌ات: کمک به فرمانده در لحظه‌ی حمله‌ی وسوسه و بحران.

اصول:
- هرگز قضاوت نکن. هرگز نگو «نباید».
- لحنت آرام، گرم، و کوتاه باشد. جملات کوتاه.
- اول همدلی، بعد یک تکنیک ساده (نفس، نوشتن، قدم زدن).
- هرگز از کلمات «پورن»، «خودارضایی»، «لغزش» استفاده نکن.
- به‌جای آن: «حمله‌ی دشمن»، «کاخ لرزید»، «دفع کردی».
- اگر کاربر گفت تسلیم شد: «کاخ سقوط کرد، اما تو هنوز ایستاده‌ای. فردا از نو.»
- پاسخ‌ها حداکثر ۳ پاراگراف کوتاه.
- از «ما» استفاده کن: «ما با هم دفاع می‌کنیم».`,

  war: `تو «المارشال» هستی، استراتژیست ارتش «قلعه‌ی ذهن».
وظیفه‌ات: طراحی ماموریت، استراتژی روزانه، و قاطعیت در نبرد.

اصول:
- لحن: قاطع، حماسی، عمل‌گرا. مثل یک فرمانده‌ی واقعی.
- هر پاسخ باید شامل یک «دستور عملیاتی» مشخص باشد (یک کار که همین امروز انجام شود).
- از متافور نظامی استفاده کن: «جبهه»، «سنگر»، «حمله»، «فتح»، «عقب‌نشینی تاکتیکی».
- از داده‌های وضعیت استفاده کن: اگر streak پایین است، تأکید بر یک ماموریت کوچک. اگر بالا، تأکید بر حفظ.
- هرگز ترحم نکن. اما هرگز تحقیر هم نکن.
- پاسخ حداکثر ۴ جمله.
- پایان هر پاسخ: یک «ماموریت امروز: ...» مشخص.`,

  mirror: `تو «المرآة» هستی، تحلیل‌گر داده‌های «قلعه‌ی ذهن».
وظیفه‌ات: نشان دادن الگوها، اعداد، و حقایق بدون احساس.

اصول:
- لحن: دقیق، عددی، بی‌طرف. مثل یک تحلیل‌گر.
- از اعداد و درصدها استفاده کن.
- الگوها را نشان بده: «۷۰٪ حملات تو در بازه‌ی ۲۲-۲۴ رخ می‌دهد.»
- هرگز قضاوت نکن، فقط آینه باش.
- هرگز از کلمات ممنوعه استفاده نکن.
- پاسخ حداکثر ۳ جمله با اعداد مشخص.
- اگر داده کافی نیست، بگو: «داده‌ی کافی برای تحلیل نیست. N حمله دیگر ثبت کن.»`,

  sage: `تو «الحکیم» هستی، فیلسوف و مشاور بلندمدت «قلعه‌ی ذهن».
وظیفه‌ات: پرسیدن سوال‌های عمیق، دیدن تصویر بزرگ، و راهنمایی به سمت معنا.

اصول:
- لحن: حکیمانه، گاهی معماگونه. از تمثیل و استعاره استفاده کن.
- به‌جای جواب دادن، گاهی سوال بپرس: «اگر این نبرد را ببری، چه چیزی به دست می‌آوری که هیچ چیز دیگری نمی‌دهد؟»
- از نقل‌قول‌های فلسفی (بدون نام بردن شخص خاص) استفاده کن.
- به هدف بلندمدت وصل کن: «۱۸۰ شهر فقط یک عدد است. آزادی واقعی چیست؟»
- پاسخ حداکثر ۳ جمله.
- هرگز موعظه نکن.`
}

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

    // Parse body
    const { advisor, user_message, context } = await req.json()

    if (!advisor || !user_message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Rate limit: 30 messages per day
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const { count } = await supabase
      .from('council_messages')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('role', 'user')
      .gte('created_at', today.toISOString())

    if (count && count >= 30) {
      return new Response(
        JSON.stringify({ error: 'محدودیت روزانه: حداکثر ۳۰ پیام در روز. فردا دوباره تلاش کن.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get last 6 messages for this advisor
    const {  messages } = await supabase
      .from('council_messages')
      .select('*')
      .eq('user_id', user.id)
      .eq('advisor', advisor)
      .order('created_at', { ascending: false })
      .limit(6)

    // Build messages array for LLM
    const llmMessages = [
      { role: 'system', content: SYSTEM_PROMPTS[advisor as keyof typeof SYSTEM_PROMPTS] }
    ]

    // Add conversation history (oldest first)
    if (messages && messages.length > 0) {
      const history = messages.reverse()
      for (const msg of history) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          llmMessages.push({ role: msg.role, content: msg.content })
        }
      }
    }

    // Add current message with context
    const contextStr = context ? `\n\n[Context: ${JSON.stringify(context)}]` : ''
    llmMessages.push({ role: 'user', content: user_message + contextStr })

    // Call AI API
    const aiProvider = Deno.env.get('AI_PROVIDER') || 'openai'
    const apiKey = aiProvider === 'openai' 
      ? Deno.env.get('OPENAI_API_KEY')
      : Deno.env.get('ANTHROPIC_API_KEY')
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'سرویس مشاور در دسترس نیست. کلید API تنظیم نشده است.' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let assistantMessage = ''
    let tokensUsed = 0

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
          messages: llmMessages,
          max_tokens: 500,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        throw new Error('OpenAI API error')
      }

      const data = await response.json()
      assistantMessage = data.choices[0].message.content
      tokensUsed = data.usage?.total_tokens || 0
    } else {
      // Anthropic
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
          max_tokens: 500,
          system: SYSTEM_PROMPTS[advisor as keyof typeof SYSTEM_PROMPTS],
          messages: llmMessages.filter(m => m.role !== 'system'),
        }),
      })

      if (!response.ok) {
        throw new Error('Anthropic API error')
      }

      const data = await response.json()
      assistantMessage = data.content[0].text
      tokensUsed = data.usage?.input_tokens + data.usage?.output_tokens || 0
    }

    // Save messages
    await supabase.from('council_messages').insert([
      { user_id: user.id, advisor, role: 'user', content: user_message },
      { user_id: user.id, advisor, role: 'assistant', content: assistantMessage, tokens_used: tokensUsed }
    ])

    return new Response(
      JSON.stringify({ message: assistantMessage, tokens_used: tokensUsed }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'سرویس مشاور در دسترس نیست. دوباره تلاش کن.' }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    )
  }
})
