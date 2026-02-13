import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FlashcardDeck } from "./FlashcardDeck";
import { ModuleQuiz, type Question } from "./ModuleQuiz";
import { Play, Layers, HelpCircle, FileText, CheckCircle2, ArrowRight, X, ExternalLink, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Flashcard {
  front: string;
  back: string;
}

interface LessonStepperProps {
  lessonId: string;
  lessonTitle: string;
  lessonDescription: string;
  trackTitle: string;
  trackColor: string;
  videoUrl: string;
  resourcePdfUrl: string | null;
  quizQuestions: Question[] | null;
  learningObjectives: string[];
  onComplete: (quizScore: number, passed: boolean) => void;
  onClose: () => void;
  onVideoCompleted: () => void;
}

const steps = [
  { id: "video", label: "Video", icon: Play },
  { id: "flashcards", label: "Flashcards", icon: Layers },
  { id: "quiz", label: "Quiz", icon: HelpCircle },
  { id: "resources", label: "Resources", icon: FileText },
];

export function LessonStepper({
  lessonId,
  lessonTitle,
  lessonDescription,
  trackTitle,
  trackColor,
  videoUrl,
  resourcePdfUrl,
  quizQuestions,
  learningObjectives,
  onComplete,
  onClose,
  onVideoCompleted,
}: LessonStepperProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loadingFlashcards, setLoadingFlashcards] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const getYoutubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([^&?\s]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const fetchFlashcards = async () => {
    setLoadingFlashcards(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-flashcards", {
        body: { lessonTitle, lessonDescription, trackTitle },
      });
      if (error) throw error;
      if (data?.flashcards) {
        setFlashcards(data.flashcards);
      }
    } catch (e) {
      console.error("Failed to generate flashcards:", e);
      toast.error("Failed to generate flashcards. Please try again.");
    } finally {
      setLoadingFlashcards(false);
    }
  };

  const markStepComplete = (stepIndex: number) => {
    setCompletedSteps((prev) => new Set([...prev, stepIndex]));
  };

  const handleVideoComplete = () => {
    markStepComplete(0);
    onVideoCompleted();
    setCurrentStep(1);
    fetchFlashcards();
  };

  const handleFlashcardsComplete = () => {
    markStepComplete(1);
    setCurrentStep(2);
  };

  const handleQuizComplete = (score: number, passed: boolean) => {
    markStepComplete(2);
    onComplete(score, passed);
    setCurrentStep(3);
  };

  const handleResourcesComplete = () => {
    markStepComplete(3);
  };

  return (
    <div className="space-y-6">
      {/* Close button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold font-display">{lessonTitle}</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-2">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = completedSteps.has(index);
          return (
            <button
              key={step.id}
              onClick={() => {
                if (isCompleted || index <= currentStep) setCurrentStep(index);
              }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all flex-1 justify-center",
                isActive && "bg-primary text-primary-foreground shadow-md",
                isCompleted && !isActive && "bg-primary/10 text-primary",
                !isActive && !isCompleted && "bg-muted text-muted-foreground"
              )}
            >
              {isCompleted ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <Icon className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline">{step.label}</span>
            </button>
          );
        })}
      </div>

      {/* Step content */}
      {currentStep === 0 && (
        <Card>
          <CardContent className="p-0 overflow-hidden rounded-xl">
            {/* Learning Objectives */}
            {learningObjectives.length > 0 && (
              <div className="p-4 border-b bg-muted/30">
                <h4 className="text-sm font-semibold flex items-center gap-2 mb-2 text-foreground">
                  <Target className="h-4 w-4 text-primary" />
                  What you'll learn
                </h4>
                <ul className="space-y-1.5">
                  {learningObjectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 text-primary/60 shrink-0" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {getYoutubeEmbedUrl(videoUrl) ? (
              <div className="aspect-video w-full">
                <iframe
                  src={getYoutubeEmbedUrl(videoUrl)!}
                  title={lessonTitle}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <p>Unable to load video. <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">Open in browser</a></p>
              </div>
            )}
            <div className="p-4 flex justify-end">
              <Button onClick={handleVideoComplete} className={`bg-gradient-to-r ${trackColor} text-white`}>
                Done Watching <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Flashcards — {lessonTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingFlashcards ? (
              <div className="space-y-4 py-8">
                <Skeleton className="h-48 w-full max-w-lg mx-auto rounded-xl" />
                <p className="text-center text-sm text-muted-foreground">Generating flashcards with AI...</p>
              </div>
            ) : flashcards.length > 0 ? (
              <>
                <FlashcardDeck flashcards={flashcards} trackColor={trackColor} />
                <div className="mt-6 flex justify-end">
                  <Button onClick={handleFlashcardsComplete} className={`bg-gradient-to-r ${trackColor} text-white`}>
                    Continue to Quiz <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No flashcards available yet.</p>
                <Button onClick={fetchFlashcards}>Generate Flashcards</Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <div>
          {quizQuestions && quizQuestions.length > 0 ? (
            <ModuleQuiz
              lessonId={lessonId}
              lessonTitle={lessonTitle}
              questions={quizQuestions}
              onComplete={handleQuizComplete}
              trackColor={trackColor}
            />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <HelpCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No quiz available for this lesson yet.</p>
                <Button onClick={() => { markStepComplete(2); setCurrentStep(3); }} variant="outline">
                  Skip to Resources <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Resources — {lessonTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {resourcePdfUrl ? (
              <a
                href={resourcePdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted transition-colors"
              >
                <FileText className="h-8 w-8 text-red-500" />
                <div className="flex-1">
                  <p className="font-medium">Lesson PDF Resource</p>
                  <p className="text-sm text-muted-foreground">Download or view the lesson material</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
            ) : (
              <div className="p-4 rounded-lg border bg-muted/50 text-center">
                <p className="text-muted-foreground">No additional resources available for this lesson.</p>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <Button
                onClick={() => {
                  handleResourcesComplete();
                  onClose();
                  toast.success("Lesson completed! 🎉");
                }}
                className={`bg-gradient-to-r ${trackColor} text-white`}
              >
                <CheckCircle2 className="h-4 w-4 mr-1" /> Finish Lesson
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
