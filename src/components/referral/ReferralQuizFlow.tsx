import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Lock, Unlock, CheckCircle2, AlertCircle, Brain, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { getDeviceFingerprint, getUserIP } from "@/lib/deviceFingerprint";
import { ReferralSection } from "./ReferralSection";
import { Leaderboard } from "./Leaderboard";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the primary purpose of recycling?",
    options: ["To create more waste", "To reduce waste and conserve resources", "To increase pollution", "To use more energy"],
    correct: 1,
  },
  {
    id: 2,
    question: "Which of the following is a renewable energy source?",
    options: ["Coal", "Natural Gas", "Solar Power", "Nuclear Fission"],
    correct: 2,
  },
  {
    id: 3,
    question: "What does carbon footprint measure?",
    options: ["Shoe size", "Total greenhouse gas emissions", "Distance walked", "Weight of carbon"],
    correct: 1,
  },
  {
    id: 4,
    question: "Which practice best conserves water?",
    options: ["Leaving taps running", "Using drip irrigation", "Watering lawns at noon", "Washing cars daily"],
    correct: 1,
  },
  {
    id: 5,
    question: "What is biodiversity?",
    options: ["A type of fuel", "Variety of life in an ecosystem", "A weather pattern", "A building material"],
    correct: 1,
  },
];

export function ReferralQuizFlow() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [activeTab, setActiveTab] = useState<"quiz" | "referral" | "leaderboard">("quiz");

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from("profiles")
        .select("quiz_completed, quiz_attempts, extra_attempt_unlocked, bonus_given, valid_referrals, points, referral_code")
        .eq("id", user.id)
        .single();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const canAttemptQuiz = () => {
    if (!profile) return false;
    if (profile.quiz_attempts === 0) return true;
    if (profile.quiz_attempts === 1 && profile.extra_attempt_unlocked && !profile.bonus_given) return true;
    return false;
  };

  const getQuizStatus = () => {
    if (!profile) return "loading";
    if (profile.quiz_attempts === 0) return "first_attempt_available";
    if (profile.quiz_attempts === 1 && !profile.extra_attempt_unlocked) return "locked_need_referral";
    if (profile.quiz_attempts === 1 && profile.extra_attempt_unlocked && !profile.bonus_given) return "second_attempt_available";
    return "completed";
  };

  const startQuiz = () => {
    setQuizActive(true);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === QUIZ_QUESTIONS[currentQuestion].correct;
    const newScore = isCorrect ? score + 1 : score;
    if (isCorrect) setScore(newScore);

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion((q) => q + 1);
      setSelectedAnswer(null);
    } else {
      finishQuiz(newScore);
    }
  };

  const finishQuiz = async (finalScore?: number) => {
    const actualScore = finalScore ?? score;
    if (!user) return;
    setQuizFinished(true);
    setQuizActive(false);

    const isSecondAttempt = profile.quiz_attempts === 1;
    const newAttempts = (profile.quiz_attempts || 0) + 1;
    const basePoints = Math.round((actualScore / QUIZ_QUESTIONS.length) * 20);
    const bonusPoints = isSecondAttempt ? 5 : 0;
    const totalNewPoints = basePoints + bonusPoints;

    try {
      // Update profile
      const updates: any = {
        quiz_completed: true,
        quiz_attempts: newAttempts,
        points: (profile.points || 0) + totalNewPoints,
      };

      if (isSecondAttempt) {
        updates.bonus_given = true;
      }

      await supabase.from("profiles").update(updates).eq("id", user.id);

      // Store device/IP info
      const deviceId = getDeviceFingerprint();
      const userIP = await getUserIP();
      await supabase
        .from("profiles")
        .update({ device_id: deviceId, user_ip: userIP })
        .eq("id", user.id);

      // If first attempt, try to validate referral (the referred user completed quiz)
      if (!isSecondAttempt) {
        // Update referral record if this user was referred
        await supabase
          .from("referrals")
          .update({
            quiz_completed: true,
            referred_ip: userIP,
            referred_device_id: deviceId,
          })
          .eq("referred_id", user.id);

        // Try to validate (server-side function handles all checks)
        await supabase.rpc("validate_referral", { p_referred_id: user.id });
      }

      // Log activity
      await supabase.from("activity_logs").insert({
        user_id: user.id,
        event_type: "quiz_completed",
        payload: {
          attempt: newAttempts,
          score: actualScore,
          total: QUIZ_QUESTIONS.length,
          points_earned: totalNewPoints,
          bonus: bonusPoints > 0,
        },
      });

      toast.success(
        `Quiz completed! You earned ${totalNewPoints} points${bonusPoints > 0 ? " (including +5 bonus)" : ""}`
      );

      fetchProfile();
    } catch (error) {
      console.error("Error saving quiz result:", error);
      toast.error("Failed to save quiz results");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
      </div>
    );
  }

  const status = getQuizStatus();

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b pb-2">
        <Button
          variant={activeTab === "quiz" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("quiz")}
        >
          <Brain className="h-4 w-4 mr-1" />
          Quiz
        </Button>
        <Button
          variant={activeTab === "referral" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("referral")}
          disabled={!profile?.quiz_completed}
        >
          <Unlock className="h-4 w-4 mr-1" />
          Referral
        </Button>
        <Button
          variant={activeTab === "leaderboard" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("leaderboard")}
        >
          🏆 Leaderboard
        </Button>
      </div>

      {/* Quiz Tab */}
      {activeTab === "quiz" && (
        <>
          {quizActive ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
                  </CardTitle>
                  <Badge variant="secondary">Score: {score}</Badge>
                </div>
                <Progress
                  value={((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}
                  className="h-2"
                />
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-base font-medium">
                  {QUIZ_QUESTIONS[currentQuestion].question}
                </p>
                <div className="space-y-2">
                  {QUIZ_QUESTIONS[currentQuestion].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedAnswer(idx)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedAnswer === idx
                          ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      }`}
                    >
                      <span className="text-sm">{option}</span>
                    </button>
                  ))}
                </div>
                <Button
                  onClick={submitAnswer}
                  disabled={selectedAnswer === null}
                  className="w-full"
                >
                  {currentQuestion < QUIZ_QUESTIONS.length - 1 ? (
                    <>
                      Next <ArrowRight className="h-4 w-4 ml-1" />
                    </>
                  ) : (
                    "Submit Quiz"
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : quizFinished ? (
            <Card className="border-green-500/20 bg-green-500/5">
              <CardContent className="p-6 text-center space-y-4">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
                <h3 className="text-xl font-bold">Quiz Completed!</h3>
                <p className="text-muted-foreground">
                  You scored {score}/{QUIZ_QUESTIONS.length}
                </p>
                {profile?.quiz_attempts === 1 && (
                  <p className="text-sm text-muted-foreground">
                    Share your referral link to unlock a bonus attempt!
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 space-y-4">
                {status === "first_attempt_available" && (
                  <div className="text-center space-y-4">
                    <Brain className="h-12 w-12 text-primary mx-auto" />
                    <h3 className="text-xl font-bold">Knowledge Quiz</h3>
                    <p className="text-sm text-muted-foreground">
                      Test your environmental knowledge. {QUIZ_QUESTIONS.length} questions await!
                    </p>
                    <Button onClick={startQuiz} size="lg">
                      Start Quiz
                    </Button>
                  </div>
                )}

                {status === "locked_need_referral" && (
                  <div className="text-center space-y-4">
                    <Lock className="h-12 w-12 text-muted-foreground mx-auto" />
                    <h3 className="text-xl font-bold">Second Attempt Locked</h3>
                    <p className="text-sm text-muted-foreground">
                      Get at least 1 valid referral to unlock your bonus attempt (+5 points).
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <Badge variant="secondary">
                        Valid Referrals: {profile?.valid_referrals || 0}/1
                      </Badge>
                    </div>
                    <Button variant="outline" onClick={() => setActiveTab("referral")}>
                      Go to Referral Section
                    </Button>
                  </div>
                )}

                {status === "second_attempt_available" && (
                  <div className="text-center space-y-4">
                    <Unlock className="h-12 w-12 text-green-500 mx-auto" />
                    <h3 className="text-xl font-bold">Bonus Attempt Unlocked!</h3>
                    <p className="text-sm text-muted-foreground">
                      You earned a second attempt through referrals. Complete it for +5 bonus points!
                    </p>
                    <Button onClick={startQuiz} size="lg" className="bg-green-600 hover:bg-green-700">
                      Start Bonus Attempt
                    </Button>
                  </div>
                )}

                {status === "completed" && (
                  <div className="text-center space-y-4">
                    <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
                    <h3 className="text-xl font-bold">All Attempts Used</h3>
                    <p className="text-sm text-muted-foreground">
                      You've completed all available quiz attempts. Check the leaderboard!
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Badge>Attempts: {profile?.quiz_attempts}/2</Badge>
                      <Badge variant="secondary">Points: {profile?.points}</Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Referral Tab */}
      {activeTab === "referral" && <ReferralSection />}

      {/* Leaderboard Tab */}
      {activeTab === "leaderboard" && <Leaderboard />}
    </div>
  );
}
