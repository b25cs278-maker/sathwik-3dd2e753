import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Trophy, ArrowRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface ModuleQuizProps {
  lessonId: string;
  lessonTitle: string;
  questions: Question[];
  onComplete: (score: number, passed: boolean) => void;
  trackColor: string;
}

export function ModuleQuiz({ lessonId, lessonTitle, questions, onComplete, trackColor }: ModuleQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleSubmitAnswer = () => {
    const answerIndex = parseInt(selectedAnswer);
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
      setShowResult(false);
    } else {
      // Quiz completed
      const correctCount = answers.filter((ans, idx) => ans === questions[idx].correctAnswer).length;
      // Check the last answer too
      const finalCorrectCount = selectedAnswer && parseInt(selectedAnswer) === question.correctAnswer 
        ? correctCount + 1 
        : correctCount;
      const score = Math.round((finalCorrectCount / questions.length) * 100);
      const passed = score >= 70;
      setQuizCompleted(true);
      onComplete(score, passed);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setShowResult(false);
    setAnswers([]);
    setQuizCompleted(false);
  };

  const isCorrect = showResult && parseInt(selectedAnswer) === question.correctAnswer;
  const finalScore = answers.length === questions.length 
    ? Math.round((answers.filter((ans, idx) => ans === questions[idx].correctAnswer).length / questions.length) * 100)
    : 0;

  if (quizCompleted) {
    const passed = finalScore >= 70;
    return (
      <Card className="border-2 border-primary/20">
        <CardContent className="p-8 text-center">
          <div className={cn(
            "w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center",
            passed ? "bg-green-100" : "bg-red-100"
          )}>
            {passed ? (
              <Trophy className="h-10 w-10 text-green-600" />
            ) : (
              <XCircle className="h-10 w-10 text-red-600" />
            )}
          </div>
          <h3 className="text-2xl font-bold mb-2">
            {passed ? "Congratulations!" : "Keep Learning!"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {passed 
              ? `You scored ${finalScore}% and passed the quiz!`
              : `You scored ${finalScore}%. You need 70% to pass.`
            }
          </p>
          <div className="flex gap-3 justify-center">
            {!passed && (
              <Button variant="outline" onClick={handleRetry}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Retry Quiz
              </Button>
            )}
            {passed && (
              <Button className={`bg-gradient-to-r ${trackColor} text-white`}>
                Continue Learning
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-primary">
            {lessonTitle} Quiz
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <CardTitle className="text-lg leading-relaxed">
          {question.question}
        </CardTitle>

        <RadioGroup
          value={selectedAnswer}
          onValueChange={setSelectedAnswer}
          disabled={showResult}
          className="space-y-3"
        >
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index.toString();
            const isCorrectOption = index === question.correctAnswer;
            
            return (
              <div
                key={index}
                className={cn(
                  "flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer",
                  showResult && isCorrectOption && "border-green-500 bg-green-50",
                  showResult && isSelected && !isCorrectOption && "border-red-500 bg-red-50",
                  !showResult && isSelected && "border-primary bg-primary/5",
                  !showResult && !isSelected && "border-border hover:border-primary/50"
                )}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label 
                  htmlFor={`option-${index}`} 
                  className="flex-1 cursor-pointer font-normal"
                >
                  {option}
                </Label>
                {showResult && isCorrectOption && (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                )}
                {showResult && isSelected && !isCorrectOption && (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
            );
          })}
        </RadioGroup>

        {showResult && (
          <div className={cn(
            "p-4 rounded-lg",
            isCorrect ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"
          )}>
            <p className="text-sm font-medium mb-1">
              {isCorrect ? "✓ Correct!" : "✗ Not quite right"}
            </p>
            <p className="text-sm text-muted-foreground">
              {question.explanation}
            </p>
          </div>
        )}

        <div className="flex justify-end">
          {!showResult ? (
            <Button 
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
              className={`bg-gradient-to-r ${trackColor} text-white`}
            >
              Submit Answer
            </Button>
          ) : (
            <Button 
              onClick={handleNextQuestion}
              className={`bg-gradient-to-r ${trackColor} text-white`}
            >
              {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
