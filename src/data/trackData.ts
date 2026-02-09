import { Brain, Leaf, MessageSquare, BookOpen as BookOpenIcon, Briefcase, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface TrackLesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: "beginner" | "low-intermediate" | "intermediate";
  projectId: string;
  completed: boolean;
}

export interface TrackProject {
  id: string;
  title: string;
  description: string;
  lessonRequired: string;
  unlocked: boolean;
  completed: boolean;
  score?: number;
}

export interface TrackInfo {
  title: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  textColor: string;
  lessons: TrackLesson[];
  projects: TrackProject[];
}

export const trackData: Record<string, TrackInfo> = {
  "ai-innovation": {
    title: "AI Innovation",
    icon: Brain,
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-500/10",
    textColor: "text-violet-600",
    lessons: [
      { id: "ai-1", title: "What is AI?", description: "Introduction to artificial intelligence concepts", duration: "10 min", level: "beginner", projectId: "proj-ai-1", completed: false },
      { id: "ai-2", title: "Understanding Data", description: "Learn how AI uses data to make decisions", duration: "12 min", level: "beginner", projectId: "proj-ai-2", completed: false },
      { id: "ai-3", title: "Pattern Recognition", description: "How AI finds patterns in information", duration: "15 min", level: "beginner", projectId: "proj-ai-3", completed: false },
      { id: "ai-4", title: "Building a Chatbot", description: "Create your first conversational AI", duration: "15 min", level: "low-intermediate", projectId: "proj-ai-4", completed: false },
      { id: "ai-5", title: "Sentiment Analysis", description: "Teach AI to understand emotions", duration: "18 min", level: "low-intermediate", projectId: "proj-ai-5", completed: false },
      { id: "ai-6", title: "Predictive Models", description: "Build AI that predicts outcomes", duration: "20 min", level: "intermediate", projectId: "proj-ai-6", completed: false },
    ],
    projects: [
      { id: "proj-ai-1", title: "AI Concept Quiz", description: "Test your understanding of AI basics", lessonRequired: "ai-1", unlocked: false, completed: false },
      { id: "proj-ai-2", title: "Data Explorer", description: "Visualize and understand datasets", lessonRequired: "ai-2", unlocked: false, completed: false },
      { id: "proj-ai-3", title: "Pattern Finder Game", description: "Interactive pattern matching game", lessonRequired: "ai-3", unlocked: false, completed: false },
      { id: "proj-ai-4", title: "Simple Chatbot", description: "Build a basic question-answer bot", lessonRequired: "ai-4", unlocked: false, completed: false },
      { id: "proj-ai-5", title: "Mood Detector", description: "Analyze text sentiment", lessonRequired: "ai-5", unlocked: false, completed: false },
      { id: "proj-ai-6", title: "Prediction Dashboard", description: "Create a predictive analytics app", lessonRequired: "ai-6", unlocked: false, completed: false },
    ],
  },
  "environmental-innovation": {
    title: "Environmental Innovation",
    icon: Leaf,
    color: "from-emerald-500 to-green-600",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-600",
    lessons: [
      { id: "env-1", title: "Environmental Data", description: "Understanding environmental metrics", duration: "10 min", level: "beginner", projectId: "proj-env-1", completed: false },
      { id: "env-2", title: "Waste & Recycling", description: "Learn about waste categories and recycling", duration: "12 min", level: "beginner", projectId: "proj-env-2", completed: false },
      { id: "env-3", title: "Carbon Footprint", description: "Understanding CO₂ emissions and impact", duration: "15 min", level: "beginner", projectId: "proj-env-3", completed: false },
      { id: "env-4", title: "Data Visualization", description: "Create charts and graphs for environmental data", duration: "15 min", level: "low-intermediate", projectId: "proj-env-4", completed: false },
      { id: "env-5", title: "Interactive Games", description: "Build engaging educational games", duration: "18 min", level: "low-intermediate", projectId: "proj-env-5", completed: false },
      { id: "env-6", title: "Dashboard Design", description: "Create full-featured analytics dashboards", duration: "20 min", level: "intermediate", projectId: "proj-env-6", completed: false },
    ],
    projects: [
      { id: "proj-env-1", title: "Environment Quiz", description: "Test your environmental knowledge", lessonRequired: "env-1", unlocked: false, completed: false },
      { id: "proj-env-2", title: "Waste Sorting Game", description: "Interactive recycling game", lessonRequired: "env-2", unlocked: false, completed: false },
      { id: "proj-env-3", title: "CO₂ Calculator", description: "Calculate your carbon footprint", lessonRequired: "env-3", unlocked: false, completed: false },
      { id: "proj-env-4", title: "Eco Data Charts", description: "Visualize environmental statistics", lessonRequired: "env-4", unlocked: false, completed: false },
      { id: "proj-env-5", title: "Recycling Challenge", description: "Build an educational game", lessonRequired: "env-5", unlocked: false, completed: false },
      { id: "proj-env-6", title: "Sustainability Dashboard", description: "Full environmental analytics app", lessonRequired: "env-6", unlocked: false, completed: false },
    ],
  },
  "soft-skills": {
    title: "Soft Skills Training",
    icon: Users,
    color: "from-rose-500 to-pink-600",
    bgColor: "bg-rose-500/10",
    textColor: "text-rose-600",
    lessons: [
      { id: "ss-1", title: "Communication Basics", description: "Introduction to effective verbal and non-verbal communication", duration: "10 min", level: "beginner", projectId: "proj-ss-1", completed: false },
      { id: "ss-2", title: "Body Language & Confidence", description: "Improve posture, eye contact, and self-confidence", duration: "12 min", level: "beginner", projectId: "proj-ss-2", completed: false },
      { id: "ss-3", title: "Active Listening", description: "Learn how to listen and respond clearly", duration: "15 min", level: "beginner", projectId: "proj-ss-3", completed: false },
      { id: "ss-4", title: "Teamwork Skills", description: "Collaborating effectively with others", duration: "15 min", level: "low-intermediate", projectId: "proj-ss-4", completed: false },
      { id: "ss-5", title: "Time Management", description: "Prioritize tasks and manage time efficiently", duration: "18 min", level: "low-intermediate", projectId: "proj-ss-5", completed: false },
    ],
    projects: [
      { id: "proj-ss-1", title: "Communication Skills Quiz", description: "Test your understanding of soft skills", lessonRequired: "ss-1", unlocked: false, completed: false },
      { id: "proj-ss-2", title: "Confidence Builder Game", description: "Practice confidence in real-life situations", lessonRequired: "ss-2", unlocked: false, completed: false },
      { id: "proj-ss-3", title: "Team Decision Simulator", description: "Make decisions in teamwork scenarios", lessonRequired: "ss-4", unlocked: false, completed: false },
    ],
  },
  "english-learning": {
    title: "English Learning",
    icon: MessageSquare,
    color: "from-sky-500 to-blue-600",
    bgColor: "bg-sky-500/10",
    textColor: "text-sky-600",
    lessons: [
      { id: "eng-1", title: "Basic English Grammar", description: "Sentence structure and tenses", duration: "10 min", level: "beginner", projectId: "proj-eng-1", completed: false },
      { id: "eng-2", title: "Daily Spoken English", description: "Common everyday conversations", duration: "12 min", level: "beginner", projectId: "proj-eng-2", completed: false },
      { id: "eng-3", title: "Vocabulary Builder", description: "Frequently used English words", duration: "15 min", level: "beginner", projectId: "proj-eng-3", completed: false },
      { id: "eng-4", title: "Professional English", description: "Emails and workplace communication", duration: "18 min", level: "low-intermediate", projectId: "proj-eng-4", completed: false },
    ],
    projects: [
      { id: "proj-eng-1", title: "English Speaking Practice Bot", description: "Practice English conversations with AI", lessonRequired: "eng-1", unlocked: false, completed: false },
      { id: "proj-eng-2", title: "Grammar Challenge", description: "Identify and correct grammar mistakes", lessonRequired: "eng-2", unlocked: false, completed: false },
      { id: "proj-eng-3", title: "Vocabulary Match Game", description: "Improve word recognition skills", lessonRequired: "eng-3", unlocked: false, completed: false },
    ],
  },
  "interview-skills": {
    title: "Interview Skills",
    icon: Briefcase,
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-600",
    lessons: [
      { id: "int-1", title: "Interview Basics", description: "Interview types and etiquette", duration: "10 min", level: "beginner", projectId: "proj-int-1", completed: false },
      { id: "int-2", title: "HR Interview Questions", description: "Common HR interview questions", duration: "12 min", level: "beginner", projectId: "proj-int-2", completed: false },
      { id: "int-3", title: "Technical Interview Skills", description: "Explaining projects and answers clearly", duration: "15 min", level: "low-intermediate", projectId: "proj-int-3", completed: false },
      { id: "int-4", title: "Mock Interview Training", description: "Real-time interview practice", duration: "20 min", level: "intermediate", projectId: "proj-int-4", completed: false },
    ],
    projects: [
      { id: "proj-int-1", title: "Resume Analyzer", description: "Analyze and improve your resume", lessonRequired: "int-1", unlocked: false, completed: false },
      { id: "proj-int-2", title: "AI Mock Interview Bot", description: "Practice interviews with AI", lessonRequired: "int-3", unlocked: false, completed: false },
      { id: "proj-int-3", title: "Answer Feedback Tool", description: "Get feedback on interview answers", lessonRequired: "int-4", unlocked: false, completed: false },
    ],
  },
};
