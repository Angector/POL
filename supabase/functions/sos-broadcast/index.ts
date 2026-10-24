import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  try {
    // Create Supabase client with service role
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user from Authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing auth header' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    const {  user, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    // Get request body
    const { intensity } = await req.json()

    if (!intensity || intensity < 1 || intensity > 10) {
      return new Response(JSON.stringify({ error: 'Invalid intensity' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    // Get user callsign
    const {  profile, error: profileError } = await supabase
      .from('profiles')
      .select('callsign')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: 'Profile not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    // Find allies (first 3)
    // 1. First from alliance type
    const {  alliancePartners } = await supabase
      .from('alliances')
      .select('requester_id, recipient_id')
      .eq('status', 'accepted')
      .eq('type', 'alliance')
      .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .limit(3)

    let allyIds: string[] = []

    if (alliancePartners && alliancePartners.length > 0) {
      allyIds = alliancePartners.map(a =>
        a.requester_id === user.id ? a.recipient_id : a.requester_id
      )
    }

    // 2. If less than 3, add from truce type
    if (allyIds.length < 3) {
      const {  trucePartners } = await supabase
        .from('alliances')
        .select('requester_id, recipient_id')
        .eq('status', 'accepted')
        .eq('type', 'truce')
        .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .limit(3 - allyIds.length)

      if (trucePartners && trucePartners.length > 0) {
        const truceIds = trucePartners.map(a =>
          a.requester_id === user.id ? a.recipient_id : a.requester_id
        )
        allyIds = [...allyIds, ...truceIds]
      }
    }

    // Send SOS notifications to allies
    let sentCount = 0

    for (const allyId of allyIds) {
      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          user_id: allyId,
          type: 'sos',
          payload: {
            from_callsign: profile.callsign,
            from_user_id: user.id,
            intensity,
          },
        })

      if (!notifError) {
        sentCount++
      }
    }

    return new Response(
      JSON.stringify({ success: true, sent: sentCount }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  }
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
