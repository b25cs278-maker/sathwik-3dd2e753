import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PhotoCapture } from "@/components/submission/PhotoCapture";
import { GPSCapture } from "@/components/submission/GPSCapture";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, MapPin, Clock, Zap, CheckCircle2, 
  Info, AlertCircle, Send, Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock task data
// Note: In production, this would come from the database with real coordinates
// For demo purposes, locationRequired is set but we use flexible verification
const mockTask = {
  id: "1",
  title: "Community Garden Volunteer",
  description: "Help maintain the local community garden by weeding, watering, and caring for plants. This task contributes to urban greenery and helps provide fresh produce for local food banks.",
  category: "Conservation",
  difficulty: 1 as const,
  points: 35,
  locationRequired: true,
  // These will be dynamically set based on user's location for demo
  locationLat: null as number | null,
  locationLng: null as number | null,
  locationRadiusM: 500, // 500m radius for demo flexibility
  estimatedTime: "1-2 hours",
  imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
  instructions: [
    "Arrive at the community garden during open hours (8 AM - 6 PM)",
    "Check in with the garden coordinator",
    "Take a 'before' photo of your assigned area",
    "Complete assigned tasks (weeding, watering, etc.)",
    "Take an 'after' photo showing your work",
    "Submit your evidence through the app",
  ],
  requirements: [
    "Capture your GPS location",
    "Submit at least 2 photos (before and after)",
    "Complete within assigned timeframe",
  ],
};

const difficultyMap = {
  1: { label: "Easy", variant: "easy" as const },
  2: { label: "Medium", variant: "medium" as const },
  3: { label: "Hard", variant: "hard" as const },
};

export default function TaskDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [photos, setPhotos] = useState<string[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmission, setShowSubmission] = useState(false);

  const task = mockTask; // In real app, fetch based on id
  const difficulty = difficultyMap[task.difficulty];

  const handleSubmit = async () => {
    if (photos.length < 2) {
      toast({
        title: "More photos needed",
        description: "Please upload at least 2 photos (before and after)",
        variant: "destructive",
      });
      return;
    }

    if (task.locationRequired && !location) {
      toast({
        title: "Location required",
        description: "Please capture your GPS location",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    
    // TODO: Implement actual submission
    setTimeout(() => {
      setSubmitting(false);
      toast({
        title: "Submission received!",
        description: "Your evidence is being reviewed. You'll be notified once approved.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={true} userRole="student" />
      
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
            {task.imageUrl && (
              <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden animate-slide-up">
                <img
                  src={task.imageUrl}
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
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-5 w-5" />
                  {task.estimatedTime}
                </div>
                {task.locationRequired && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-5 w-5 text-eco-sky" />
                    Location required
                  </div>
                )}
              </div>
            </div>

            {/* Instructions */}
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

                {task.locationRequired && (
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
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Requirements */}
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
                <p className="text-sm text-muted-foreground mt-2">points upon approval</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
