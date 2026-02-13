import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Flashcard {
  front: string;
  back: string;
}

interface FlashcardDeckProps {
  flashcards: Flashcard[];
  trackColor: string;
}

export function FlashcardDeck({ flashcards, trackColor }: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const card = flashcards[currentIndex];

  const goNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center text-sm text-muted-foreground mb-2">
        Card {currentIndex + 1} of {flashcards.length} — Tap to flip
      </div>

      <div
        className="perspective-1000 cursor-pointer mx-auto max-w-lg"
        style={{ perspective: "1000px" }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className="relative w-full transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            minHeight: "200px",
          }}
        >
          {/* Front */}
          <Card
            className="absolute inset-0 border-2 border-primary/20"
            style={{ backfaceVisibility: "hidden" }}
          >
            <CardContent className="flex items-center justify-center p-8 min-h-[200px]">
              <div className="text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-3 block">
                  Question
                </span>
                <p className="text-lg font-semibold text-foreground">{card.front}</p>
              </div>
            </CardContent>
          </Card>

          {/* Back */}
          <Card
            className={cn("absolute inset-0 border-2", `bg-gradient-to-br ${trackColor} text-white`)}
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <CardContent className="flex items-center justify-center p-8 min-h-[200px]">
              <div className="text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/80 mb-3 block">
                  Answer
                </span>
                <p className="text-lg font-medium">{card.back}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={goPrev}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <RotateCcw className="h-4 w-4 mr-1" /> Flip
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={goNext}
          disabled={currentIndex === flashcards.length - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-1.5">
        {flashcards.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrentIndex(i); setIsFlipped(false); }}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all",
              i === currentIndex ? "bg-primary scale-125" : "bg-muted-foreground/30"
            )}
          />
        ))}
      </div>
    </div>
  );
}
