import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not configured");

    const { type, title, notes, code_snippet, description } = await req.json();

    let prompt = "";
    if (type === "analyze") {
      prompt = `You are a coding mentor. Analyze this DSA problem solution:

Problem: ${title}
${notes ? `Notes: ${notes}` : ""}
${code_snippet ? `Code:\n${code_snippet}` : ""}

Provide:
1. **Logic Explanation** - How the solution works step by step
2. **Time & Space Complexity** - Big O analysis
3. **Optimizations** - Suggest improvements
4. **Edge Cases** - What to watch out for

Keep it concise and educational.`;
    } else if (type === "social") {
      prompt = `You are a social media content creator for developers. Turn this coding log into engaging social media captions:

Title: ${title}
${description ? `Description: ${description}` : ""}
${code_snippet ? `Code snippet:\n${code_snippet}` : ""}

Generate:
1. **Instagram Caption** - Engaging, with relevant emojis and hashtags (#100DaysOfCode #WomenInTech #CodingJourney)
2. **LinkedIn Post** - Professional tone, highlighting learning and growth

Make it authentic and inspiring.`;
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic error:", response.status, errText);
      throw new Error(`AI request failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content?.[0]?.text || "No response generated.";

    return new Response(JSON.stringify({ result: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-analyze error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
