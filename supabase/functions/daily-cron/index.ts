import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CRON_SECRET = Deno.env.get('CRON_SECRET')

Deno.serve(async (req) => {
  // Verify cron secret
  const secret = req.headers.get('cron-secret')
  if (secret !== CRON_SECRET) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get all active users (last activity < 30 days)
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, streak_days, cycle_started_at, morale')
      .gte('updated_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

    if (error) throw error

    let processedCount = 0

    for (const profile of profiles || []) {
      // Check if cycle_started_at is more than 26 hours ago
      const cycleStarted = new Date(profile.cycle_started_at)
      const hoursSinceCycle = (Date.now() - cycleStarted.getTime()) / (1000 * 60 * 60)

      if (profile.streak_days > 0 && hoursSinceCycle > 26) {
        // Reduce morale by 5 for inactivity
        await supabase
          .from('profiles')
          .update({ morale: Math.max(profile.morale - 5, 20) })
          .eq('id', profile.id)

        processedCount++
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: processedCount,
        total: profiles?.length || 0,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})
