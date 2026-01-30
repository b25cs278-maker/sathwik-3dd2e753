import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface KaraokeSubtitleProps {
  text: string;
  isPlaying: boolean;
  isSpeaking: boolean;
  duration: number; // scene duration in seconds
}

// Approximate words per line based on average word length
const WORDS_PER_LINE = 8;
const MAX_LINES = 3;
const WORDS_TO_SHOW = WORDS_PER_LINE * MAX_LINES; // ~24 words visible at a time

export function KaraokeSubtitle({ text, isPlaying, isSpeaking, duration }: KaraokeSubtitleProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Split text into words
  const words = useMemo(() => {
    return text.split(/\s+/).filter(word => word.length > 0);
  }, [text]);

  // Calculate time per word based on duration and word count
  const timePerWord = useMemo(() => {
    const totalTime = Math.min(duration * 0.85, words.length * 0.35);
    return (totalTime * 1000) / words.length;
  }, [duration, words.length]);

  // Calculate visible word range (sliding window around current word)
  const visibleRange = useMemo(() => {
    if (currentWordIndex < 0) {
      return { start: 0, end: Math.min(WORDS_TO_SHOW, words.length) };
    }
    
    // Keep current word in the middle-ish of the visible range
    const halfWindow = Math.floor(WORDS_TO_SHOW / 2);
    let start = Math.max(0, currentWordIndex - halfWindow);
    let end = start + WORDS_TO_SHOW;
    
    // Adjust if we're near the end
    if (end > words.length) {
      end = words.length;
      start = Math.max(0, end - WORDS_TO_SHOW);
    }
    
    return { start, end };
  }, [currentWordIndex, words.length]);

  // Get visible words
  const visibleWords = useMemo(() => {
    return words.slice(visibleRange.start, visibleRange.end);
  }, [words, visibleRange]);

  // Reset when text changes or playback starts
  useEffect(() => {
    if (isPlaying && isSpeaking) {
      setCurrentWordIndex(0);
      setStartTime(Date.now());
    } else if (!isPlaying) {
      setCurrentWordIndex(-1);
      setStartTime(null);
    }
  }, [isPlaying, isSpeaking, text]);

  // Animate through words while speaking
  useEffect(() => {
    if (!isPlaying || !isSpeaking || startTime === null) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newIndex = Math.floor(elapsed / timePerWord);
      
      if (newIndex < words.length) {
        setCurrentWordIndex(newIndex);
      } else {
        setCurrentWordIndex(words.length - 1);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, isSpeaking, startTime, timePerWord, words.length]);

  // Reset when speech ends
  useEffect(() => {
    if (!isSpeaking && currentWordIndex >= 0) {
      setCurrentWordIndex(words.length - 1);
    }
  }, [isSpeaking, currentWordIndex, words.length]);

  if (!isPlaying) return null;

  return (
    <motion.div
      className="absolute bottom-4 left-1/2 -translate-x-1/2 w-auto max-w-[85%] md:max-w-[70%] px-2 z-20"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-black/85 backdrop-blur-sm rounded-md px-4 py-2 shadow-lg">
        <p className="text-center leading-relaxed text-xs md:text-sm line-clamp-3">
          <AnimatePresence mode="popLayout">
            {visibleWords.map((word, index) => {
              const actualIndex = visibleRange.start + index;
              return (
                <motion.span
                  key={`${actualIndex}-${word}`}
                  className={cn(
                    "inline-block mx-0.5 transition-colors duration-100",
                    actualIndex <= currentWordIndex
                      ? "text-white font-medium"
                      : "text-white/40"
                  )}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: actualIndex === currentWordIndex ? 1.05 : 1,
                  }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                >
                  {word}
                </motion.span>
              );
            })}
          </AnimatePresence>
        </p>
      </div>
    </motion.div>
  );
}
