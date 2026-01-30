import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface KaraokeSubtitleProps {
  text: string;
  isPlaying: boolean;
  isSpeaking: boolean;
  duration: number; // scene duration in seconds
}

export function KaraokeSubtitle({ text, isPlaying, isSpeaking, duration }: KaraokeSubtitleProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Split text into words
  const words = useMemo(() => {
    return text.split(/\s+/).filter(word => word.length > 0);
  }, [text]);

  // Calculate time per word based on duration and word count
  const timePerWord = useMemo(() => {
    // Estimate speaking rate - roughly 150 words per minute for clear narration
    // But we also need to fit within the scene duration
    const totalTime = Math.min(duration * 0.85, words.length * 0.35); // 350ms per word average
    return (totalTime * 1000) / words.length; // in milliseconds
  }, [duration, words.length]);

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
    }, 50); // Update every 50ms for smooth animation

    return () => clearInterval(interval);
  }, [isPlaying, isSpeaking, startTime, timePerWord, words.length]);

  // Reset when speech ends
  useEffect(() => {
    if (!isSpeaking && currentWordIndex >= 0) {
      // Keep showing all words highlighted when speech ends
      setCurrentWordIndex(words.length - 1);
    }
  }, [isSpeaking, currentWordIndex, words.length]);

  if (!isPlaying) return null;

  return (
    <motion.div
      className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-20"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-black/80 backdrop-blur-sm rounded-lg px-6 py-4 shadow-2xl">
        <p className="text-center leading-relaxed text-base md:text-lg lg:text-xl">
          {words.map((word, index) => (
            <motion.span
              key={`${word}-${index}`}
              className={cn(
                "inline-block mx-0.5 transition-all duration-150",
                index <= currentWordIndex
                  ? "text-white font-semibold"
                  : "text-white/40"
              )}
              initial={false}
              animate={{
                scale: index === currentWordIndex ? 1.05 : 1,
                y: index === currentWordIndex ? -1 : 0,
              }}
              transition={{ duration: 0.1 }}
            >
              {word}
            </motion.span>
          ))}
        </p>
      </div>
    </motion.div>
  );
}
