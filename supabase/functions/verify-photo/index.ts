import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerificationRequest {
  submission_id: string;
  task_id: string;
  photos: string[];
  lat?: number;
  lng?: number;
  task_description: string;
  task_category: string;
  task_location_lat?: number;
  task_location_lng?: number;
  task_location_radius_m?: number;
}

interface VerificationResult {
  score: number;
  notes: string;
  flagged: boolean;
  location_valid: boolean;
  content_match: boolean;
  fraud_indicators: string[];
}

// Haversine formula to calculate distance between two GPS coordinates
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

serve(async (req) => {
  // Handle CORS preflight requests
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

    const request: VerificationRequest = await req.json();
    console.log('Verification request received:', JSON.stringify(request, null, 2));

    const fraudIndicators: string[] = [];
    let locationValid = true;
    let locationBonus = 1.0;

    // Check GPS location if required
    if (request.task_location_lat && request.task_location_lng && request.lat && request.lng) {
      const distance = calculateDistance(
        request.lat,
        request.lng,
        request.task_location_lat,
        request.task_location_lng
      );
      
      const allowedRadius = request.task_location_radius_m || 500;
      
      if (distance > allowedRadius) {
        locationValid = false;
        fraudIndicators.push(`Location is ${Math.round(distance)}m from task location (allowed: ${allowedRadius}m)`);
      } else if (distance <= 50) {
        locationBonus = 1.2; // 20% bonus for being within 50m
      } else if (distance <= 100) {
        locationBonus = 1.1; // 10% bonus for being within 100m
      }
    }

    // Use Lovable AI to analyze photos
    let aiScore = 70; // Default score
    let aiNotes = 'Photo analysis pending';
    let contentMatch = true;

    if (request.photos && request.photos.length > 0) {
      try {
        // Build the message content with images
        const messageContent: any[] = [
          {
            type: 'text',
            text: `You are an environmental task verification assistant. Analyze the submitted photo(s) for an environmental task.

Task Category: ${request.task_category}
Task Description: ${request.task_description}

Evaluate the following:
1. Does the photo show evidence of completing the described environmental task?
2. Does the photo appear genuine and unmanipulated?
3. Are there any signs of fraud (stock photos, screenshots, obvious manipulation)?
4. Is the content relevant to the task category?

Respond in JSON format:
{
  "score": <number 0-100>,
  "content_match": <boolean>,
  "fraud_detected": <boolean>,
  "fraud_reasons": [<string array of any fraud indicators>],
  "summary": "<brief explanation of assessment>"
}`
          }
        ];

        // Add up to 3 photos for analysis
        const photosToAnalyze = request.photos.slice(0, 3);
        for (const photoUrl of photosToAnalyze) {
          messageContent.push({
            type: 'image_url',
            image_url: { url: photoUrl }
          });
        }

        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [{ role: 'user', content: messageContent }],
            tools: [
              {
                type: 'function',
                function: {
                  name: 'verify_photo',
                  description: 'Verify the environmental task submission photo',
                  parameters: {
                    type: 'object',
                    properties: {
                      score: { type: 'number', minimum: 0, maximum: 100 },
                      content_match: { type: 'boolean' },
                      fraud_detected: { type: 'boolean' },
                      fraud_reasons: { type: 'array', items: { type: 'string' } },
                      summary: { type: 'string' }
                    },
                    required: ['score', 'content_match', 'fraud_detected', 'fraud_reasons', 'summary'],
                    additionalProperties: false
                  }
                }
              }
            ],
            tool_choice: { type: 'function', function: { name: 'verify_photo' } }
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          console.log('AI response:', JSON.stringify(aiData, null, 2));

          const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
          if (toolCall?.function?.arguments) {
            const analysis = JSON.parse(toolCall.function.arguments);
            aiScore = analysis.score || 70;
            aiNotes = analysis.summary || 'Photo analyzed';
            contentMatch = analysis.content_match !== false;

            if (analysis.fraud_detected) {
              fraudIndicators.push(...(analysis.fraud_reasons || ['Potential fraud detected']));
            }
          }
        } else {
          const errorText = await aiResponse.text();
          console.error('AI API error:', aiResponse.status, errorText);
          
          if (aiResponse.status === 429) {
            aiNotes = 'AI verification rate limited - manual review required';
          } else if (aiResponse.status === 402) {
            aiNotes = 'AI verification unavailable - manual review required';
          } else {
            aiNotes = 'AI verification failed - manual review required';
          }
        }
      } catch (aiError) {
        console.error('AI analysis error:', aiError);
        aiNotes = 'AI analysis encountered an error - manual review required';
      }
    } else {
      fraudIndicators.push('No photos submitted');
      aiScore = 0;
    }

    // Calculate final score with location bonus
    const finalScore = Math.round(aiScore * locationBonus);
    const flagged = fraudIndicators.length > 0 || !contentMatch || !locationValid || aiScore < 50;

    const result: VerificationResult = {
      score: Math.min(100, finalScore),
      notes: aiNotes,
      flagged,
      location_valid: locationValid,
      content_match: contentMatch,
      fraud_indicators: fraudIndicators
    };

    // Update the submission with AI verification results
    const { error: updateError } = await supabase
      .from('task_submissions')
      .update({
        ai_verification_score: result.score,
        ai_verification_notes: result.notes + (fraudIndicators.length > 0 ? ` | Flags: ${fraudIndicators.join(', ')}` : ''),
        ai_flagged: result.flagged
      })
      .eq('id', request.submission_id);

    if (updateError) {
      console.error('Error updating submission:', updateError);
    }

    console.log('Verification result:', JSON.stringify(result, null, 2));

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Verification error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      score: 0,
      flagged: true,
      notes: 'Verification failed - manual review required'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});