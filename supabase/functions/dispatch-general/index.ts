import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get user from Authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing auth header' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const {  user, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Parse request body
    const { general_id, recipient_id, message } = await req.json()

    if (!general_id || !recipient_id) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Check if general exists and belongs to sender
    const {  general, error: generalError } = await supabase
      .from('generals')
      .select('*')
      .eq('id', general_id)
      .eq('user_id', user.id)
      .single()

    if (generalError || !general) {
      return new Response(JSON.stringify({ error: 'General not found or not owned' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Check if alliance exists between sender and recipient
    const {  alliance, error: allianceError } = await supabase
      .from('alliances')
      .select('*')
      .eq('status', 'accepted')
      .or(`and(requester_id.eq.${user.id},recipient_id.eq.${recipient_id}),and(requester_id.eq.${recipient_id},recipient_id.eq.${user.id})`)
      .single()

    if (allianceError || !alliance) {
      return new Response(JSON.stringify({ error: 'No alliance with recipient' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Update original general status to dispatched
    await supabase
      .from('generals')
      .update({
        status: 'dispatched',
        sent_to_user_id: recipient_id,
        sent_at: new Date().toISOString(),
      })
      .eq('id', general_id)

    // Create copy for recipient
    const {  newGeneral, error: insertError } = await supabase
      .from('generals')
      .insert({
        user_id: recipient_id,
        name: general.name,
        rank_earned: general.rank_earned,
        portrait_seed: general.portrait_seed,
        experience_archive: general.experience_archive,
        status: 'received',
        received_from_user_id: user.id,
        original_general_id: general_id,
        received_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (insertError) {
      throw insertError
    }

    // Get sender callsign for letter
    const {  profile } = await supabase
      .from('profiles')
      .select('callsign')
      .eq('id', user.id)
      .single()

    // Create letter to recipient
    await supabase
      .from('letters')
      .insert({
        from_user_id: user.id,
        to_user_id: recipient_id,
        type: 'general',
        subject: 'ژنرال جدید از طرف شما',
        body: message || `${profile.callsign} یک ژنرال برای شما ارسال کرد.`,
      })

    // Create notification for recipient
    await supabase
      .from('notifications')
      .insert({
        user_id: recipient_id,
        type: 'general_received',
        payload: {
          from_callsign: profile.callsign,
          general_name: general.name,
          general_id: newGeneral.id,
        },
      })

    return new Response(
      JSON.stringify({ success: true, new_general_id: newGeneral.id }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
