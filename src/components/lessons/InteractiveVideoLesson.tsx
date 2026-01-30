import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX,
  CheckCircle2, XCircle, ArrowRight, Lightbulb, HelpCircle,
  MousePointer, Hand
} from "lucide-react";
import { useVoiceNarration } from "@/hooks/useVoiceNarration";
import { cn } from "@/lib/utils";
import { KaraokeSubtitle } from "./KaraokeSubtitle";

export interface InteractiveElement {
  type: "click-reveal" | "drag-match" | "choice" | "highlight-tap";
  question?: string;
  options?: { id: string; label: string; isCorrect?: boolean; matchTo?: string }[];
  correctFeedback?: string;
  incorrectFeedback?: string;
  hint?: string;
}

export interface AnimationElement {
  type: "text" | "icon" | "shape" | "image" | "character" | "animated-list" | "code-block" | "comparison";
  content: string | string[];
  position: { x: number; y: number };
  animation: "fadeIn" | "slideUp" | "slideLeft" | "slideRight" | "bounce" | "pulse" | "typewriter" | "stagger";
  delay: number;
  color?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export interface InteractiveScene {
  id: string;
  duration: number;
  narration: string;
  visualType: "intro" | "concept" | "example" | "diagram" | "summary" | "interactive" | "deep-dive" | "real-world" | "hands-on";
  elements: AnimationElement[];
  interaction?: InteractiveElement;
  keyTakeaway?: string;
}

interface InteractiveVideoLessonProps {
  scenes: InteractiveScene[];
  title: string;
  onComplete: () => void;
  onSceneChange?: (sceneIndex: number) => void;
}

export function InteractiveVideoLesson({ 
  scenes, 
  title, 
  onComplete,
  onSceneChange 
}: InteractiveVideoLessonProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [waitingForNarration, setWaitingForNarration] = useState(false);
  const [waitingForInteraction, setWaitingForInteraction] = useState(false);
  const [interactionComplete, setInteractionComplete] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [interactionFeedback, setInteractionFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [revealedItems, setRevealedItems] = useState<Set<string>>(new Set());
  const [showKeyTakeaway, setShowKeyTakeaway] = useState(false);
  const hasStartedNarrationRef = useRef(false);

  const { speak, stop, isSpeaking, isSupported } = useVoiceNarration({
    rate: 0.9,
    pitch: 1.0,
  });

  const scene = scenes[currentScene];
  const totalDuration = scenes.reduce((acc, s) => acc + s.duration, 0);
  const currentTime = scenes.slice(0, currentScene).reduce((acc, s) => acc + s.duration, 0) + 
    (progress / 100) * scene.duration;

  // Handle voice narration
  useEffect(() => {
    if (isPlaying && !isMuted && isSupported && scene.narration && !hasStartedNarrationRef.current) {
      hasStartedNarrationRef.current = true;
      speak(scene.narration);
    }
  }, [isPlaying, isMuted, currentScene, scene.narration, speak, isSupported]);

  useEffect(() => {
    hasStartedNarrationRef.current = false;
    setInteractionComplete(false);
    setSelectedOption(null);
    setInteractionFeedback(null);
    setRevealedItems(new Set());
    setWaitingForInteraction(false);
    setShowKeyTakeaway(false);
  }, [currentScene]);

  useEffect(() => {
    if (waitingForNarration && !isSpeaking && isPlaying) {
      setWaitingForNarration(false);
      
      // Check if scene has interaction
      if (scene.interaction && !interactionComplete) {
        setWaitingForInteraction(true);
        return;
      }
      
      // Show key takeaway before advancing
      if (scene.keyTakeaway && !showKeyTakeaway) {
        setShowKeyTakeaway(true);
        setTimeout(() => {
          advanceScene();
        }, 3000);
        return;
      }
      
      advanceScene();
    }
  }, [waitingForNarration, isSpeaking, isPlaying, interactionComplete, scene.interaction, scene.keyTakeaway, showKeyTakeaway]);

  const advanceScene = useCallback(() => {
    if (currentScene < scenes.length - 1) {
      setCurrentScene(curr => curr + 1);
      onSceneChange?.(currentScene + 1);
      setProgress(0);
    } else {
      setIsPlaying(false);
      onComplete();
    }
  }, [currentScene, scenes.length, onSceneChange, onComplete]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  // Progress timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && !waitingForNarration && !waitingForInteraction) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            if (isSpeaking && !isMuted) {
              setWaitingForNarration(true);
              return 100;
            }
            
            if (scene.interaction && !interactionComplete) {
              setWaitingForInteraction(true);
              return 100;
            }
            
            if (scene.keyTakeaway && !showKeyTakeaway) {
              setShowKeyTakeaway(true);
              setTimeout(advanceScene, 3000);
              return 100;
            }
            
            advanceScene();
            return 0;
          }
          return prev + (100 / (scene.duration * 10));
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isPlaying, scene.duration, stop, isSpeaking, isMuted, waitingForNarration, waitingForInteraction, interactionComplete, scene.interaction, scene.keyTakeaway, showKeyTakeaway, advanceScene]);

  const handlePlayPause = () => {
    if (isPlaying) {
      stop();
    } else {
      hasStartedNarrationRef.current = false;
    }
    setIsPlaying(!isPlaying);
  };
  
  const handleNext = () => {
    if (currentScene < scenes.length - 1) {
      stop();
      setWaitingForNarration(false);
      setWaitingForInteraction(false);
      hasStartedNarrationRef.current = false;
      setCurrentScene(prev => prev + 1);
      setProgress(0);
      onSceneChange?.(currentScene + 1);
    }
  };

  const handlePrev = () => {
    stop();
    setWaitingForNarration(false);
    setWaitingForInteraction(false);
    hasStartedNarrationRef.current = false;
    if (currentScene > 0) {
      setCurrentScene(prev => prev - 1);
      setProgress(0);
      onSceneChange?.(currentScene - 1);
    } else {
      setProgress(0);
    }
  };

  const handleMuteToggle = () => {
    if (!isMuted) {
      stop();
    } else if (isPlaying) {
      hasStartedNarrationRef.current = false;
    }
    setIsMuted(!isMuted);
  };

  const handleInteractionChoice = (optionId: string, isCorrect: boolean) => {
    setSelectedOption(optionId);
    setInteractionFeedback(isCorrect ? "correct" : "incorrect");
    
    if (isCorrect) {
      setTimeout(() => {
        setInteractionComplete(true);
        setWaitingForInteraction(false);
        if (!isPlaying) {
          setIsPlaying(true);
        }
      }, 1500);
    }
  };

  const handleClickReveal = (itemId: string) => {
    setRevealedItems(prev => new Set([...prev, itemId]));
    const allRevealed = scene.interaction?.options?.every(opt => 
      revealedItems.has(opt.id) || opt.id === itemId
    );
    if (allRevealed) {
      setTimeout(() => {
        setInteractionComplete(true);
        setWaitingForInteraction(false);
      }, 1000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAnimationVariants = (animation: string, delay: number) => {
    const variants: Record<string, { initial: object; animate: object }> = {
      fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { delay, duration: 0.5 } }
      },
      slideUp: {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0, transition: { delay, duration: 0.6 } }
      },
      slideLeft: {
        initial: { opacity: 0, x: 100 },
        animate: { opacity: 1, x: 0, transition: { delay, duration: 0.6 } }
      },
      slideRight: {
        initial: { opacity: 0, x: -100 },
        animate: { opacity: 1, x: 0, transition: { delay, duration: 0.6 } }
      },
      bounce: {
        initial: { opacity: 0, scale: 0 },
        animate: { 
          opacity: 1, 
          scale: 1, 
          transition: { delay, type: "spring", stiffness: 300, damping: 15 } 
        }
      },
      pulse: {
        initial: { opacity: 0, scale: 0.8 },
        animate: { 
          opacity: 1, 
          scale: [1, 1.05, 1],
          transition: { delay, duration: 0.8 }
        }
      },
      typewriter: {
        initial: { opacity: 0, width: 0 },
        animate: { opacity: 1, width: "auto", transition: { delay, duration: 1 } }
      },
      stagger: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { delay, duration: 0.4 } }
      }
    };
    return variants[animation] || variants.fadeIn;
  };

  const getBackgroundForType = (type: string) => {
    const backgrounds: Record<string, string> = {
      intro: "bg-gradient-to-br from-primary/20 via-primary/10 to-background",
      concept: "bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-background",
      example: "bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-background",
      diagram: "bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-background",
      summary: "bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-background",
      interactive: "bg-gradient-to-br from-cyan-500/20 via-teal-500/10 to-background",
      "deep-dive": "bg-gradient-to-br from-rose-500/20 via-red-500/10 to-background",
      "real-world": "bg-gradient-to-br from-lime-500/20 via-green-500/10 to-background",
      "hands-on": "bg-gradient-to-br from-violet-500/20 via-purple-500/10 to-background",
    };
    return backgrounds[type] || "bg-gradient-to-br from-muted to-background";
  };

  const getSizeClass = (size?: string) => {
    const sizes: Record<string, string> = {
      sm: "text-sm md:text-base",
      md: "text-base md:text-lg",
      lg: "text-lg md:text-2xl",
      xl: "text-xl md:text-3xl font-bold",
    };
    return sizes[size || "md"];
  };

  const renderElement = (element: AnimationElement, index: number) => {
    const variants = getAnimationVariants(element.animation, element.delay);
    const sizeClass = getSizeClass(element.size);
    
    if (element.type === "animated-list" && Array.isArray(element.content)) {
      return (
        <motion.div
          key={index}
          className="absolute"
          style={{ 
            left: `${element.position.x}%`, 
            top: `${element.position.y}%`,
            transform: "translate(-50%, -50%)"
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <ul className="space-y-2">
            {element.content.map((item, i) => (
              <motion.li
                key={i}
                className={cn("flex items-center gap-2", sizeClass)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: element.delay + i * 0.3 }}
              >
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      );
    }

    if (element.type === "comparison" && Array.isArray(element.content)) {
      return (
        <motion.div
          key={index}
          className="absolute flex gap-8"
          style={{ 
            left: `${element.position.x}%`, 
            top: `${element.position.y}%`,
            transform: "translate(-50%, -50%)"
          }}
          {...variants}
        >
          {element.content.map((item, i) => (
            <Card key={i} className="p-4 bg-background/80 backdrop-blur-sm">
              <p className={cn("text-center", sizeClass)}>{item}</p>
            </Card>
          ))}
        </motion.div>
      );
    }

    if (element.type === "code-block") {
      return (
        <motion.div
          key={index}
          className="absolute"
          style={{ 
            left: `${element.position.x}%`, 
            top: `${element.position.y}%`,
            transform: "translate(-50%, -50%)"
          }}
          {...variants}
        >
          <Card className="p-4 bg-slate-900 text-green-400 font-mono text-sm">
            <pre>{element.content}</pre>
          </Card>
        </motion.div>
      );
    }
    
    switch (element.type) {
      case "text":
        return (
          <motion.div
            key={index}
            className="absolute text-foreground font-medium"
            style={{ 
              left: `${element.position.x}%`, 
              top: `${element.position.y}%`,
              color: element.color,
              transform: "translate(-50%, -50%)"
            }}
            {...variants}
          >
            <p className={cn("text-center max-w-md leading-relaxed", sizeClass)}>
              {element.content}
            </p>
          </motion.div>
        );
      
      case "icon":
        return (
          <motion.div
            key={index}
            className="absolute"
            style={{ 
              left: `${element.position.x}%`, 
              top: `${element.position.y}%`,
              transform: "translate(-50%, -50%)"
            }}
            {...variants}
          >
            <div className={cn(
              element.size === "xl" ? "text-7xl md:text-9xl" :
              element.size === "lg" ? "text-5xl md:text-7xl" :
              "text-4xl md:text-6xl"
            )}>
              {element.content}
            </div>
          </motion.div>
        );
      
      case "shape":
        return (
          <motion.div
            key={index}
            className={cn("absolute rounded-full", element.color || 'bg-primary/30')}
            style={{ 
              left: `${element.position.x}%`, 
              top: `${element.position.y}%`,
              width: (element.content as string).includes('large') ? '200px' : '100px',
              height: (element.content as string).includes('large') ? '200px' : '100px',
              transform: "translate(-50%, -50%)"
            }}
            {...variants}
          />
        );

      case "character":
        return (
          <motion.div
            key={index}
            className="absolute"
            style={{ 
              left: `${element.position.x}%`, 
              top: `${element.position.y}%`,
              transform: "translate(-50%, -50%)"
            }}
            {...variants}
          >
            <div className="relative">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                <span className="text-3xl md:text-4xl">{element.content}</span>
              </div>
              <motion.div
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </div>
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  const renderInteraction = () => {
    if (!scene.interaction || !waitingForInteraction) return null;

    return (
      <motion.div
        className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Card className="max-w-lg mx-4 p-6 bg-background/95 shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            {scene.interaction.type === "click-reveal" ? (
              <MousePointer className="h-5 w-5 text-primary" />
            ) : scene.interaction.type === "choice" ? (
              <HelpCircle className="h-5 w-5 text-primary" />
            ) : (
              <Hand className="h-5 w-5 text-primary" />
            )}
            <span className="text-sm font-medium text-primary">Interactive Check</span>
          </div>
          
          {scene.interaction.question && (
            <h3 className="text-lg font-semibold mb-4">{scene.interaction.question}</h3>
          )}
          
          {scene.interaction.hint && !selectedOption && (
            <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              {scene.interaction.hint}
            </p>
          )}

          {scene.interaction.type === "choice" && (
            <div className="space-y-2">
              {scene.interaction.options?.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleInteractionChoice(option.id, option.isCorrect || false)}
                  disabled={selectedOption !== null}
                  className={cn(
                    "w-full p-3 rounded-lg border text-left transition-all",
                    selectedOption === option.id && option.isCorrect
                      ? "border-green-500 bg-green-50 dark:bg-green-950"
                      : selectedOption === option.id && !option.isCorrect
                      ? "border-red-500 bg-red-50 dark:bg-red-950"
                      : "border-border hover:border-primary/50 hover:bg-primary/5"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.label}</span>
                    {selectedOption === option.id && (
                      option.isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {scene.interaction.type === "click-reveal" && (
            <div className="grid grid-cols-2 gap-3">
              {scene.interaction.options?.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleClickReveal(option.id)}
                  className={cn(
                    "p-4 rounded-lg border text-center transition-all",
                    revealedItems.has(option.id)
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 cursor-pointer"
                  )}
                >
                  {revealedItems.has(option.id) ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      {option.label}
                    </motion.div>
                  ) : (
                    <span className="text-muted-foreground">Click to reveal</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {interactionFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "mt-4 p-3 rounded-lg",
                interactionFeedback === "correct" 
                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                  : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
              )}
            >
              {interactionFeedback === "correct" 
                ? scene.interaction.correctFeedback 
                : scene.interaction.incorrectFeedback}
            </motion.div>
          )}

          {interactionFeedback === "incorrect" && (
            <Button 
              onClick={() => {
                setSelectedOption(null);
                setInteractionFeedback(null);
              }}
              variant="outline"
              className="mt-4 w-full"
            >
              Try Again
            </Button>
          )}
        </Card>
      </motion.div>
    );
  };

  return (
    <div 
      className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-background border border-border"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Canvas */}
      <div className={`absolute inset-0 ${getBackgroundForType(scene.visualType)}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene}
            className="relative w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div 
                className="absolute w-64 h-64 rounded-full bg-primary/5 blur-3xl"
                animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{ top: '10%', left: '10%' }}
              />
              <motion.div 
                className="absolute w-48 h-48 rounded-full bg-secondary/5 blur-3xl"
                animate={{ x: [0, -80, 0], y: [0, 80, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{ bottom: '20%', right: '15%' }}
              />
            </div>

            {/* Scene elements - visible when playing */}
            <AnimatePresence>
              {isPlaying && (
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="relative w-full h-full">
                    {scene.elements.map((element, index) => renderElement(element, index))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Key takeaway popup */}
            <AnimatePresence>
              {showKeyTakeaway && scene.keyTakeaway && (
                <motion.div
                  className="absolute top-4 right-4 max-w-xs"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                >
                  <Card className="p-3 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-800 dark:text-amber-200">{scene.keyTakeaway}</p>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Karaoke-style subtitle - word by word sync with voice */}
            <AnimatePresence>
              {!waitingForInteraction && (
                <KaraokeSubtitle
                  text={scene.narration}
                  isPlaying={isPlaying}
                  isSpeaking={isSpeaking}
                  duration={scene.duration}
                />
              )}
            </AnimatePresence>

            {/* Play button overlay */}
            {!isPlaying && !waitingForInteraction && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-sm cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handlePlayPause}
              >
                <motion.div
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary flex items-center justify-center shadow-2xl"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground ml-1" />
                </motion.div>
              </motion.div>
            )}

            {/* Interactive overlay */}
            {renderInteraction()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Scene type indicator */}
      {scene.visualType !== "intro" && (
        <div className="absolute top-4 right-4">
          <span className={cn(
            "text-xs font-medium px-3 py-1 rounded-full",
            scene.visualType === "interactive" 
              ? "bg-cyan-500/20 text-cyan-700 dark:text-cyan-300"
              : scene.visualType === "deep-dive"
              ? "bg-rose-500/20 text-rose-700 dark:text-rose-300"
              : scene.visualType === "hands-on"
              ? "bg-violet-500/20 text-violet-700 dark:text-violet-300"
              : "bg-background/60 text-muted-foreground"
          )}>
            {scene.visualType === "interactive" ? "🎯 Interactive" :
             scene.visualType === "deep-dive" ? "🔬 Deep Dive" :
             scene.visualType === "hands-on" ? "🛠️ Hands-On" :
             scene.visualType.charAt(0).toUpperCase() + scene.visualType.slice(1)}
          </span>
        </div>
      )}

      {/* Controls */}
      <AnimatePresence>
        {showControls && !waitingForInteraction && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="mb-3">
              <div className="relative h-1 bg-muted rounded-full overflow-hidden cursor-pointer">
                <div 
                  className="absolute h-full bg-primary rounded-full transition-all"
                  style={{ width: `${((currentScene / scenes.length) * 100) + (progress / scenes.length)}%` }}
                />
                {scenes.map((_, index) => (
                  <div
                    key={index}
                    className="absolute top-0 w-0.5 h-full bg-background/50"
                    style={{ left: `${((index + 1) / scenes.length) * 100}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handlePrev} className="h-8 w-8">
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handlePlayPause} className="h-10 w-10">
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={handleNext} className="h-8 w-8">
                  <SkipForward className="h-4 w-4" />
                </Button>
                <span className="text-xs text-muted-foreground ml-2">
                  {formatTime(currentTime)} / {formatTime(totalDuration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  Scene {currentScene + 1} of {scenes.length}
                </span>
                <Button variant="ghost" size="icon" onClick={handleMuteToggle} className="h-8 w-8">
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title */}
      <div className="absolute top-4 left-4">
        <span className="text-xs font-medium text-muted-foreground bg-background/60 backdrop-blur-sm px-3 py-1 rounded-full">
          {title}
        </span>
      </div>
    </div>
  );
}
