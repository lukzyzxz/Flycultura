import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { destination, days, interests, budget, locale } = await req.json();

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const isPt = locale === "pt";

    const systemPrompt = isPt
      ? `Você é um consultor de viagens premium da FlyCultura. Crie roteiros detalhados, práticos e profissionais.
Regras OBRIGATÓRIAS de formatação:
- NÃO use Markdown. Nada de #, ##, ###, **, *, \` ou qualquer marcação.
- Use APENAS texto plano com quebras de linha
- Separe seções com linhas em branco e títulos em MAIÚSCULAS seguidos de dois-pontos
- Use "•" para listas
- Inclua custos estimados em BRL (R$) para cada item
- Organize por dia com horários sugeridos (manhã, tarde, noite)
- Inclua dicas práticas de transporte, alimentação e economia
- Sugira restaurantes e experiências específicas com faixa de preço
- Adicione uma seção de "RESUMO DE CUSTOS" ao final com total estimado
- Tom profissional mas acolhedor, como um consultor dedicado
- Inclua avisos importantes sobre documentação, clima e moeda local`
      : `You are a premium travel consultant from FlyCultura. Create detailed, practical, and professional itineraries.
MANDATORY formatting rules:
- Do NOT use Markdown. No #, ##, ###, **, *, \` or any markup.
- Use ONLY plain text with line breaks
- Separate sections with blank lines and UPPERCASE titles followed by colons
- Use "•" for lists
- Include estimated costs in BRL (R$) for each item
- Organize by day with suggested timeframes (morning, afternoon, evening)
- Include practical tips for transport, dining, and savings
- Suggest specific restaurants and experiences with price ranges
- Add a "COST SUMMARY" section at the end with estimated total
- Professional yet warm tone, like a dedicated consultant
- Include important notes about documentation, weather, and local currency`;

    const userPrompt = isPt
      ? `Crie um roteiro completo de ${days} dias para ${destination}.
Orçamento total: R$ ${budget || "sem limite"}.
Interesses: ${interests || "turismo geral"}.
Inclua: roteiro dia a dia detalhado, estimativas de custos (voo, hospedagem, alimentação, passeios), dicas locais, sugestões de economia e resumo financeiro.`
      : `Create a complete ${days}-day itinerary for ${destination}.
Total budget: R$ ${budget || "no limit"}.
Interests: ${interests || "general tourism"}.
Include: detailed day-by-day itinerary, cost estimates (flights, accommodation, food, activities), local tips, money-saving suggestions, and financial summary.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableApiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI API error: ${err}`);
    }

    const data = await response.json();
    const itinerary = data.choices?.[0]?.message?.content || (isPt ? "Não foi possível gerar o roteiro." : "Could not generate itinerary.");

    return new Response(JSON.stringify({ itinerary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
