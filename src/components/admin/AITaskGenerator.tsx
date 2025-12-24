import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Loader2, CheckCircle, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface GeneratedTask {
  title: string;
  description: string;
  category: "recycling" | "conservation" | "water" | "community";
  difficulty: "easy" | "medium" | "hard";
  tier: "basic" | "advanced" | "company";
  points: number;
  estimated_time: string;
  instructions: string[];
  location_required: boolean;
}

interface AITaskGeneratorProps {
  onTaskGenerated: (task: GeneratedTask) => void;
  onClose?: () => void;
}

const EXAMPLE_PROMPTS = [
  "Create a beginner-friendly recycling task for students",
  "Design a water conservation challenge for families",
  "Make a community cleanup activity for weekends",
  "Create an advanced composting task for eco-enthusiasts",
];

export function AITaskGenerator({ onTaskGenerated, onClose }: AITaskGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [generating, setGenerating] = useState(false);
  const [generatedTask, setGeneratedTask] = useState<GeneratedTask | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt describing the task you want to create");
      return;
    }

    setGenerating(true);
    setGeneratedTask(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-task", {
        body: { 
          prompt: prompt.trim(),
          category: category !== "all" ? category : undefined
        },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.task) {
        setGeneratedTask(data.task);
        toast.success("Task generated successfully!");
      }
    } catch (error: any) {
      console.error("Error generating task:", error);
      toast.error(error.message || "Failed to generate task");
    } finally {
      setGenerating(false);
    }
  };

  const handleUseTask = () => {
    if (generatedTask) {
      onTaskGenerated(generatedTask);
      toast.success("Task details applied to form");
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-primary";
      case "medium": return "bg-eco-sun text-foreground";
      case "hard": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">AI Task Generator</h3>
      </div>

      {/* Example prompts */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Try these examples:</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_PROMPTS.map((example, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              className="text-xs h-auto py-1.5"
              onClick={() => setPrompt(example)}
            >
              {example}
            </Button>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div>
        <label className="text-sm font-medium mb-2 block">Focus Category (optional)</label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Any category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Category</SelectItem>
            <SelectItem value="recycling">Recycling</SelectItem>
            <SelectItem value="conservation">Conservation</SelectItem>
            <SelectItem value="water">Water</SelectItem>
            <SelectItem value="community">Community</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Prompt input */}
      <div>
        <label className="text-sm font-medium mb-2 block">Describe the task you want to create</label>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Create a fun recycling challenge for school students that teaches them about plastic waste..."
          rows={3}
          className="resize-none"
        />
      </div>

      {/* Generate button */}
      <Button 
        onClick={handleGenerate} 
        disabled={generating || !prompt.trim()}
        className="w-full"
      >
        {generating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Wand2 className="h-4 w-4 mr-2" />
            Generate Task
          </>
        )}
      </Button>

      {/* Generated task preview */}
      {generatedTask && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Generated Task
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-lg">{generatedTask.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{generatedTask.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{generatedTask.category}</Badge>
              <Badge className={getDifficultyColor(generatedTask.difficulty)}>
                {generatedTask.difficulty}
              </Badge>
              <Badge variant="secondary">{generatedTask.tier}</Badge>
              <Badge variant="outline">{generatedTask.points} points</Badge>
              <Badge variant="outline">{generatedTask.estimated_time}</Badge>
            </div>

            {generatedTask.instructions && generatedTask.instructions.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Instructions:</p>
                <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                  {generatedTask.instructions.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {generatedTask.location_required && (
              <p className="text-sm text-muted-foreground">📍 Location verification required</p>
            )}

            <div className="flex gap-2 pt-2">
              <Button onClick={handleUseTask} className="flex-1">
                Use This Task
              </Button>
              <Button variant="outline" onClick={handleGenerate} disabled={generating}>
                Regenerate
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
