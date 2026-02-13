import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Trophy, ArrowRight, RotateCcw, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MCQQuestion {
  id: string;
  type?: "mcq";
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface FillBlankQuestion {
  id: string;
  type: "fill-blank";
  question: string;
  blankSentence: string; // Use ___ for blank
  correctAnswer: string;
  acceptableAnswers?: string[]; // alternative accepted answers
  explanation: string;
}

export interface DragDropQuestion {
  id: string;
  type: "drag-drop";
  question: string;
  items: string[];
  correctOrder: string[];
  explanation: string;
}

export type Question = MCQQuestion | FillBlankQuestion | DragDropQuestion;

interface ModuleQuizProps {
  lessonId: string;
  lessonTitle: string;
  questions: Question[];
  onComplete: (score: number, passed: boolean) => void;
  trackColor: string;
}

// Drag and drop item component
function DragDropList({ items, onReorder }: { items: string[]; onReorder: (items: string[]) => void }) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setHoverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) return;
    const newItems = [...items];
    const [removed] = newItems.splice(dragIndex, 1);
    newItems.splice(index, 0, removed);
    onReorder(newItems);
    setDragIndex(null);
    setHoverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setHoverIndex(null);
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={`${item}-${index}`}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={() => handleDrop(index)}
          onDragEnd={handleDragEnd}
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg border-2 cursor-grab active:cursor-grabbing transition-all select-none",
            dragIndex === index && "opacity-50 border-primary",
            hoverIndex === index && dragIndex !== index && "border-primary/50 bg-primary/5",
            dragIndex === null && "border-border hover:border-primary/30"
          )}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-sm font-medium flex-1">{item}</span>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{index + 1}</span>
        </div>
      ))}
    </div>
  );
}

export function ModuleQuiz({ lessonId, lessonTitle, questions, onComplete, trackColor }: ModuleQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [fillAnswer, setFillAnswer] = useState("");
  const [dragItems, setDragItems] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const qType = question.type || "mcq";

  // Initialize drag items when moving to a drag-drop question
  const initDragItems = useCallback((q: Question) => {
    if (q.type === "drag-drop") {
      const shuffled = [...q.items].sort(() => Math.random() - 0.5);
      setDragItems(shuffled);
    }
  }, []);

  // Initialize on first render if first question is drag-drop
  useState(() => {
    if (question.type === "drag-drop") {
      initDragItems(question);
    }
  });

  const checkAnswer = (): boolean => {
    if (qType === "mcq" || !question.type) {
      const q = question as MCQQuestion;
      return parseInt(selectedAnswer) === q.correctAnswer;
    }
    if (qType === "fill-blank") {
      const q = question as FillBlankQuestion;
      const userAnswer = fillAnswer.trim().toLowerCase();
      const correct = q.correctAnswer.toLowerCase();
      const acceptable = q.acceptableAnswers?.map(a => a.toLowerCase()) || [];
      return userAnswer === correct || acceptable.includes(userAnswer);
    }
    if (qType === "drag-drop") {
      const q = question as DragDropQuestion;
      return JSON.stringify(dragItems) === JSON.stringify(q.correctOrder);
    }
    return false;
  };

  const handleSubmitAnswer = () => {
    const isCorrect = checkAnswer();
    if (isCorrect) setCorrectCount(prev => prev + 1);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      const nextQ = questions[currentQuestion + 1];
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
      setFillAnswer("");
      setShowResult(false);
      if (nextQ.type === "drag-drop") {
        initDragItems(nextQ);
      }
    } else {
      const finalScore = Math.round((correctCount / questions.length) * 100);
      const passed = finalScore >= 70;
      setQuizCompleted(true);
      onComplete(finalScore, passed);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setFillAnswer("");
    setShowResult(false);
    setCorrectCount(0);
    setQuizCompleted(false);
    if (questions[0].type === "drag-drop") {
      initDragItems(questions[0]);
    }
  };

  const isCorrect = showResult && checkAnswer();
  const finalScore = Math.round((correctCount / questions.length) * 100);

  const canSubmit = () => {
    if (qType === "mcq" || !question.type) return selectedAnswer !== "";
    if (qType === "fill-blank") return fillAnswer.trim() !== "";
    if (qType === "drag-drop") return dragItems.length > 0;
    return false;
  };

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
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
            {qType === "mcq" || !question.type ? "Multiple Choice" : qType === "fill-blank" ? "Fill in the Blank" : "Drag & Drop"}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <CardTitle className="text-lg leading-relaxed">
          {question.question}
        </CardTitle>

        {/* MCQ */}
        {(qType === "mcq" || !question.type) && (
          <RadioGroup
            value={selectedAnswer}
            onValueChange={setSelectedAnswer}
            disabled={showResult}
            className="space-y-3"
          >
            {(question as MCQQuestion).options.map((option, index) => {
              const isSelected = selectedAnswer === index.toString();
              const isCorrectOption = index === (question as MCQQuestion).correctAnswer;

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
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer font-normal">
                    {option}
                  </Label>
                  {showResult && isCorrectOption && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                  {showResult && isSelected && !isCorrectOption && <XCircle className="h-5 w-5 text-red-600" />}
                </div>
              );
            })}
          </RadioGroup>
        )}

        {/* Fill in the Blank */}
        {qType === "fill-blank" && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 border">
              <p className="text-base leading-relaxed">
                {(question as FillBlankQuestion).blankSentence.split("___").map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span className="inline-block min-w-[120px] border-b-2 border-primary mx-1 text-center font-semibold text-primary">
                        {showResult ? (question as FillBlankQuestion).correctAnswer : fillAnswer || "___"}
                      </span>
                    )}
                  </span>
                ))}
              </p>
            </div>
            <Input
              value={fillAnswer}
              onChange={(e) => setFillAnswer(e.target.value)}
              placeholder="Type your answer..."
              disabled={showResult}
              className={cn(
                "text-base",
                showResult && isCorrect && "border-green-500",
                showResult && !isCorrect && "border-red-500"
              )}
            />
          </div>
        )}

        {/* Drag and Drop */}
        {qType === "drag-drop" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Drag items to arrange them in the correct order:</p>
            {showResult ? (
              <div className="space-y-2">
                {dragItems.map((item, index) => {
                  const correctItem = (question as DragDropQuestion).correctOrder[index];
                  const isItemCorrect = item === correctItem;
                  return (
                    <div
                      key={`${item}-${index}`}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border-2 transition-all",
                        isItemCorrect ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
                      )}
                    >
                      <span className="text-sm font-medium flex-1">{item}</span>
                      {isItemCorrect ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <span className="text-xs text-red-600">→ {correctItem}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <DragDropList items={dragItems} onReorder={setDragItems} />
            )}
          </div>
        )}

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
              disabled={!canSubmit()}
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
