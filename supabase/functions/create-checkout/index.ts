import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TIP_PRICE_ID = "price_1T8iiRBFYWH0miTQH5zbzThS";
const SUB_PRICE_ID = "price_1T8iiqBFYWH0miTQ8iLBYEzF";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { mode } = await req.json(); // "tip" or "subscription"
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { apiVersion: "2025-08-27.basil" });

    const isSub = mode === "subscription";
    const origin = req.headers.get("origin") || "http://localhost:3000";

    // Try to get user email if authenticated
    let customerEmail: string | undefined;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      );
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      customerEmail = data.user?.email ?? undefined;
    }

    let customerId: string | undefined;
    if (customerEmail) {
      const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
      if (customers.data.length > 0) customerId = customers.data[0].id;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : customerEmail,
      line_items: [{ price: isSub ? SUB_PRICE_ID : TIP_PRICE_ID, quantity: 1 }],
      mode: isSub ? "subscription" : "payment",
      success_url: `${origin}/?payment=success`,
      cancel_url: `${origin}/?payment=canceled`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
