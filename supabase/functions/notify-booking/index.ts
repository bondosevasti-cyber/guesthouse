import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { bookingData } = await req.json()

        // Get the n8n webhook URL from environment variables
        // Use the one provided by user as default if env var is missing (for testing purposes, though env var is preferred)
        const N8N_WEBHOOK_URL = Deno.env.get('N8N_WEBHOOK_URL') || 'https://unstaunch-heedlessly-erich.ngrok-free.dev/webhook-test/5a76a417-f8d2-482c-b6d4-a23839b4f080'

        console.log(`Forwarding booking to n8n: ${N8N_WEBHOOK_URL}`)

        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData),
        })

        if (!response.ok) {
            throw new Error(`n8n responded with status in Function: ${response.status}`)
        }

        const data = await response.text()

        return new Response(JSON.stringify({ success: true, n8n_response: data }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
