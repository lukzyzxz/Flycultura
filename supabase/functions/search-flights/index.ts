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
    const { originSkyId, destinationSkyId, originEntityId, destinationEntityId, date, adults, cabinClass } = await req.json();

    const params = new URLSearchParams({
      originSkyId: originSkyId || "SAOP",
      destinationSkyId: destinationSkyId || "NYCA",
      originEntityId: originEntityId || "27546053",
      destinationEntityId: destinationEntityId || "27537542",
      cabinClass: cabinClass || "economy",
      adults: String(adults || 1),
      sortBy: "best",
      currency: "BRL",
      market: "pt-BR",
      countryCode: "BR",
    });

    if (date) params.set("date", date);

    const url = `https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlightsComplete?${params}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
        "x-rapidapi-key": RAPIDAPI_KEY,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Sky Scrapper API error [${response.status}]: ${JSON.stringify(data)}`);
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error searching flights:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
