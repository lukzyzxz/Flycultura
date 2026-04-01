import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const RAPIDAPI_KEY = Deno.env.get("RAPIDAPI_KEY");
  if (!RAPIDAPI_KEY) {
    return new Response(JSON.stringify({ error: "RAPIDAPI_KEY not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { from, to, departDate, adults } = await req.json();

    // Reject same origin/destination
    const fromId = from || "GRU.AIRPORT";
    const toId = to || "JFK.AIRPORT";
    if (fromId === toId) {
      return new Response(JSON.stringify({ data: { flightOffers: [] }, fallback: true, reason: "same_origin_dest" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const params = new URLSearchParams({
      fromId,
      toId,
      departDate: departDate || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      adults: String(adults || 1),
      cabinClass: "ECONOMY",
      currency_code: "BRL",
    });

    const url = `https://booking-com15.p.rapidapi.com/api/v1/flights/searchFlights?${params}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": "booking-com15.p.rapidapi.com",
        "x-rapidapi-key": RAPIDAPI_KEY,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`Booking flights API error [${response.status}]:`, JSON.stringify(data));
      return new Response(JSON.stringify({ data: { flightOffers: [] }, fallback: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error searching flights:", error);
    return new Response(JSON.stringify({ data: { flightOffers: [] }, fallback: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
