import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  ArrowLeft, CheckCircle2, Lightbulb, Rocket, Star,
  Target, Sparkles, Award
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { toast } from "sonner";

interface ProjectData {
  id: string;
  title: string;
  description: string;
  objective: string;
  steps: {
    title: string;
    description: string;
    hint?: string;
    template?: string;
  }[];
  extensionChallenge?: string;
  scoringCriteria: string[];
}

const projectData: Record<string, ProjectData> = {
  "proj-ai-1": {
    id: "proj-ai-1",
    title: "AI Concept Quiz",
    description: "Create a quiz to test understanding of AI basics",
    objective: "Build an interactive quiz that tests AI knowledge with automatic scoring",
    steps: [
      {
        title: "Design Your Questions",
        description: "Think of 3-5 questions about AI concepts you learned. Write each question and 4 possible answers.",
        hint: "Start with 'What is AI?' or 'How does AI learn?' type questions",
        template: "Question 1: ___\nA) ___\nB) ___\nC) ___\nD) ___\nCorrect Answer: ___",
      },
      {
        title: "Add Explanations",
        description: "For each question, write a brief explanation of why the correct answer is right.",
        hint: "Keep explanations simple - 1-2 sentences",
      },
      {
        title: "Create Feedback Messages",
        description: "Write encouraging messages for correct answers and helpful hints for wrong answers.",
        template: "Correct: Great job! ___\nWrong: Good try! Remember that ___",
      },
    ],
    extensionChallenge: "Add a difficulty level system - Easy, Medium, and Hard questions with different point values!",
    scoringCriteria: ["Question quality", "Answer accuracy", "Explanation clarity", "Creativity"],
  },
  "proj-ai-2": {
    id: "proj-ai-2",
    title: "Data Explorer",
    description: "Visualize and understand datasets",
    objective: "Create a tool that organizes and displays data in meaningful ways",
    steps: [
      {
        title: "Choose Your Data Topic",
        description: "Pick a topic you are interested in - it could be sports stats, weather data, or school subjects.",
        hint: "Start with something you already know about!",
      },
      {
        title: "Organize Your Data",
        description: "Create categories and organize at least 10 data points into your categories.",
        template: "Category 1: ___\n- Item: ___ | Value: ___\n- Item: ___ | Value: ___",
      },
      {
        title: "Create Visual Representation",
        description: "Design how you would display this data - as a chart, table, or visual comparison.",
        hint: "Think about what patterns you want to highlight",
      },
    ],
    extensionChallenge: "Add a comparison feature that lets users compare two different categories!",
    scoringCriteria: ["Data organization", "Visual clarity", "Pattern recognition", "Creativity"],
  },
  "proj-ai-3": {
    id: "proj-ai-3",
    title: "Pattern Finder Game",
    description: "Interactive pattern matching game",
    objective: "Create a game that challenges players to find and complete patterns",
    steps: [
      {
        title: "Design Pattern Types",
        description: "Create 5 different pattern types for your game: number sequences, shape patterns, color patterns, etc.",
        hint: "Start with simple patterns like 2, 4, 6, ___ (answer: 8)",
        template: "Pattern 1: ___, ___, ___, ___\nAnswer: ___\nPattern Type: ___",
      },
      {
        title: "Create Difficulty Levels",
        description: "Design 3 difficulty levels: Easy (simple patterns), Medium (2-step patterns), Hard (complex patterns).",
        template: "Easy Example: ___\nMedium Example: ___\nHard Example: ___",
      },
      {
        title: "Design Scoring System",
        description: "How will players earn points? Consider time bonuses, streak bonuses, and hints that reduce points.",
        template: "Correct answer: +___ points\nTime bonus: ___\nUsing hint: -___ points",
      },
    ],
    extensionChallenge: "Add a 'Pattern Creator' mode where players can make their own patterns for friends!",
    scoringCriteria: ["Pattern variety", "Difficulty progression", "Game balance", "Creativity"],
  },
  "proj-ai-4": {
    id: "proj-ai-4",
    title: "Simple Chatbot",
    description: "Build a basic question-answer bot",
    objective: "Create a chatbot that can answer questions on a topic you choose",
    steps: [
      {
        title: "Choose Your Topic",
        description: "Pick a topic your chatbot will be an expert on: a school subject, a hobby, your favorite game, etc.",
        hint: "Choose something you know a lot about!",
      },
      {
        title: "Create Question-Answer Pairs",
        description: "Write 10 questions users might ask and the answers your chatbot should give.",
        template: "User: ___?\nBot: ___\n\nUser: ___?\nBot: ___",
      },
      {
        title: "Handle Unknown Questions",
        description: "Design responses for when the chatbot does not understand. Add helpful suggestions.",
        template: "Unknown input response: ___\nSuggested questions: ___",
      },
      {
        title: "Add Personality",
        description: "Give your chatbot a name and personality. How does it greet users? How does it say goodbye?",
        template: "Bot Name: ___\nGreeting: ___\nGoodbye: ___\nPersonality traits: ___",
      },
    ],
    extensionChallenge: "Add follow-up questions so the chatbot can have multi-turn conversations!",
    scoringCriteria: ["Topic coverage", "Response quality", "Personality", "User experience"],
  },
  "proj-ai-5": {
    id: "proj-ai-5",
    title: "Mood Detector",
    description: "Analyze text sentiment",
    objective: "Build a tool that can detect whether text is positive, negative, or neutral",
    steps: [
      {
        title: "Create Word Lists",
        description: "Make lists of positive words (happy, great, love) and negative words (sad, bad, hate).",
        hint: "Think of words you use when you are happy vs. upset",
        template: "Positive words: ___\nNegative words: ___\nNeutral indicators: ___",
      },
      {
        title: "Design Detection Rules",
        description: "Create rules for how to score text: How many positive/negative words? What about intensity?",
        template: "If positive words > negative: sentiment = ___\nIf equal: sentiment = ___\nIntensity words (very, extremely): ___",
      },
      {
        title: "Test with Examples",
        description: "Write 10 sample sentences and predict what sentiment your detector would assign.",
        template: "Sentence: ___\nPositive words found: ___\nNegative words found: ___\nResult: ___",
      },
    ],
    extensionChallenge: "Add emoji detection to improve sentiment accuracy!",
    scoringCriteria: ["Word list completeness", "Rule logic", "Accuracy", "Creativity"],
  },
  "proj-ai-6": {
    id: "proj-ai-6",
    title: "Prediction Dashboard",
    description: "Create a predictive analytics app",
    objective: "Build a dashboard that makes predictions based on data patterns",
    steps: [
      {
        title: "Choose Your Prediction Topic",
        description: "Select something to predict: test scores, weather, game outcomes, plant growth, etc.",
        hint: "Pick something you can get real data about",
      },
      {
        title: "Identify Key Factors",
        description: "What factors affect your prediction? List 3-5 variables and how they might influence outcomes.",
        template: "Factor 1: ___ | Impact: ___\nFactor 2: ___ | Impact: ___\nFactor 3: ___ | Impact: ___",
      },
      {
        title: "Create Prediction Rules",
        description: "Design rules for making predictions based on your factors.",
        template: "If factor1 = high AND factor2 = low, then predict ___\nIf factor1 = low AND factor2 = high, then predict ___",
      },
      {
        title: "Design the Dashboard Display",
        description: "Sketch how your dashboard will show: current data, prediction, and confidence level.",
        template: "Main prediction display: ___\nConfidence indicator: ___\nKey metrics shown: ___",
      },
    ],
    extensionChallenge: "Add a feature to track prediction accuracy over time!",
    scoringCriteria: ["Factor analysis", "Prediction logic", "Dashboard design", "Practicality"],
  },
  "proj-env-1": {
    id: "proj-env-1",
    title: "Environment Quiz",
    description: "Test your environmental knowledge",
    objective: "Build an interactive quiz about environmental topics with educational feedback",
    steps: [
      {
        title: "Research Environmental Facts",
        description: "Find 5 interesting facts about the environment - climate, wildlife, or pollution.",
        hint: "Focus on facts that surprised you!",
      },
      {
        title: "Turn Facts into Questions",
        description: "Convert each fact into a multiple-choice question with one correct and three incorrect answers.",
        template: "Fact: ___\nQuestion: ___\nCorrect Answer: ___\nWrong Answers: ___, ___, ___",
      },
      {
        title: "Add Learning Points",
        description: "For each question, explain why the answer matters for the environment.",
        hint: "Connect the fact to real-world impact",
      },
    ],
    extensionChallenge: "Add a 'Did You Know?' section with extra facts that appear after each answer!",
    scoringCriteria: ["Factual accuracy", "Question clarity", "Educational value", "Creativity"],
  },
  "proj-env-2": {
    id: "proj-env-2",
    title: "Waste Sorting Game",
    description: "Interactive recycling game",
    objective: "Create a game that teaches players how to sort different types of waste correctly",
    steps: [
      {
        title: "Define Waste Categories",
        description: "List the main waste categories: Recyclable, Organic, Hazardous, and General waste.",
        hint: "Think about what goes in each bin",
      },
      {
        title: "Create Item List",
        description: "List at least 15 common items and which category each belongs to.",
        template: "Item: ___ | Category: ___\nItem: ___ | Category: ___",
      },
      {
        title: "Design Game Rules",
        description: "How will players score points? What happens for correct vs incorrect sorting?",
        template: "Correct sort: +___ points\nWrong sort: ___\nWin condition: ___",
      },
    ],
    extensionChallenge: "Add tricky items that could go in multiple categories depending on local rules!",
    scoringCriteria: ["Category accuracy", "Game mechanics", "Educational value", "Creativity"],
  },
  "proj-env-3": {
    id: "proj-env-3",
    title: "CO2 Calculator",
    description: "Calculate your carbon footprint",
    objective: "Build a calculator that estimates carbon emissions from daily activities",
    steps: [
      {
        title: "List Activities",
        description: "Identify 8-10 daily activities that produce carbon emissions (transportation, food, energy).",
        hint: "Think about your typical day",
        template: "Activity: ___ | Category: ___\nActivity: ___ | Category: ___",
      },
      {
        title: "Research Carbon Values",
        description: "Find the approximate CO2 emissions for each activity (in kg CO2).",
        template: "Driving 1 mile: ___ kg CO2\nEating beef meal: ___ kg CO2\nUsing AC for 1 hour: ___ kg CO2",
      },
      {
        title: "Design the Calculator",
        description: "Create input fields for users to enter their daily activities and a formula to calculate total emissions.",
        template: "User inputs: ___\nCalculation formula: ___\nOutput display: ___",
      },
      {
        title: "Add Reduction Tips",
        description: "For each activity, suggest ways to reduce carbon emissions.",
        template: "Activity: ___\nReduction tip: ___\nPotential savings: ___ kg CO2",
      },
    ],
    extensionChallenge: "Add a goal-setting feature where users can set and track emission reduction targets!",
    scoringCriteria: ["Activity coverage", "Data accuracy", "Calculator design", "Tip quality"],
  },
  "proj-env-4": {
    id: "proj-env-4",
    title: "Eco Data Charts",
    description: "Visualize environmental statistics",
    objective: "Create compelling charts that tell a story about environmental data",
    steps: [
      {
        title: "Choose Your Data Story",
        description: "Select an environmental topic to visualize: climate change, deforestation, ocean pollution, etc.",
        hint: "Pick something you care about!",
      },
      {
        title: "Gather Data Points",
        description: "Collect at least 10 data points over time or across categories for your topic.",
        template: "Year/Category: ___ | Value: ___\nYear/Category: ___ | Value: ___",
      },
      {
        title: "Choose Chart Types",
        description: "Select the best chart types for your data. Explain why each chart type works for that data.",
        template: "Data set 1: ___ | Chart type: ___ | Why: ___\nData set 2: ___ | Chart type: ___ | Why: ___",
      },
      {
        title: "Write Data Insights",
        description: "What story does your data tell? Write 3-5 key insights viewers should take away.",
        template: "Insight 1: ___\nInsight 2: ___\nWhat should people do: ___",
      },
    ],
    extensionChallenge: "Create an interactive chart where users can filter by year or region!",
    scoringCriteria: ["Data quality", "Chart selection", "Visual design", "Storytelling"],
  },
  "proj-env-5": {
    id: "proj-env-5",
    title: "Recycling Challenge",
    description: "Build an educational game",
    objective: "Create an engaging game that teaches recycling concepts through challenges",
    steps: [
      {
        title: "Design Game Concept",
        description: "Create a game theme and storyline. Are you saving a planet? Running a recycling center? Cleaning an ocean?",
        hint: "A good story makes the game more engaging!",
        template: "Game title: ___\nStoryline: ___\nPlayer goal: ___",
      },
      {
        title: "Create Challenge Levels",
        description: "Design 5 progressive challenge levels, each teaching different recycling concepts.",
        template: "Level 1: ___ | Concept taught: ___\nLevel 2: ___ | Concept taught: ___\nLevel 3: ___ | Concept taught: ___",
      },
      {
        title: "Design Rewards System",
        description: "Create rewards that motivate players: points, badges, unlockables, etc.",
        template: "Points system: ___\nBadge 1: ___ | How to earn: ___\nUnlockable: ___ | Requirement: ___",
      },
      {
        title: "Add Educational Moments",
        description: "Include facts and tips that appear during gameplay to teach while entertaining.",
        template: "After correct answer: Show fact about ___\nBetween levels: Tip about ___",
      },
    ],
    extensionChallenge: "Add a multiplayer mode where players compete to recycle correctly!",
    scoringCriteria: ["Game design", "Educational content", "Engagement", "Creativity"],
  },
  "proj-env-6": {
    id: "proj-env-6",
    title: "Sustainability Dashboard",
    description: "Full environmental analytics app",
    objective: "Build a comprehensive dashboard that tracks and visualizes environmental impact",
    steps: [
      {
        title: "Define Key Metrics",
        description: "Choose 5-7 key environmental metrics to track: carbon footprint, waste, energy, water, etc.",
        hint: "Think about what you can actually measure and improve",
        template: "Metric 1: ___ | Unit: ___ | Goal: ___\nMetric 2: ___ | Unit: ___ | Goal: ___",
      },
      {
        title: "Design Dashboard Layout",
        description: "Sketch the dashboard layout. Where will each metric appear? What visualizations will you use?",
        template: "Top section: ___\nMain area: ___\nSidebar: ___\nCharts used: ___",
      },
      {
        title: "Create Progress Indicators",
        description: "Design how users will see their progress: progress bars, trend arrows, color coding, etc.",
        template: "On track: show ___\nNeeds improvement: show ___\nGoal achieved: show ___",
      },
      {
        title: "Add Action Recommendations",
        description: "Based on the data, what actions should users take? Create personalized recommendations.",
        template: "If carbon high: suggest ___\nIf waste high: suggest ___\nIf on track: celebrate with ___",
      },
    ],
    extensionChallenge: "Add a community feature where users can compare their impact with friends or global averages!",
    scoringCriteria: ["Metric selection", "Dashboard design", "Actionability", "User experience"],
  },
};

// Default project for undefined ones
const defaultProject: ProjectData = {
  id: "default",
  title: "Project Coming Soon",
  description: "This project is being developed",
  objective: "Check back soon for this exciting project!",
  steps: [
    {
      title: "Coming Soon",
      description: "This project content is being developed. Complete the lesson first to unlock new content!",
    },
  ],
  scoringCriteria: ["Completion"],
};

export default function Project() {
  const { trackId, projectId } = useParams<{ trackId: string; projectId: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [showHint, setShowHint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [projectScores, setProjectScores] = useLocalStorage<Record<string, number>>(`${trackId}-projects`, {});

  const project = projectData[projectId || ""] || defaultProject;
  const step = project.steps[currentStep];
  const progress = ((currentStep + 1) / project.steps.length) * 100;
  const isAI = trackId === "ai-innovation";
  const existingScore = projectScores[projectId || ""];

  const handleNext = () => {
    if (!responses[currentStep] || responses[currentStep].trim().length < 10) {
      toast.error("Please provide a more detailed response (at least 10 characters)");
      return;
    }

    if (currentStep < project.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setShowHint(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowHint(false);
    }
  };

  const handleSubmit = async () => {
    if (!responses[currentStep] || responses[currentStep].trim().length < 10) {
      toast.error("Please complete the current step before submitting");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate AI scoring
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Calculate a score based on response length and completeness
    const totalLength = Object.values(responses).reduce((sum, r) => sum + r.length, 0);
    const completeness = Object.keys(responses).length / project.steps.length;
    const baseScore = Math.min(60 + (totalLength / 50), 85);
    const score = Math.round(baseScore * completeness + Math.random() * 15);
    
    setProjectScores({ ...projectScores, [projectId || ""]: Math.min(score, 100) });
    
    setIsSubmitting(false);
    toast.success(`Project scored: ${Math.min(score, 100)}/100! Great work!`);
    navigate(`/track/${trackId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <div className={`py-6 bg-gradient-to-r ${isAI ? 'from-violet-500 to-purple-600' : 'from-emerald-500 to-green-600'}`}>
        <div className="container">
          <div className="flex items-center justify-between mb-2">
            <Link to={`/track/${trackId}`} className="text-white/80 hover:text-white text-sm flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" /> Back to Track
            </Link>
            {existingScore !== undefined && (
              <span className="text-white/80 text-sm flex items-center gap-1">
                <Star className="h-4 w-4" /> Previous Score: {existingScore}/100
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Rocket className="h-8 w-8 text-white" />
            <div>
              <h1 className="text-2xl font-bold text-white">{project.title}</h1>
              <p className="text-white/80 text-sm">{project.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 max-w-4xl">
        {/* Objective */}
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex items-start gap-3">
            <Target className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Objective</p>
              <p className="text-sm text-muted-foreground">{project.objective}</p>
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Step {currentStep + 1} of {project.steps.length}</span>
            <span className="text-primary font-medium">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  isAI ? 'bg-violet-500/20 text-violet-600' : 'bg-emerald-500/20 text-emerald-600'
                }`}>
                  {currentStep + 1}
                </span>
                {step.title}
              </CardTitle>
              {step.hint && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowHint(!showHint)}
                  className="text-muted-foreground"
                >
                  <Lightbulb className="h-4 w-4 mr-1" />
                  Hint
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{step.description}</p>
            
            {showHint && step.hint && (
              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  {step.hint}
                </p>
              </div>
            )}

            {step.template && (
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-xs text-muted-foreground mb-2">Template (you can use this as a starting point):</p>
                <pre className="text-sm font-mono whitespace-pre-wrap">{step.template}</pre>
              </div>
            )}

            <Textarea
              placeholder="Write your response here..."
              value={responses[currentStep] || ""}
              onChange={(e) => setResponses({ ...responses, [currentStep]: e.target.value })}
              className="min-h-[200px]"
            />

            <div className="flex justify-between pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              {currentStep === project.steps.length - 1 ? (
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`bg-gradient-to-r ${isAI ? 'from-violet-500 to-purple-600' : 'from-emerald-500 to-green-600'} text-white`}
                >
                  {isSubmitting ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                      Scoring...
                    </>
                  ) : (
                    <>
                      <Award className="h-4 w-4 mr-2" />
                      Submit Project
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  Next Step
                  <CheckCircle2 className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Extension Challenge */}
        {project.extensionChallenge && (
          <Card className="border-dashed">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Extension Challenge (Optional)</p>
                  <p className="text-sm text-muted-foreground">{project.extensionChallenge}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scoring Criteria */}
        <div className="mt-6 p-4 rounded-lg bg-muted/50">
          <p className="text-sm font-semibold text-foreground mb-2">Scoring Criteria:</p>
          <div className="flex flex-wrap gap-2">
            {project.scoringCriteria.map((criteria) => (
              <span key={criteria} className="px-3 py-1 rounded-full bg-background border text-sm text-muted-foreground">
                {criteria}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
