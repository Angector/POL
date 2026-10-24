import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get all users with active streaks
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, streak_days, cycle_started_at, rise_buff_until, morale')

    if (error) throw error

    const now = new Date()
    let processedCount = 0

    for (const profile of profiles || []) {
      // Check if cycle is older than 24 hours
      const cycleStarted = new Date(profile.cycle_started_at)
      const hoursSinceCycle = (now.getTime() - cycleStarted.getTime()) / (1000 * 60 * 60)

      if (hoursSinceCycle > 26 && profile.streak_days > 0) {
        // Check if user has active truce
        const { data: activeTruce } = await supabase
          .rpc('get_active_truce')

        // Only decrease morale if no active truce
        if (!activeTruce || activeTruce.length === 0) {
          const newMorale = Math.max(profile.morale - 5, 0)
          await supabase
            .from('profiles')
            .update({ morale: newMorale })
            .eq('id', profile.id)
        }

        processedCount++
      }
    }

    return new Response(JSON.stringify({ processed: processedCount }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
