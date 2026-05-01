import { supabase } from "@/integrations/supabase/client";

/**
 * Get a step-by-step tutor solution for a student's question.
 * Powered by Gemini via Lovable AI Gateway (no client-side API key required).
 *
 * @param userInput - The student's question or problem
 * @param topic - Optional subject/topic to specialize the tutor (e.g. "Algebra", "Python")
 */
export const getSolution = async (userInput: string, topic?: string): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke("get-solution", {
      body: { userInput, topic },
    });
    if (error) throw new Error(error.message);
    if (data?.error) throw new Error(data.error);
    return data?.solution ?? "";
  } catch (err) {
    console.error("getSolution error:", err);
    return "Sorry, I'm having trouble connecting to the AI brain right now. Try again!";
  }
};
