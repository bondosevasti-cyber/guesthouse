
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
    try {
        const { name, email, phone, date } = await req.json()

        // Here you would typically integrate with an email service or database
        console.log(`Received booking notification for: ${name}, ${email}`)

        return new Response(
            JSON.stringify({ message: "Notification sent successfully" }),
            { headers: { "Content-Type": "application/json" } },
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { "Content-Type": "application/json" } },
        )
    }
})