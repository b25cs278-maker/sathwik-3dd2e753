import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  ArrowLeft, ArrowRight, CheckCircle2, Brain, Leaf,
  Lightbulb, BookOpen, HelpCircle
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { toast } from "sonner";

interface LessonContent {
  id: string;
  title: string;
  sections: {
    type: "text" | "visual" | "quiz";
    title?: string;
    content?: string;
    imageUrl?: string;
    question?: string;
    options?: string[];
    correctAnswer?: number;
    explanation?: string;
  }[];
}

const lessonContent: Record<string, LessonContent> = {
  "ai-1": {
    id: "ai-1",
    title: "What is AI?",
    sections: [
      {
        type: "text",
        title: "Introduction to Artificial Intelligence",
        content: "Artificial Intelligence (AI) is the simulation of human intelligence by machines. Just like you learn from experience, AI systems learn from data to make decisions and solve problems.\n\nThink of AI as a very smart assistant that can:\n• Recognize patterns (like faces in photos)\n• Understand language (like voice assistants)\n• Make predictions (like weather forecasts)\n• Play games (like chess or video games)",
      },
      {
        type: "visual",
        title: "AI in Everyday Life",
        content: "AI is all around us! Here are some examples you might use daily:",
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
      },
      {
        type: "text",
        title: "How Does AI Learn?",
        content: "AI learns through a process similar to how you learn:\n\n1. **Collecting Data**: AI needs examples to learn from, just like you need books and teachers.\n\n2. **Finding Patterns**: AI looks for patterns in the data, like noticing that cats have whiskers and dogs have wet noses.\n\n3. **Making Predictions**: Once trained, AI can make guesses about new things it hasn't seen before.\n\n4. **Getting Better**: AI improves when we tell it if its guesses were right or wrong.",
      },
      {
        type: "quiz",
        question: "What is the main way AI learns to make decisions?",
        options: [
          "By reading instruction manuals",
          "By learning from data and examples",
          "By asking humans every question",
          "By guessing randomly"
        ],
        correctAnswer: 1,
        explanation: "AI learns by analyzing data and finding patterns, similar to how you learn from examples and experience!",
      },
    ],
  },
  "ai-2": {
    id: "ai-2",
    title: "Understanding Data",
    sections: [
      {
        type: "text",
        title: "What is Data?",
        content: "Data is information that can be collected, stored, and analyzed. For AI, data is like food - it needs data to learn and grow smarter!\n\nTypes of data include:\n• **Numbers**: Ages, temperatures, scores\n• **Text**: Names, descriptions, messages\n• **Images**: Photos, drawings, videos\n• **Categories**: Colors, types, groups",
      },
      {
        type: "text",
        title: "Why Data Matters for AI",
        content: "The quality and quantity of data directly affects how well AI can learn:\n\n• **More data** = AI can find more patterns\n• **Clean data** = AI makes fewer mistakes\n• **Diverse data** = AI works for more situations\n\nImagine trying to learn about animals by only seeing pictures of cats. You'd think all animals are cats! AI has the same problem if it doesn't see enough variety.",
      },
      {
        type: "quiz",
        question: "Why is diverse data important for AI?",
        options: [
          "It makes the AI faster",
          "It helps AI work for more situations",
          "It uses less computer memory",
          "It looks more colorful"
        ],
        correctAnswer: 1,
        explanation: "Diverse data helps AI learn about many different situations, making it more useful and accurate in the real world!",
      },
    ],
  },
  "env-1": {
    id: "env-1",
    title: "Environmental Data",
    sections: [
      {
        type: "text",
        title: "Measuring Our Environment",
        content: "Environmental data helps us understand and protect our planet. Scientists and everyday people collect information about:\n\n• **Air Quality**: Pollution levels, CO₂ concentration\n• **Water**: Temperature, cleanliness, ocean levels\n• **Land**: Forest coverage, soil health, wildlife\n• **Climate**: Temperature changes, rainfall, extreme weather",
      },
      {
        type: "visual",
        title: "Environmental Monitoring",
        content: "Modern technology helps us track environmental changes in real-time around the world.",
        imageUrl: "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=600&h=400&fit=crop",
      },
      {
        type: "text",
        title: "Using Data for Good",
        content: "When we collect environmental data, we can:\n\n1. **Identify Problems**: Find areas with high pollution or deforestation\n2. **Track Progress**: See if conservation efforts are working\n3. **Predict Changes**: Forecast droughts, floods, or temperature shifts\n4. **Make Better Decisions**: Help governments and communities act wisely",
      },
      {
        type: "quiz",
        question: "How does environmental data help us?",
        options: [
          "Only scientists can use it",
          "It helps identify problems and track progress",
          "It's too complicated to be useful",
          "It only works for weather"
        ],
        correctAnswer: 1,
        explanation: "Environmental data helps everyone identify issues, track improvements, and make better decisions for our planet!",
      },
    ],
  },
  "env-2": {
    id: "env-2",
    title: "Waste & Recycling",
    sections: [
      {
        type: "text",
        title: "Understanding Waste Categories",
        content: "Not all trash is the same! Understanding waste categories is the first step to recycling:\n\n• **Recyclables**: Paper, cardboard, glass, metal, some plastics\n• **Organic Waste**: Food scraps, yard waste, can become compost\n• **Hazardous Waste**: Batteries, chemicals, electronics\n• **General Waste**: Items that can't be recycled or composted",
      },
      {
        type: "text",
        title: "The 3 R's: Reduce, Reuse, Recycle",
        content: "The best way to manage waste is to follow the 3 R's in order:\n\n1. **Reduce**: Use less stuff in the first place\n2. **Reuse**: Find new uses for items before throwing them away\n3. **Recycle**: Turn old materials into new products\n\nRecycling is important, but reducing and reusing come first!",
      },
      {
        type: "quiz",
        question: "Which of the 3 R's should come first?",
        options: [
          "Recycle",
          "Reuse",
          "Reduce",
          "They're all equal"
        ],
        correctAnswer: 2,
        explanation: "Reduce comes first! Using less stuff in the first place is the most effective way to minimize waste.",
      },
    ],
  },
};

// Default lesson for undefined ones
const defaultLesson: LessonContent = {
  id: "default",
  title: "Lesson Coming Soon",
  sections: [
    {
      type: "text",
      title: "Content Under Development",
      content: "This lesson is being developed. Check back soon for exciting new content!\n\nIn the meantime, you can:\n• Review previous lessons\n• Practice with completed projects\n• Explore other topics in your track",
    },
  ],
};

export default function Lesson() {
  const { trackId, lessonId } = useParams<{ trackId: string; lessonId: string }>();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  
  const [completedLessons, setCompletedLessons] = useLocalStorage<string[]>(`${trackId}-lessons`, []);

  const lesson = lessonContent[lessonId || ""] || defaultLesson;
  const section = lesson.sections[currentSection];
  const progress = ((currentSection + 1) / lesson.sections.length) * 100;
  const isAI = trackId === "ai-innovation";

  const handleNext = () => {
    if (section.type === "quiz" && selectedAnswer === null) {
      toast.error("Please select an answer");
      return;
    }

    if (section.type === "quiz" && !showExplanation) {
      setShowExplanation(true);
      return;
    }

    if (currentSection < lesson.sections.length - 1) {
      setCurrentSection(currentSection + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Lesson complete
      if (lessonId && !completedLessons.includes(lessonId)) {
        setCompletedLessons([...completedLessons, lessonId]);
      }
      toast.success("Lesson completed! You unlocked a new project.");
      navigate(`/track/${trackId}`);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Progress Header */}
      <div className={`py-4 bg-gradient-to-r ${isAI ? 'from-violet-500 to-purple-600' : 'from-emerald-500 to-green-600'}`}>
        <div className="container">
          <div className="flex items-center justify-between mb-2">
            <Link to={`/track/${trackId}`} className="text-white/80 hover:text-white text-sm flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" /> Back to Track
            </Link>
            <span className="text-white/80 text-sm">
              Section {currentSection + 1} of {lesson.sections.length}
            </span>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">{lesson.title}</h1>
          <Progress value={progress} className="h-2 bg-white/20" />
        </div>
      </div>

      <div className="container py-8 max-w-3xl">
        <Card className="shadow-lg">
          <CardHeader>
            {section.type === "quiz" ? (
              <div className="flex items-center gap-2 text-primary">
                <HelpCircle className="h-5 w-5" />
                <span className="font-semibold">Quick Check</span>
              </div>
            ) : section.type === "visual" ? (
              <div className="flex items-center gap-2 text-primary">
                <Lightbulb className="h-5 w-5" />
                <span className="font-semibold">Visual Learning</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-primary">
                <BookOpen className="h-5 w-5" />
                <span className="font-semibold">Learn</span>
              </div>
            )}
            {section.title && (
              <CardTitle className="text-2xl">{section.title}</CardTitle>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {section.type === "text" && (
              <div className="prose prose-lg max-w-none">
                {section.content?.split('\n').map((paragraph, i) => (
                  <p key={i} className="text-muted-foreground whitespace-pre-wrap">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {section.type === "visual" && (
              <>
                {section.content && (
                  <p className="text-muted-foreground">{section.content}</p>
                )}
                {section.imageUrl && (
                  <img 
                    src={section.imageUrl} 
                    alt={section.title}
                    className="rounded-lg w-full object-cover max-h-80"
                  />
                )}
              </>
            )}

            {section.type === "quiz" && (
              <>
                <p className="text-lg font-medium text-foreground">{section.question}</p>
                <RadioGroup 
                  value={selectedAnswer?.toString()} 
                  onValueChange={(v) => setSelectedAnswer(parseInt(v))}
                  className="space-y-3"
                  disabled={showExplanation}
                >
                  {section.options?.map((option, i) => {
                    const isCorrect = i === section.correctAnswer;
                    const isSelected = selectedAnswer === i;
                    
                    return (
                      <div 
                        key={i}
                        className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                          showExplanation 
                            ? isCorrect 
                              ? 'border-green-500 bg-green-50 dark:bg-green-950'
                              : isSelected 
                                ? 'border-red-500 bg-red-50 dark:bg-red-950'
                                : 'border-border'
                            : isSelected
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <RadioGroupItem value={i.toString()} id={`option-${i}`} />
                        <Label 
                          htmlFor={`option-${i}`} 
                          className="flex-1 cursor-pointer text-base"
                        >
                          {option}
                        </Label>
                        {showExplanation && isCorrect && (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    );
                  })}
                </RadioGroup>

                {showExplanation && (
                  <div className={`p-4 rounded-lg ${
                    selectedAnswer === section.correctAnswer 
                      ? 'bg-green-100 dark:bg-green-950 border border-green-200 dark:border-green-800'
                      : 'bg-amber-100 dark:bg-amber-950 border border-amber-200 dark:border-amber-800'
                  }`}>
                    <p className="font-medium text-foreground mb-1">
                      {selectedAnswer === section.correctAnswer ? '✓ Correct!' : '✗ Not quite!'}
                    </p>
                    <p className="text-sm text-muted-foreground">{section.explanation}</p>
                  </div>
                )}
              </>
            )}

            <div className="flex justify-between pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentSection === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button onClick={handleNext}>
                {section.type === "quiz" && !showExplanation ? (
                  "Check Answer"
                ) : currentSection === lesson.sections.length - 1 ? (
                  "Complete Lesson"
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
