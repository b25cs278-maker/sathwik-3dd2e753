import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX,
  Maximize, ChevronRight
} from "lucide-react";
import { useVoiceNarration } from "@/hooks/useVoiceNarration";

interface AnimationScene {
  id: string;
  duration: number; // in seconds
  narration: string;
  visualType: "intro" | "concept" | "example" | "diagram" | "summary";
  elements: AnimationElement[];
}

interface AnimationElement {
  type: "text" | "icon" | "shape" | "image" | "character";
  content: string;
  position: { x: number; y: number };
  animation: "fadeIn" | "slideUp" | "slideLeft" | "bounce" | "pulse" | "typewriter";
  delay: number;
  color?: string;
}

interface AnimatedVideoLessonProps {
  scenes: AnimationScene[];
  title: string;
  onComplete: () => void;
  onSceneChange?: (sceneIndex: number) => void;
}

export function AnimatedVideoLesson({ 
  scenes, 
  title, 
  onComplete,
  onSceneChange 
}: AnimatedVideoLessonProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [waitingForNarration, setWaitingForNarration] = useState(false);
  const hasStartedNarrationRef = useRef(false);

  const { speak, stop, isSpeaking, isSupported } = useVoiceNarration({
    rate: 0.9,
    pitch: 1.0,
  });

  const scene = scenes[currentScene];
  const totalDuration = scenes.reduce((acc, s) => acc + s.duration, 0);
  const currentTime = scenes.slice(0, currentScene).reduce((acc, s) => acc + s.duration, 0) + 
    (progress / 100) * scene.duration;

  // Handle voice narration - speak when scene changes and playing
  useEffect(() => {
    if (isPlaying && !isMuted && isSupported && scene.narration && !hasStartedNarrationRef.current) {
      hasStartedNarrationRef.current = true;
      speak(scene.narration);
    }
  }, [isPlaying, isMuted, currentScene, scene.narration, speak, isSupported]);

  // Reset narration flag when scene changes
  useEffect(() => {
    hasStartedNarrationRef.current = false;
  }, [currentScene]);

  // Wait for narration to finish before advancing to next scene
  useEffect(() => {
    if (waitingForNarration && !isSpeaking && isPlaying) {
      setWaitingForNarration(false);
      if (currentScene < scenes.length - 1) {
        setCurrentScene(curr => curr + 1);
        onSceneChange?.(currentScene + 1);
        setProgress(0);
      } else {
        setIsPlaying(false);
        onComplete();
      }
    }
  }, [waitingForNarration, isSpeaking, isPlaying, currentScene, scenes.length, onSceneChange, onComplete]);

  // Stop narration when component unmounts
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  // Progress timer - waits for narration to finish before advancing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && !waitingForNarration) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            // If narration is still playing, wait for it
            if (isSpeaking && !isMuted) {
              setWaitingForNarration(true);
              return 100;
            }
            
            if (currentScene < scenes.length - 1) {
              setCurrentScene(curr => curr + 1);
              onSceneChange?.(currentScene + 1);
              return 0;
            } else {
              setIsPlaying(false);
              stop();
              onComplete();
              return 100;
            }
          }
          return prev + (100 / (scene.duration * 10));
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentScene, scene.duration, scenes.length, onComplete, onSceneChange, stop, isSpeaking, isMuted, waitingForNarration]);

  const handlePlayPause = () => {
    if (isPlaying) {
      stop();
    } else {
      hasStartedNarrationRef.current = false; // Allow narration to start
    }
    setIsPlaying(!isPlaying);
  };
  
  const handleNext = () => {
    if (currentScene < scenes.length - 1) {
      stop();
      setWaitingForNarration(false);
      hasStartedNarrationRef.current = false;
      setCurrentScene(prev => prev + 1);
      setProgress(0);
      onSceneChange?.(currentScene + 1);
    }
  };

  const handlePrev = () => {
    stop();
    setWaitingForNarration(false);
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
      hasStartedNarrationRef.current = false; // Allow narration to restart
    }
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAnimationVariants = (animation: string, delay: number) => {
    const variants: Record<string, any> = {
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
      bounce: {
        initial: { opacity: 0, scale: 0 },
        animate: { 
          opacity: 1, 
          scale: 1, 
          transition: { 
            delay, 
            type: "spring", 
            stiffness: 300, 
            damping: 15 
          } 
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
      }
    };
    return variants[animation] || variants.fadeIn;
  };

  const getBackgroundForType = (type: string) => {
    switch (type) {
      case "intro":
        return "bg-gradient-to-br from-primary/20 via-primary/10 to-background";
      case "concept":
        return "bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-background";
      case "example":
        return "bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-background";
      case "diagram":
        return "bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-background";
      case "summary":
        return "bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-background";
      default:
        return "bg-gradient-to-br from-muted to-background";
    }
  };

  const renderElement = (element: AnimationElement, index: number) => {
    const variants = getAnimationVariants(element.animation, element.delay);
    
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
            <p className="text-lg md:text-2xl text-center max-w-md leading-relaxed">
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
            <div className="text-6xl md:text-8xl">{element.content}</div>
          </motion.div>
        );
      
      case "shape":
        return (
          <motion.div
            key={index}
            className={`absolute rounded-full ${element.color || 'bg-primary/30'}`}
            style={{ 
              left: `${element.position.x}%`, 
              top: `${element.position.y}%`,
              width: element.content.includes('large') ? '200px' : '100px',
              height: element.content.includes('large') ? '200px' : '100px',
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
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                <span className="text-4xl md:text-5xl">{element.content}</span>
              </div>
              <motion.div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </div>
          </motion.div>
        );

      case "image":
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
            <img 
              src={element.content} 
              alt="Visual" 
              className="w-48 md:w-64 h-auto rounded-xl shadow-lg"
            />
          </motion.div>
        );
      
      default:
        return null;
    }
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
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div 
                className="absolute w-64 h-64 rounded-full bg-primary/5 blur-3xl"
                animate={{ 
                  x: [0, 100, 0], 
                  y: [0, 50, 0] 
                }}
                transition={{ 
                  duration: 10, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                style={{ top: '10%', left: '10%' }}
              />
              <motion.div 
                className="absolute w-48 h-48 rounded-full bg-secondary/5 blur-3xl"
                animate={{ 
                  x: [0, -80, 0], 
                  y: [0, 80, 0] 
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                style={{ bottom: '20%', right: '15%' }}
              />
            </div>

            {/* Scene elements */}
            {isPlaying && scene.elements.map((element, index) => renderElement(element, index))}
            
            {/* Narration text at bottom */}
            <motion.div
              className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="bg-background/80 backdrop-blur-md rounded-xl p-4 border border-border/50 shadow-lg">
                <p className="text-center text-foreground text-sm md:text-base leading-relaxed">
                  {scene.narration}
                </p>
              </div>
            </motion.div>

            {/* Play button overlay when paused */}
            {!isPlaying && (
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
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {/* Progress bar */}
            <div className="mb-3">
              <div className="relative h-1 bg-muted rounded-full overflow-hidden cursor-pointer">
                <div 
                  className="absolute h-full bg-primary rounded-full transition-all"
                  style={{ width: `${((currentScene / scenes.length) * 100) + (progress / scenes.length)}%` }}
                />
                {/* Scene markers */}
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrev}
                  className="h-8 w-8"
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePlayPause}
                  className="h-10 w-10"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 ml-0.5" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNext}
                  className="h-8 w-8"
                >
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
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleMuteToggle}
                  className="h-8 w-8"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title overlay */}
      <div className="absolute top-4 left-4">
        <span className="text-xs font-medium text-muted-foreground bg-background/60 backdrop-blur-sm px-3 py-1 rounded-full">
          {title}
        </span>
      </div>
    </div>
  );
}
