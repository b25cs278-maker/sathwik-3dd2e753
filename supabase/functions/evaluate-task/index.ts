import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rubric criteria for task evaluation
const EVALUATION_RUBRIC = {
  completeness: {
    weight: 30,
    description: "How completely was the task executed? Were all requirements met?",
    levels: {
      excellent: { min: 90, description: "All requirements fully met with extra effort" },
      good: { min: 70, description: "Most requirements met satisfactorily" },
      fair: { min: 50, description: "Some requirements met, gaps exist" },
      poor: { min: 0, description: "Significant requirements missing" }
    }
  },
  quality: {
    weight: 25,
    description: "What is the quality of work demonstrated?",
    levels: {
      excellent: { min: 90, description: "Exceptional quality, attention to detail" },
      good: { min: 70, description: "Good quality, minor issues" },
      fair: { min: 50, description: "Acceptable quality, noticeable issues" },
      poor: { min: 0, description: "Poor quality, major issues" }
    }
  },
  effort: {
    weight: 20,
    description: "How much effort and dedication was put into the task?",
    levels: {
      excellent: { min: 90, description: "Outstanding effort and dedication" },
      good: { min: 70, description: "Good effort shown" },
      fair: { min: 50, description: "Moderate effort" },
      poor: { min: 0, description: "Minimal effort" }
    }
  },
  impact: {
    weight: 25,
    description: "What is the environmental/community impact of the completed task?",
    levels: {
      excellent: { min: 90, description: "Significant positive impact" },
      good: { min: 70, description: "Noticeable positive impact" },
      fair: { min: 50, description: "Some positive impact" },
      poor: { min: 0, description: "Little to no measurable impact" }
    }
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user from JWT
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { taskId, submissionId, taskTitle, taskDescription, submissionDetails } = await req.json();

    if (!taskId || !submissionId) {
      return new Response(JSON.stringify({ error: 'Task ID and Submission ID are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `You are an expert task evaluator for an environmental action platform. You evaluate task submissions using a strict rubric-based scoring system.

EVALUATION RUBRIC:
${Object.entries(EVALUATION_RUBRIC).map(([key, rubric]) => 
  `- ${key.toUpperCase()} (${rubric.weight}% weight): ${rubric.description}`
).join('\n')}

You MUST respond with a valid JSON object in this exact format:
{
  "rubric_scores": {
    "completeness": <number 0-100>,
    "quality": <number 0-100>,
    "effort": <number 0-100>,
    "impact": <number 0-100>
  },
  "improvement_points": [
    "<specific actionable improvement 1>",
    "<specific actionable improvement 2>",
    "<specific actionable improvement 3>"
  ],
  "summary": "<brief 1-2 sentence evaluation summary>"
}

RULES:
- Be objective and consistent
- Scores must reflect the rubric criteria
- Improvement points must be specific, actionable, and constructive
- Always provide exactly 3 improvement points
- Do not include any text outside the JSON object`;

    const userPrompt = `Evaluate this task submission:

TASK: ${taskTitle}
DESCRIPTION: ${taskDescription || 'No description provided'}

SUBMISSION DETAILS:
${submissionDetails || 'User completed the task and submitted evidence.'}

Provide your rubric-based evaluation as JSON.`;

    console.log('Calling Lovable AI for evaluation...');
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add funds.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI evaluation failed');
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No response from AI');
    }

    console.log('AI response:', content);

    // Parse the JSON response
    let evaluation;
    try {
      // Extract JSON from the response (handle markdown code blocks)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      evaluation = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      throw new Error('Invalid AI response format');
    }

    // Calculate overall score from rubric scores
    const rubricScores = evaluation.rubric_scores;
    const overallScore = Math.round(
      (rubricScores.completeness * EVALUATION_RUBRIC.completeness.weight +
       rubricScores.quality * EVALUATION_RUBRIC.quality.weight +
       rubricScores.effort * EVALUATION_RUBRIC.effort.weight +
       rubricScores.impact * EVALUATION_RUBRIC.impact.weight) / 100
    );

    // Store evaluation in database
    const { data: evalData, error: evalError } = await supabase
      .from('task_evaluations')
      .insert({
        user_id: user.id,
        task_id: taskId,
        submission_id: submissionId,
        overall_score: overallScore,
        rubric_scores: rubricScores,
        improvement_points: evaluation.improvement_points,
        summary: evaluation.summary,
        model_used: 'google/gemini-2.5-flash',
      })
      .select()
      .single();

    if (evalError) {
      console.error('Database error:', evalError);
      throw new Error('Failed to store evaluation');
    }

    console.log('Evaluation stored successfully:', evalData.id);

    return new Response(JSON.stringify({
      evaluation: {
        id: evalData.id,
        overall_score: overallScore,
        rubric_scores: rubricScores,
        improvement_points: evaluation.improvement_points,
        summary: evaluation.summary,
        evaluated_at: evalData.evaluated_at,
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Evaluation error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Evaluation failed' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
