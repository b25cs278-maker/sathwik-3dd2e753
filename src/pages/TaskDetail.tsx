import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PhotoCapture } from "@/components/submission/PhotoCapture";
import { GPSCapture } from "@/components/submission/GPSCapture";
import { TaskEvaluation } from "@/components/evaluation/TaskEvaluation";
import { EvaluationHistory } from "@/components/evaluation/EvaluationHistory";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, MapPin, Clock, Zap, CheckCircle2, 
  Info, AlertCircle, Send, Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface TaskData {
  id: string;
  title: string;
  description: string | null;
  category: string;
  difficulty: string;
  points: number;
  location_required: boolean;
  estimated_time: string | null;
  image_url: string | null;
  instructions: string[];
  requirements: string[];
}

const difficultyMap = {
  easy: { label: "Easy", variant: "easy" as const },
  medium: { label: "Medium", variant: "medium" as const },
  hard: { label: "Hard", variant: "hard" as const },
};

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, role, signOut } = useAuth();
  
  const [task, setTask] = useState<TaskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState<string[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmission, setShowSubmission] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    async function fetchTask() {
      if (!id) return;

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        toast({ title: "Task not found", variant: "destructive" });
        navigate("/tasks");
        return;
      }

      setTask({
        id: data.id,
        title: data.title,
        description: data.description,
        category: data.category,
        difficulty: data.difficulty,
        points: data.points,
        location_required: data.location_required,
        estimated_time: data.estimated_time,
        image_url: data.image_url,
        instructions: Array.isArray(data.instructions) ? data.instructions as string[] : [],
        requirements: Array.isArray(data.requirements) ? data.requirements as string[] : [],
      });
      setLoading(false);
    }

    fetchTask();
  }, [id, navigate, toast]);

  const handleSubmit = async () => {
    if (!task || !user) {
      toast({ title: "Please log in to submit tasks", variant: "destructive" });
      return;
    }

    if (photos.length < 2) {
      toast({
        title: "More photos needed",
        description: "Please upload at least 2 photos (before and after)",
        variant: "destructive",
      });
      return;
    }

    if (task.location_required && !location) {
      toast({
        title: "Location required",
        description: "Please capture your GPS location",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    
    // Create submission with pending status
    const { data: submission, error: submitError } = await supabase
      .from("task_submissions")
      .insert({
        task_id: task.id,
        user_id: user.id,
        status: "approved", // Auto-approve for now (can be changed to pending for admin review)
        photos: photos,
        location_lat: location?.lat,
        location_lng: location?.lng,
        location_accuracy: location?.accuracy,
        points_awarded: task.points,
        metadata: { submitted_at: new Date().toISOString() },
      })
      .select()
      .single();

    if (submitError || !submission) {
      console.error("Submission error:", submitError);
      toast({ title: "Error submitting task", variant: "destructive" });
      setSubmitting(false);
      return;
    }

    // Store submission ID for evaluation
    setSubmissionId(submission.id);

    // Update user points in profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("points")
      .eq("id", user.id)
      .maybeSingle();
    
    if (profile) {
      const { error: pointsError } = await supabase
        .from("profiles")
        .update({ points: (profile.points || 0) + task.points })
        .eq("id", user.id);

      if (pointsError) {
        console.error("Points update error:", pointsError);
      }
    }

    setSubmitting(false);
    setIsSubmitted(true);
    toast({
      title: "Task Completed! 🎉",
      description: `You earned ${task.points} points! AI evaluation is available below.`,
    });
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!task) return null;

  const difficulty = difficultyMap[task.difficulty as keyof typeof difficultyMap] || difficultyMap.easy;

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={!!user} userRole={role || "student"} onLogout={handleLogout} />
      
      <main className="container py-8">
        {/* Back Button */}
        <Link to="/tasks" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tasks
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            {task.image_url && (
              <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden animate-slide-up">
                <img
                  src={task.image_url}
                  alt={task.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <Badge variant={difficulty.variant}>{difficulty.label}</Badge>
                  <Badge variant="secondary">{task.category}</Badge>
                </div>
              </div>
            )}

            {/* Task Info */}
            <div className="animate-slide-up delay-100">
              <h1 className="text-3xl font-display font-bold text-foreground mb-4">
                {task.title}
              </h1>
              <p className="text-muted-foreground mb-6">
                {task.description}
              </p>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Zap className="h-5 w-5 text-eco-sun" />
                  <span className="font-semibold text-foreground">{task.points}</span> points
                </div>
                {task.estimated_time && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-5 w-5" />
                    {task.estimated_time}
                  </div>
                )}
                {task.location_required && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-5 w-5 text-eco-sky" />
                    Location required
                  </div>
                )}
              </div>
            </div>

            {/* Instructions */}
            {task.instructions.length > 0 && (
              <Card variant="eco" className="animate-slide-up delay-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    How to Complete
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {task.instructions.map((instruction, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-muted-foreground">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}

            {/* Submission Form */}
            {showSubmission && (
              <div className="space-y-6 animate-slide-up">
                <Card variant="eco">
                  <CardHeader>
                    <CardTitle>Upload Evidence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PhotoCapture
                      photos={photos}
                      onPhotosChange={setPhotos}
                      maxPhotos={4}
                    />
                  </CardContent>
                </Card>

                {task.location_required && (
                  <Card variant="eco">
                    <CardHeader>
                      <CardTitle>Verify Location</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <GPSCapture
                        onLocationCapture={(lat, lng, accuracy) => setLocation({ lat, lng, accuracy })}
                        currentLocation={location}
                      />
                      <p className="text-xs text-muted-foreground mt-3 text-center">
                        Your location will be recorded for verification purposes
                      </p>
                    </CardContent>
                  </Card>
                )}

                <Button
                  variant="hero"
                  size="lg"
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Submit Evidence
                    </>
                  )}
                </Button>

                {/* AI Evaluation after submission */}
                {isSubmitted && submissionId && (
                  <div className="animate-slide-up">
                    <TaskEvaluation
                      taskId={task.id}
                      submissionId={submissionId}
                      taskTitle={task.title}
                      taskDescription={task.description || undefined}
                      submissionDetails={`User submitted ${photos.length} photos as evidence. ${location ? 'Location verified.' : ''}`}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Requirements */}
            {task.requirements.length > 0 && (
              <Card variant="eco" className="animate-slide-up delay-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-eco-sun" />
                    Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {task.requirements.map((req, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Start/Continue Button */}
            {!showSubmission ? (
              <Button
                variant="hero"
                size="lg"
                className="w-full"
                onClick={() => setShowSubmission(true)}
              >
                Start This Task
              </Button>
            ) : (
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => setShowSubmission(false)}
              >
                Cancel Submission
              </Button>
            )}

            {/* Points Preview */}
            <Card variant="glass">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">You'll earn</p>
                <div className="flex items-center justify-center gap-2">
                  <Zap className="h-8 w-8 text-eco-sun" />
                  <span className="text-4xl font-display font-bold text-foreground">
                    {task.points}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">points upon completion</p>
              </CardContent>
            </Card>

            {/* Evaluation History */}
            <div className="animate-slide-up delay-200">
              <EvaluationHistory />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}