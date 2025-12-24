import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, category } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an environmental task creator for an eco-learning platform. Generate creative and actionable environmental tasks based on user prompts.

You MUST respond with a valid JSON object in this exact format:
{
  "title": "Short, action-oriented task title (max 60 chars)",
  "description": "Detailed task description explaining what the user should do and why it matters for the environment (2-3 sentences)",
  "category": "recycling" | "conservation" | "water" | "community",
  "difficulty": "easy" | "medium" | "hard",
  "tier": "basic" | "advanced" | "company",
  "points": number between 10-100 based on difficulty and effort,
  "estimated_time": "time estimate like '15 min', '30 min', '1 hour'",
  "instructions": ["Step 1", "Step 2", "Step 3"],
  "location_required": true or false based on whether this needs to be done at a specific location
}

Guidelines:
- Make tasks educational and impactful
- Easy tasks: simple daily habits (10-25 points)
- Medium tasks: require some effort or planning (30-50 points)  
- Hard tasks: significant commitment or skill (60-100 points)
- Basic tier: for beginners
- Advanced tier: for experienced eco-warriors
- Company tier: for organizational/group activities
${category ? `- Focus on the "${category}" category` : ''}

Only output the JSON object, no additional text.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt || "Create a simple recycling task for beginners" }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "API credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON from the response
    let taskData;
    try {
      // Try to extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        taskData = JSON.parse(jsonMatch[0]);
      } else {
        taskData = JSON.parse(content);
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI response as JSON");
    }

    // Validate and sanitize the response
    const validCategories = ["recycling", "conservation", "water", "community"];
    const validDifficulties = ["easy", "medium", "hard"];
    const validTiers = ["basic", "advanced", "company"];

    const sanitizedTask = {
      title: String(taskData.title || "").slice(0, 100),
      description: String(taskData.description || ""),
      category: validCategories.includes(taskData.category) ? taskData.category : "recycling",
      difficulty: validDifficulties.includes(taskData.difficulty) ? taskData.difficulty : "easy",
      tier: validTiers.includes(taskData.tier) ? taskData.tier : "basic",
      points: Math.min(100, Math.max(10, parseInt(taskData.points) || 10)),
      estimated_time: String(taskData.estimated_time || "15 min"),
      instructions: Array.isArray(taskData.instructions) ? taskData.instructions : [],
      location_required: Boolean(taskData.location_required)
    };

    console.log("Generated task:", sanitizedTask);

    return new Response(JSON.stringify({ task: sanitizedTask }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Error in generate-task function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
