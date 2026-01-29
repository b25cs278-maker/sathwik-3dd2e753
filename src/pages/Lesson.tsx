import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnimatedVideoLesson } from "@/components/lessons/AnimatedVideoLesson";
import { 
  ArrowLeft, ArrowRight, CheckCircle2, Brain, Leaf,
  Lightbulb, BookOpen, HelpCircle, PlayCircle, Trophy
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { toast } from "sonner";

interface AnimationScene {
  id: string;
  duration: number;
  narration: string;
  visualType: "intro" | "concept" | "example" | "diagram" | "summary";
  elements: {
    type: "text" | "icon" | "shape" | "image" | "character";
    content: string;
    position: { x: number; y: number };
    animation: "fadeIn" | "slideUp" | "slideLeft" | "bounce" | "pulse" | "typewriter";
    delay: number;
    color?: string;
  }[];
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface LessonContent {
  id: string;
  title: string;
  videoScenes: AnimationScene[];
  quiz: QuizQuestion[];
}

const lessonContent: Record<string, LessonContent> = {
  "ai-1": {
    id: "ai-1",
    title: "What is AI?",
    videoScenes: [
      {
        id: "intro",
        duration: 8,
        narration: "Welcome! Today we're going to explore the amazing world of Artificial Intelligence - or AI for short. Get ready to discover how computers can learn to think!",
        visualType: "intro",
        elements: [
          { type: "icon", content: "🤖", position: { x: 50, y: 30 }, animation: "bounce", delay: 0.5 },
          { type: "text", content: "What is AI?", position: { x: 50, y: 55 }, animation: "slideUp", delay: 1 },
        ]
      },
      {
        id: "concept1",
        duration: 10,
        narration: "Artificial Intelligence is the simulation of human intelligence by machines. Just like you learn from experience, AI systems learn from data to make decisions and solve problems.",
        visualType: "concept",
        elements: [
          { type: "character", content: "🧠", position: { x: 25, y: 35 }, animation: "bounce", delay: 0.3 },
          { type: "text", content: "=", position: { x: 50, y: 35 }, animation: "fadeIn", delay: 0.8 },
          { type: "character", content: "💻", position: { x: 75, y: 35 }, animation: "bounce", delay: 1.2 },
          { type: "text", content: "Human Intelligence + Machines", position: { x: 50, y: 55 }, animation: "slideUp", delay: 1.5 },
        ]
      },
      {
        id: "examples",
        duration: 12,
        narration: "Think of AI as a very smart assistant that can: recognize patterns like faces in photos, understand language like voice assistants, make predictions like weather forecasts, and even play games like chess!",
        visualType: "example",
        elements: [
          { type: "icon", content: "📸", position: { x: 25, y: 30 }, animation: "bounce", delay: 0.3 },
          { type: "icon", content: "🗣️", position: { x: 75, y: 30 }, animation: "bounce", delay: 0.6 },
          { type: "icon", content: "🌤️", position: { x: 25, y: 55 }, animation: "bounce", delay: 0.9 },
          { type: "icon", content: "♟️", position: { x: 75, y: 55 }, animation: "bounce", delay: 1.2 },
        ]
      },
      {
        id: "learning",
        duration: 14,
        narration: "AI learns through a process similar to how you learn: First, it collects data like you collect knowledge from books. Then it finds patterns, just like noticing cats have whiskers. Next it makes predictions about new things. Finally, it gets better when we tell it if its guesses were right or wrong!",
        visualType: "diagram",
        elements: [
          { type: "text", content: "1️⃣ Collect Data", position: { x: 25, y: 25 }, animation: "slideUp", delay: 0.3 },
          { type: "text", content: "2️⃣ Find Patterns", position: { x: 75, y: 25 }, animation: "slideUp", delay: 0.8 },
          { type: "text", content: "3️⃣ Make Predictions", position: { x: 25, y: 50 }, animation: "slideUp", delay: 1.3 },
          { type: "text", content: "4️⃣ Get Better!", position: { x: 75, y: 50 }, animation: "slideUp", delay: 1.8 },
        ]
      },
      {
        id: "summary",
        duration: 6,
        narration: "Great job! Now you understand the basics of AI. It's time to test your knowledge with a quick quiz!",
        visualType: "summary",
        elements: [
          { type: "icon", content: "🎉", position: { x: 50, y: 35 }, animation: "bounce", delay: 0.3 },
          { type: "text", content: "Ready for the Quiz?", position: { x: 50, y: 55 }, animation: "pulse", delay: 0.8 },
        ]
      }
    ],
    quiz: [
      {
        question: "What is the main way AI learns to make decisions?",
        options: ["By reading instruction manuals", "By learning from data and examples", "By asking humans every question", "By guessing randomly"],
        correctAnswer: 1,
        explanation: "AI learns by analyzing data and finding patterns, similar to how you learn from examples and experience!"
      },
      {
        question: "Which of these is an example of AI in everyday life?",
        options: ["A regular calculator", "A voice assistant like Siri", "A paper book", "A bicycle"],
        correctAnswer: 1,
        explanation: "Voice assistants use AI to understand your speech and respond intelligently!"
      }
    ]
  },
  "ai-2": {
    id: "ai-2",
    title: "Understanding Data",
    videoScenes: [
      {
        id: "intro",
        duration: 6,
        narration: "Data is everywhere! Let's explore what data means and why it's so important for AI to learn.",
        visualType: "intro",
        elements: [
          { type: "icon", content: "📊", position: { x: 50, y: 30 }, animation: "bounce", delay: 0.5 },
          { type: "text", content: "Understanding Data", position: { x: 50, y: 55 }, animation: "slideUp", delay: 1 },
        ]
      },
      {
        id: "concept1",
        duration: 10,
        narration: "Data is information that can be collected, stored, and analyzed. For AI, data is like food - it needs data to learn and grow smarter! Types include numbers, text, images, and categories.",
        visualType: "concept",
        elements: [
          { type: "icon", content: "🔢", position: { x: 20, y: 30 }, animation: "bounce", delay: 0.3 },
          { type: "icon", content: "📝", position: { x: 40, y: 30 }, animation: "bounce", delay: 0.6 },
          { type: "icon", content: "🖼️", position: { x: 60, y: 30 }, animation: "bounce", delay: 0.9 },
          { type: "icon", content: "📁", position: { x: 80, y: 30 }, animation: "bounce", delay: 1.2 },
          { type: "text", content: "Numbers • Text • Images • Categories", position: { x: 50, y: 55 }, animation: "fadeIn", delay: 1.5 },
        ]
      },
      {
        id: "importance",
        duration: 12,
        narration: "The quality and quantity of data directly affects how well AI can learn. More data means AI can find more patterns. Clean data means fewer mistakes. And diverse data helps AI work in more situations!",
        visualType: "diagram",
        elements: [
          { type: "text", content: "📈 More Data = More Patterns", position: { x: 50, y: 25 }, animation: "slideLeft", delay: 0.3 },
          { type: "text", content: "✨ Clean Data = Fewer Mistakes", position: { x: 50, y: 42 }, animation: "slideLeft", delay: 0.8 },
          { type: "text", content: "🌍 Diverse Data = Better AI", position: { x: 50, y: 58 }, animation: "slideLeft", delay: 1.3 },
        ]
      },
      {
        id: "example",
        duration: 10,
        narration: "Imagine trying to learn about animals by only seeing pictures of cats. You would think all animals are cats! AI has the same problem if it doesn't see enough variety in its training data.",
        visualType: "example",
        elements: [
          { type: "icon", content: "🐱", position: { x: 30, y: 30 }, animation: "bounce", delay: 0.3 },
          { type: "icon", content: "🐱", position: { x: 50, y: 30 }, animation: "bounce", delay: 0.5 },
          { type: "icon", content: "🐱", position: { x: 70, y: 30 }, animation: "bounce", delay: 0.7 },
          { type: "text", content: "❌ Limited Data = Wrong Conclusions", position: { x: 50, y: 55 }, animation: "fadeIn", delay: 1.2 },
        ]
      },
      {
        id: "summary",
        duration: 5,
        narration: "Awesome! You now understand why data is the fuel that powers AI. Let's test your knowledge!",
        visualType: "summary",
        elements: [
          { type: "icon", content: "⭐", position: { x: 50, y: 35 }, animation: "pulse", delay: 0.3 },
          { type: "text", content: "Quiz Time!", position: { x: 50, y: 55 }, animation: "bounce", delay: 0.8 },
        ]
      }
    ],
    quiz: [
      {
        question: "Why is diverse data important for AI?",
        options: ["It makes the AI faster", "It helps AI work for more situations", "It uses less computer memory", "It looks more colorful"],
        correctAnswer: 1,
        explanation: "Diverse data helps AI learn about many different situations, making it more useful and accurate in the real world!"
      }
    ]
  },
  "ai-3": {
    id: "ai-3",
    title: "Pattern Recognition",
    videoScenes: [
      {
        id: "intro",
        duration: 6,
        narration: "Patterns are everywhere! Let's discover how AI becomes a master at finding patterns that even humans might miss.",
        visualType: "intro",
        elements: [
          { type: "icon", content: "🔍", position: { x: 50, y: 30 }, animation: "bounce", delay: 0.5 },
          { type: "text", content: "Pattern Recognition", position: { x: 50, y: 55 }, animation: "slideUp", delay: 1 },
        ]
      },
      {
        id: "patterns",
        duration: 10,
        narration: "Patterns are regularities or repeated elements that we can observe. Visual patterns like stripes, numerical patterns like sequences, behavioral patterns like shopping habits, and language patterns in how we speak!",
        visualType: "concept",
        elements: [
          { type: "icon", content: "🦓", position: { x: 25, y: 30 }, animation: "bounce", delay: 0.3 },
          { type: "text", content: "2, 4, 6, 8...", position: { x: 75, y: 30 }, animation: "fadeIn", delay: 0.6 },
          { type: "icon", content: "🛒", position: { x: 25, y: 55 }, animation: "bounce", delay: 0.9 },
          { type: "icon", content: "💬", position: { x: 75, y: 55 }, animation: "bounce", delay: 1.2 },
        ]
      },
      {
        id: "howAI",
        duration: 12,
        narration: "AI breaks down information into tiny pieces and looks for patterns. For images, it analyzes pixels. For text, it looks at word combinations. This is how AI recognizes faces, detects spam, recommends music, and predicts weather!",
        visualType: "diagram",
        elements: [
          { type: "text", content: "👤 Face Recognition", position: { x: 25, y: 28 }, animation: "slideUp", delay: 0.3 },
          { type: "text", content: "📧 Spam Detection", position: { x: 75, y: 28 }, animation: "slideUp", delay: 0.6 },
          { type: "text", content: "🎵 Music Recommendations", position: { x: 25, y: 52 }, animation: "slideUp", delay: 0.9 },
          { type: "text", content: "⛅ Weather Prediction", position: { x: 75, y: 52 }, animation: "slideUp", delay: 1.2 },
        ]
      },
      {
        id: "summary",
        duration: 5,
        narration: "You're becoming an AI expert! Pattern recognition is one of AI's superpowers. Ready for the quiz?",
        visualType: "summary",
        elements: [
          { type: "icon", content: "🦸", position: { x: 50, y: 35 }, animation: "bounce", delay: 0.3 },
          { type: "text", content: "Quiz Time!", position: { x: 50, y: 55 }, animation: "pulse", delay: 0.8 },
        ]
      }
    ],
    quiz: [
      {
        question: "How does AI recognize faces in photos?",
        options: ["It asks a human to identify each face", "It learns patterns like eye and nose positions", "It reads the person's name tag", "It guesses randomly"],
        correctAnswer: 1,
        explanation: "AI learns that faces have specific patterns - two eyes, a nose, and a mouth in predictable positions!"
      }
    ]
  },
  "ai-4": {
    id: "ai-4",
    title: "Building a Chatbot",
    videoScenes: [
      {
        id: "intro",
        duration: 6,
        narration: "Have you ever talked to Siri, Alexa, or a customer service bot? Let's learn how chatbots work and how to build one!",
        visualType: "intro",
        elements: [
          { type: "icon", content: "💬", position: { x: 50, y: 30 }, animation: "bounce", delay: 0.5 },
          { type: "text", content: "Building a Chatbot", position: { x: 50, y: 55 }, animation: "slideUp", delay: 1 },
        ]
      },
      {
        id: "whatis",
        duration: 10,
        narration: "A chatbot is an AI program that can have conversations with people. You probably use chatbots every day! Virtual assistants, customer service bots, game characters, and educational tutors are all chatbots.",
        visualType: "concept",
        elements: [
          { type: "icon", content: "🎤", position: { x: 25, y: 30 }, animation: "bounce", delay: 0.3 },
          { type: "icon", content: "🤝", position: { x: 75, y: 30 }, animation: "bounce", delay: 0.6 },
          { type: "icon", content: "🎮", position: { x: 25, y: 55 }, animation: "bounce", delay: 0.9 },
          { type: "icon", content: "📚", position: { x: 75, y: 55 }, animation: "bounce", delay: 1.2 },
        ]
      },
      {
        id: "howworks",
        duration: 14,
        narration: "Chatbots work in four steps: First, they process your input by reading your message. Then they recognize your intent - what you actually want. Next, they generate a helpful response. Finally, modern chatbots learn from conversations to improve!",
        visualType: "diagram",
        elements: [
          { type: "text", content: "1️⃣ Read Message", position: { x: 25, y: 28 }, animation: "slideUp", delay: 0.3 },
          { type: "text", content: "2️⃣ Understand Intent", position: { x: 75, y: 28 }, animation: "slideUp", delay: 0.8 },
          { type: "text", content: "3️⃣ Generate Reply", position: { x: 25, y: 52 }, animation: "slideUp", delay: 1.3 },
          { type: "text", content: "4️⃣ Learn & Improve", position: { x: 75, y: 52 }, animation: "slideUp", delay: 1.8 },
        ]
      },
      {
        id: "summary",
        duration: 5,
        narration: "Amazing! Now you know the secrets behind chatbots. Let's see what you've learned!",
        visualType: "summary",
        elements: [
          { type: "icon", content: "🤖", position: { x: 50, y: 35 }, animation: "bounce", delay: 0.3 },
          { type: "text", content: "Quiz Time!", position: { x: 50, y: 55 }, animation: "pulse", delay: 0.8 },
        ]
      }
    ],
    quiz: [
      {
        question: "What is the first step when a chatbot receives your message?",
        options: ["Generate a random response", "Process and understand your input", "Ask another human for help", "Ignore the message"],
        correctAnswer: 1,
        explanation: "The chatbot first processes your input to understand what you're asking before it can respond!"
      }
    ]
  },
  "ai-5": {
    id: "ai-5",
    title: "Sentiment Analysis",
    videoScenes: [
      {
        id: "intro",
        duration: 6,
        narration: "Words carry emotions! Let's explore how AI can understand feelings in text through sentiment analysis.",
        visualType: "intro",
        elements: [
          { type: "icon", content: "😊😢😠", position: { x: 50, y: 30 }, animation: "bounce", delay: 0.5 },
          { type: "text", content: "Sentiment Analysis", position: { x: 50, y: 55 }, animation: "slideUp", delay: 1 },
        ]
      },
      {
        id: "whatis",
        duration: 10,
        narration: "Sentiment is the emotion behind words. 'I love this!' is positive. 'This is terrible' is negative. And some statements are neutral - just facts without strong emotion.",
        visualType: "concept",
        elements: [
          { type: "text", content: "😊 Positive", position: { x: 25, y: 35 }, animation: "bounce", delay: 0.3 },
          { type: "text", content: "😐 Neutral", position: { x: 50, y: 35 }, animation: "bounce", delay: 0.6 },
          { type: "text", content: "😞 Negative", position: { x: 75, y: 35 }, animation: "bounce", delay: 0.9 },
        ]
      },
      {
        id: "howdetects",
        duration: 12,
        narration: "AI detects sentiment by analyzing words, context, intensity, and even emojis! Certain words signal emotions, but context matters - 'This is sick!' could be positive slang or actually negative!",
        visualType: "diagram",
        elements: [
          { type: "text", content: "📝 Word Analysis", position: { x: 25, y: 28 }, animation: "slideUp", delay: 0.3 },
          { type: "text", content: "🔍 Context Matters", position: { x: 75, y: 28 }, animation: "slideUp", delay: 0.6 },
          { type: "text", content: "📊 Intensity Levels", position: { x: 25, y: 52 }, animation: "slideUp", delay: 0.9 },
          { type: "text", content: "😊 Emojis Count!", position: { x: 75, y: 52 }, animation: "slideUp", delay: 1.2 },
        ]
      },
      {
        id: "uses",
        duration: 10,
        narration: "Sentiment analysis is used everywhere: companies track social media feelings, apps sort reviews automatically, news analyzes public opinion, and mental health apps detect emotional distress.",
        visualType: "example",
        elements: [
          { type: "icon", content: "📱", position: { x: 25, y: 30 }, animation: "bounce", delay: 0.3 },
          { type: "icon", content: "⭐", position: { x: 75, y: 30 }, animation: "bounce", delay: 0.6 },
          { type: "icon", content: "📰", position: { x: 25, y: 55 }, animation: "bounce", delay: 0.9 },
          { type: "icon", content: "💚", position: { x: 75, y: 55 }, animation: "bounce", delay: 1.2 },
        ]
      },
      {
        id: "summary",
        duration: 5,
        narration: "Excellent! You now understand how AI reads emotions in text. Quiz time!",
        visualType: "summary",
        elements: [
          { type: "icon", content: "🎯", position: { x: 50, y: 35 }, animation: "bounce", delay: 0.3 },
          { type: "text", content: "Quiz Time!", position: { x: 50, y: 55 }, animation: "pulse", delay: 0.8 },
        ]
      }
    ],
    quiz: [
      {
        question: "Why might AI have trouble with the phrase 'This is sick!'?",
        options: ["The word is too short", "It could mean positive or negative depending on context", "AI cannot read English", "The sentence has no sentiment"],
        correctAnswer: 1,
        explanation: "Slang like 'sick' can mean 'cool/awesome' (positive) or 'bad/gross' (negative) - AI needs context to decide!"
      }
    ]
  },
  "ai-6": {
    id: "ai-6",
    title: "Predictive Models",
    videoScenes: [
      {
        id: "intro",
        duration: 6,
        narration: "Can AI predict the future? Let's explore how predictive models make educated guesses about what will happen next!",
        visualType: "intro",
        elements: [
          { type: "icon", content: "🔮", position: { x: 50, y: 30 }, animation: "bounce", delay: 0.5 },
          { type: "text", content: "Predictive Models", position: { x: 50, y: 55 }, animation: "slideUp", delay: 1 },
        ]
      },
      {
        id: "whatis",
        duration: 10,
        narration: "Predictions are educated guesses about the future based on patterns from the past. Weather forecasts, sports odds, shopping recommendations, and health risk assessments all use predictions!",
        visualType: "example",
        elements: [
          { type: "icon", content: "⛈️", position: { x: 25, y: 30 }, animation: "bounce", delay: 0.3 },
          { type: "icon", content: "⚽", position: { x: 75, y: 30 }, animation: "bounce", delay: 0.6 },
          { type: "icon", content: "🛍️", position: { x: 25, y: 55 }, animation: "bounce", delay: 0.9 },
          { type: "icon", content: "🏥", position: { x: 75, y: 55 }, animation: "bounce", delay: 1.2 },
        ]
      },
      {
        id: "howworks",
        duration: 14,
        narration: "Building a predictive model involves six steps: collect historical data, find patterns in that data, build rules based on those patterns, make predictions on new data, evaluate accuracy, and keep improving!",
        visualType: "diagram",
        elements: [
          { type: "text", content: "1️⃣ Collect Data", position: { x: 25, y: 25 }, animation: "slideUp", delay: 0.3 },
          { type: "text", content: "2️⃣ Find Patterns", position: { x: 75, y: 25 }, animation: "slideUp", delay: 0.6 },
          { type: "text", content: "3️⃣ Build Model", position: { x: 25, y: 42 }, animation: "slideUp", delay: 0.9 },
          { type: "text", content: "4️⃣ Predict", position: { x: 75, y: 42 }, animation: "slideUp", delay: 1.2 },
          { type: "text", content: "5️⃣ Evaluate", position: { x: 25, y: 58 }, animation: "slideUp", delay: 1.5 },
          { type: "text", content: "6️⃣ Improve!", position: { x: 75, y: 58 }, animation: "slideUp", delay: 1.8 },
        ]
      },
      {
        id: "limitations",
        duration: 10,
        narration: "Remember: predictions aren't perfect! Past doesn't guarantee future, bad data leads to bad predictions, probability isn't certainty, and AI can't predict truly random events.",
        visualType: "concept",
        elements: [
          { type: "text", content: "⚠️ Past ≠ Future", position: { x: 25, y: 30 }, animation: "fadeIn", delay: 0.3 },
          { type: "text", content: "🗑️ Bad Data = Bad Results", position: { x: 75, y: 30 }, animation: "fadeIn", delay: 0.6 },
          { type: "text", content: "📊 Probability ≠ Certainty", position: { x: 25, y: 55 }, animation: "fadeIn", delay: 0.9 },
          { type: "text", content: "🎲 Can't Predict Random", position: { x: 75, y: 55 }, animation: "fadeIn", delay: 1.2 },
        ]
      },
      {
        id: "summary",
        duration: 5,
        narration: "Fantastic! You've completed all AI lessons. Time for the final quiz!",
        visualType: "summary",
        elements: [
          { type: "icon", content: "🏆", position: { x: 50, y: 35 }, animation: "bounce", delay: 0.3 },
          { type: "text", content: "Final Quiz!", position: { x: 50, y: 55 }, animation: "pulse", delay: 0.8 },
        ]
      }
    ],
    quiz: [
      {
        question: "Why might a predictive model make wrong predictions?",
        options: ["AI is always 100% accurate", "Patterns can change and past doesn't guarantee future", "Predictions don't use data", "Models only work on weekdays"],
        correctAnswer: 1,
        explanation: "Patterns can change over time, and past data doesn't always predict the future perfectly!"
      }
    ]
  },
  "env-1": {
    id: "env-1",
    title: "Environmental Data",
    videoScenes: [
      {
        id: "intro",
        duration: 6,
        narration: "Our planet is amazing! Let's learn how we collect and use data to understand and protect our environment.",
        visualType: "intro",
        elements: [
          { type: "icon", content: "🌍", position: { x: 50, y: 30 }, animation: "bounce", delay: 0.5 },
          { type: "text", content: "Environmental Data", position: { x: 50, y: 55 }, animation: "slideUp", delay: 1 },
        ]
      },
      {
        id: "measuring",
        duration: 12,
        narration: "Environmental data helps us understand our planet. Scientists measure air quality and pollution, water temperature and cleanliness, forest coverage and wildlife, plus climate patterns and weather changes!",
        visualType: "concept",
        elements: [
          { type: "text", content: "🌬️ Air Quality", position: { x: 25, y: 28 }, animation: "slideUp", delay: 0.3 },
          { type: "text", content: "💧 Water Health", position: { x: 75, y: 28 }, animation: "slideUp", delay: 0.6 },
          { type: "text", content: "🌲 Land & Wildlife", position: { x: 25, y: 52 }, animation: "slideUp", delay: 0.9 },
          { type: "text", content: "🌡️ Climate Patterns", position: { x: 75, y: 52 }, animation: "slideUp", delay: 1.2 },
        ]
      },
      {
        id: "uses",
        duration: 12,
        narration: "When we collect environmental data, we can identify problems like pollution, track if conservation efforts work, predict changes like droughts and floods, and help communities make smart decisions!",
        visualType: "diagram",
        elements: [
          { type: "text", content: "🔍 Identify Problems", position: { x: 25, y: 28 }, animation: "slideLeft", delay: 0.3 },
          { type: "text", content: "📈 Track Progress", position: { x: 75, y: 28 }, animation: "slideLeft", delay: 0.6 },
          { type: "text", content: "🔮 Predict Changes", position: { x: 25, y: 52 }, animation: "slideLeft", delay: 0.9 },
          { type: "text", content: "🤝 Better Decisions", position: { x: 75, y: 52 }, animation: "slideLeft", delay: 1.2 },
        ]
      },
      {
        id: "summary",
        duration: 5,
        narration: "Great work! Data is our tool to protect Earth. Ready for the quiz?",
        visualType: "summary",
        elements: [
          { type: "icon", content: "🌱", position: { x: 50, y: 35 }, animation: "bounce", delay: 0.3 },
          { type: "text", content: "Quiz Time!", position: { x: 50, y: 55 }, animation: "pulse", delay: 0.8 },
        ]
      }
    ],
    quiz: [
      {
        question: "How does environmental data help us?",
        options: ["Only scientists can use it", "It helps identify problems and track progress", "It's too complicated to be useful", "It only works for weather"],
        correctAnswer: 1,
        explanation: "Environmental data helps everyone identify issues, track improvements, and make better decisions for our planet!"
      }
    ]
  },
  "env-2": {
    id: "env-2",
    title: "Waste & Recycling",
    videoScenes: [
      {
        id: "intro",
        duration: 6,
        narration: "Not all trash is the same! Let's learn about waste categories and the power of recycling.",
        visualType: "intro",
        elements: [
          { type: "icon", content: "♻️", position: { x: 50, y: 30 }, animation: "bounce", delay: 0.5 },
          { type: "text", content: "Waste & Recycling", position: { x: 50, y: 55 }, animation: "slideUp", delay: 1 },
        ]
      },
      {
        id: "categories",
        duration: 12,
        narration: "Understanding waste categories is key! Recyclables include paper, glass, and metal. Organic waste becomes compost. Hazardous waste needs special handling. And general waste can't be recycled.",
        visualType: "concept",
        elements: [
          { type: "text", content: "📦 Recyclables", position: { x: 25, y: 28 }, animation: "bounce", delay: 0.3 },
          { type: "text", content: "🍎 Organic", position: { x: 75, y: 28 }, animation: "bounce", delay: 0.6 },
          { type: "text", content: "⚠️ Hazardous", position: { x: 25, y: 52 }, animation: "bounce", delay: 0.9 },
          { type: "text", content: "🗑️ General", position: { x: 75, y: 52 }, animation: "bounce", delay: 1.2 },
        ]
      },
      {
        id: "3rs",
        duration: 10,
        narration: "The 3 Rs go in order! First REDUCE - use less stuff. Then REUSE - find new uses for items. Finally RECYCLE - turn old into new. Reducing and reusing come before recycling!",
        visualType: "diagram",
        elements: [
          { type: "text", content: "1️⃣ REDUCE", position: { x: 30, y: 32 }, animation: "slideUp", delay: 0.3 },
          { type: "text", content: "2️⃣ REUSE", position: { x: 50, y: 45 }, animation: "slideUp", delay: 0.8 },
          { type: "text", content: "3️⃣ RECYCLE", position: { x: 70, y: 58 }, animation: "slideUp", delay: 1.3 },
        ]
      },
      {
        id: "summary",
        duration: 5,
        narration: "You're an eco-warrior now! Test your knowledge!",
        visualType: "summary",
        elements: [
          { type: "icon", content: "🌿", position: { x: 50, y: 35 }, animation: "bounce", delay: 0.3 },
          { type: "text", content: "Quiz Time!", position: { x: 50, y: 55 }, animation: "pulse", delay: 0.8 },
        ]
      }
    ],
    quiz: [
      {
        question: "Which of the 3 Rs should come first?",
        options: ["Recycle", "Reuse", "Reduce", "They're all equal"],
        correctAnswer: 2,
        explanation: "Reduce comes first! Using less stuff in the first place is the most effective way to minimize waste."
      }
    ]
  },
  "env-3": {
    id: "env-3",
    title: "Carbon Footprint",
    videoScenes: [
      {
        id: "intro",
        duration: 6,
        narration: "Every action we take affects our planet! Let's explore what carbon footprint means and how to shrink ours.",
        visualType: "intro",
        elements: [
          { type: "icon", content: "👣", position: { x: 50, y: 30 }, animation: "bounce", delay: 0.5 },
          { type: "text", content: "Carbon Footprint", position: { x: 50, y: 55 }, animation: "slideUp", delay: 1 },
        ]
      },
      {
        id: "whatis",
        duration: 12,
        narration: "Your carbon footprint is the total greenhouse gases from your activities. Transportation like cars and planes, energy use for lights and heating, food especially meat, and manufacturing products all contribute!",
        visualType: "concept",
        elements: [
          { type: "icon", content: "🚗", position: { x: 25, y: 30 }, animation: "bounce", delay: 0.3 },
          { type: "icon", content: "💡", position: { x: 75, y: 30 }, animation: "bounce", delay: 0.6 },
          { type: "icon", content: "🍔", position: { x: 25, y: 55 }, animation: "bounce", delay: 0.9 },
          { type: "icon", content: "📦", position: { x: 75, y: 55 }, animation: "bounce", delay: 1.2 },
        ]
      },
      {
        id: "reducing",
        duration: 12,
        narration: "Simple ways to reduce your footprint: walk or bike for short trips, turn off lights and use efficient appliances, eat more plant-based foods, practice the 3 Rs, and plant trees that absorb CO2!",
        visualType: "diagram",
        elements: [
          { type: "text", content: "🚴 Walk or Bike", position: { x: 25, y: 25 }, animation: "slideUp", delay: 0.3 },
          { type: "text", content: "💡 Save Energy", position: { x: 75, y: 25 }, animation: "slideUp", delay: 0.6 },
          { type: "text", content: "🥗 Eat Plants", position: { x: 25, y: 50 }, animation: "slideUp", delay: 0.9 },
          { type: "text", content: "🌳 Plant Trees", position: { x: 75, y: 50 }, animation: "slideUp", delay: 1.2 },
        ]
      },
      {
        id: "summary",
        duration: 5,
        narration: "Every small action counts! Ready to test your eco-knowledge?",
        visualType: "summary",
        elements: [
          { type: "icon", content: "🌎", position: { x: 50, y: 35 }, animation: "bounce", delay: 0.3 },
          { type: "text", content: "Quiz Time!", position: { x: 50, y: 55 }, animation: "pulse", delay: 0.8 },
        ]
      }
    ],
    quiz: [
      {
        question: "Which activity typically produces the MOST carbon emissions?",
        options: ["Walking to school", "Flying on an airplane", "Eating a salad", "Reading a book"],
        correctAnswer: 1,
        explanation: "Flying produces significant carbon emissions - a single flight can equal months of other activities combined!"
      }
    ]
  },
  "env-4": {
    id: "env-4",
    title: "Data Visualization",
    videoScenes: [
      {
        id: "intro",
        duration: 6,
        narration: "Numbers can be boring, but pictures make data exciting! Let's learn how to visualize environmental data.",
        visualType: "intro",
        elements: [
          { type: "icon", content: "📊", position: { x: 50, y: 30 }, animation: "bounce", delay: 0.5 },
          { type: "text", content: "Data Visualization", position: { x: 50, y: 55 }, animation: "slideUp", delay: 1 },
        ]
      },
      {
        id: "why",
        duration: 10,
        narration: "Data visualization turns numbers into pictures! We can see patterns quickly, compare things easily, tell memorable stories, and spot unusual data points that stand out.",
        visualType: "concept",
        elements: [
          { type: "text", content: "👁️ See Patterns", position: { x: 25, y: 30 }, animation: "slideUp", delay: 0.3 },
          { type: "text", content: "⚖️ Compare Easily", position: { x: 75, y: 30 }, animation: "slideUp", delay: 0.6 },
          { type: "text", content: "📖 Tell Stories", position: { x: 25, y: 55 }, animation: "slideUp", delay: 0.9 },
          { type: "text", content: "🎯 Spot Outliers", position: { x: 75, y: 55 }, animation: "slideUp", delay: 1.2 },
        ]
      },
      {
        id: "charts",
        duration: 12,
        narration: "Different charts for different data! Bar charts compare categories, line charts show change over time, pie charts show parts of a whole, maps show geographic data, and scatter plots show relationships!",
        visualType: "diagram",
        elements: [
          { type: "text", content: "📊 Bar Charts", position: { x: 25, y: 25 }, animation: "bounce", delay: 0.3 },
          { type: "text", content: "📈 Line Charts", position: { x: 75, y: 25 }, animation: "bounce", delay: 0.6 },
          { type: "text", content: "🥧 Pie Charts", position: { x: 25, y: 50 }, animation: "bounce", delay: 0.9 },
          { type: "text", content: "🗺️ Maps", position: { x: 75, y: 50 }, animation: "bounce", delay: 1.2 },
        ]
      },
      {
        id: "summary",
        duration: 5,
        narration: "You're becoming a data storyteller! Quiz time!",
        visualType: "summary",
        elements: [
          { type: "icon", content: "📉", position: { x: 50, y: 35 }, animation: "bounce", delay: 0.3 },
          { type: "text", content: "Quiz Time!", position: { x: 50, y: 55 }, animation: "pulse", delay: 0.8 },
        ]
      }
    ],
    quiz: [
      {
        question: "Which chart type is best for showing how something changes over time?",
        options: ["Pie chart", "Line chart", "Bar chart", "Scatter plot"],
        correctAnswer: 1,
        explanation: "Line charts are perfect for showing trends and changes over time - the line connects data points chronologically!"
      }
    ]
  },
  "env-5": {
    id: "env-5",
    title: "Interactive Games",
    videoScenes: [
      {
        id: "intro",
        duration: 6,
        narration: "Learning can be fun! Let's explore how games make education engaging and effective.",
        visualType: "intro",
        elements: [
          { type: "icon", content: "🎮", position: { x: 50, y: 30 }, animation: "bounce", delay: 0.5 },
          { type: "text", content: "Interactive Games", position: { x: 50, y: 55 }, animation: "slideUp", delay: 1 },
        ]
      },
      {
        id: "whywork",
        duration: 12,
        narration: "Games work for learning because they're engaging and fun, they let you practice skills, give immediate feedback, let you fail safely without real consequences, and challenge you to grow!",
        visualType: "concept",
        elements: [
          { type: "text", content: "🎯 Engagement", position: { x: 25, y: 25 }, animation: "bounce", delay: 0.3 },
          { type: "text", content: "🔄 Practice", position: { x: 75, y: 25 }, animation: "bounce", delay: 0.6 },
          { type: "text", content: "⚡ Feedback", position: { x: 25, y: 50 }, animation: "bounce", delay: 0.9 },
          { type: "text", content: "📈 Challenge", position: { x: 75, y: 50 }, animation: "bounce", delay: 1.2 },
        ]
      },
      {
        id: "elements",
        duration: 10,
        narration: "Good educational games have clear goals, meaningful choices, rewards like points or badges, increasing challenge, and learning moments that teach without being boring!",
        visualType: "diagram",
        elements: [
          { type: "text", content: "🎯 Clear Goals", position: { x: 30, y: 28 }, animation: "slideUp", delay: 0.3 },
          { type: "text", content: "🤔 Meaningful Choices", position: { x: 70, y: 28 }, animation: "slideUp", delay: 0.6 },
          { type: "text", content: "🏆 Rewards", position: { x: 30, y: 52 }, animation: "slideUp", delay: 0.9 },
          { type: "text", content: "📚 Learning", position: { x: 70, y: 52 }, animation: "slideUp", delay: 1.2 },
        ]
      },
      {
        id: "summary",
        duration: 5,
        narration: "Now you know the secrets of game design! Test your knowledge!",
        visualType: "summary",
        elements: [
          { type: "icon", content: "🕹️", position: { x: 50, y: 35 }, animation: "bounce", delay: 0.3 },
          { type: "text", content: "Quiz Time!", position: { x: 50, y: 55 }, animation: "pulse", delay: 0.8 },
        ]
      }
    ],
    quiz: [
      {
        question: "What makes educational games effective for learning?",
        options: ["They're very long", "They provide feedback and meaningful choices", "They have no rules", "They're always single-player"],
        correctAnswer: 1,
        explanation: "Good educational games give immediate feedback on your choices, helping you learn from both successes and mistakes!"
      }
    ]
  },
  "env-6": {
    id: "env-6",
    title: "Dashboard Design",
    videoScenes: [
      {
        id: "intro",
        duration: 6,
        narration: "Dashboards are like mission control for data! Let's learn how to design dashboards that make information clear.",
        visualType: "intro",
        elements: [
          { type: "icon", content: "📱", position: { x: 50, y: 30 }, animation: "bounce", delay: 0.5 },
          { type: "text", content: "Dashboard Design", position: { x: 50, y: 55 }, animation: "slideUp", delay: 1 },
        ]
      },
      {
        id: "whatis",
        duration: 10,
        narration: "A dashboard shows important information at a glance, like the dashboard in a car. It's used for monitoring progress, making decisions, noticing problems, and sharing info with others!",
        visualType: "concept",
        elements: [
          { type: "text", content: "📊 Monitor", position: { x: 25, y: 30 }, animation: "bounce", delay: 0.3 },
          { type: "text", content: "🤔 Decide", position: { x: 75, y: 30 }, animation: "bounce", delay: 0.6 },
          { type: "text", content: "🚨 Alert", position: { x: 25, y: 55 }, animation: "bounce", delay: 0.9 },
          { type: "text", content: "📢 Share", position: { x: 75, y: 55 }, animation: "bounce", delay: 1.2 },
        ]
      },
      {
        id: "components",
        duration: 12,
        narration: "Environmental dashboards include key metrics like total emissions, trends over time, comparisons to goals, alerts when something needs attention, and action items for improvement!",
        visualType: "diagram",
        elements: [
          { type: "text", content: "🔢 Key Metrics", position: { x: 25, y: 25 }, animation: "slideUp", delay: 0.3 },
          { type: "text", content: "📈 Trends", position: { x: 75, y: 25 }, animation: "slideUp", delay: 0.6 },
          { type: "text", content: "🎯 Comparisons", position: { x: 25, y: 50 }, animation: "slideUp", delay: 0.9 },
          { type: "text", content: "⚡ Actions", position: { x: 75, y: 50 }, animation: "slideUp", delay: 1.2 },
        ]
      },
      {
        id: "summary",
        duration: 5,
        narration: "Congratulations! You've completed all environmental lessons. Final quiz!",
        visualType: "summary",
        elements: [
          { type: "icon", content: "🏆", position: { x: 50, y: 35 }, animation: "bounce", delay: 0.3 },
          { type: "text", content: "Final Quiz!", position: { x: 50, y: 55 }, animation: "pulse", delay: 0.8 },
        ]
      }
    ],
    quiz: [
      {
        question: "What is the main purpose of a dashboard?",
        options: ["To look pretty", "To show important information at a glance", "To hide data from users", "To replace all charts"],
        correctAnswer: 1,
        explanation: "Dashboards are designed to show important information quickly so you can monitor progress and make decisions!"
      }
    ]
  }
};

const defaultLesson: LessonContent = {
  id: "default",
  title: "Lesson Coming Soon",
  videoScenes: [
    {
      id: "coming-soon",
      duration: 5,
      narration: "This lesson is being developed. Check back soon for exciting new content!",
      visualType: "intro",
      elements: [
        { type: "icon", content: "🚧", position: { x: 50, y: 35 }, animation: "bounce", delay: 0.3 },
        { type: "text", content: "Coming Soon!", position: { x: 50, y: 55 }, animation: "fadeIn", delay: 0.8 },
      ]
    }
  ],
  quiz: []
};

export default function Lesson() {
  const { trackId, lessonId } = useParams<{ trackId: string; lessonId: string }>();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"video" | "quiz" | "complete">("video");
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  
  const [completedLessons, setCompletedLessons] = useLocalStorage<string[]>(`${trackId}-lessons`, []);

  const lesson = lessonContent[lessonId || ""] || defaultLesson;
  const isAI = trackId === "ai-innovation";
  const quizProgress = lesson.quiz.length > 0 ? ((currentQuiz + 1) / lesson.quiz.length) * 100 : 100;

  const handleVideoComplete = () => {
    if (lesson.quiz.length > 0) {
      setPhase("quiz");
    } else {
      handleLessonComplete();
    }
  };

  const handleQuizAnswer = () => {
    if (selectedAnswer === null) {
      toast.error("Please select an answer");
      return;
    }

    if (!showExplanation) {
      setShowExplanation(true);
      if (selectedAnswer === lesson.quiz[currentQuiz].correctAnswer) {
        setCorrectAnswers(prev => prev + 1);
      }
      return;
    }

    // Move to next question or complete
    if (currentQuiz < lesson.quiz.length - 1) {
      setCurrentQuiz(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      handleLessonComplete();
    }
  };

  const handleLessonComplete = () => {
    if (lessonId && !completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
    }
    setPhase("complete");
  };

  const handleContinue = () => {
    toast.success("Lesson completed! Take the module quiz to unlock the next lesson.");
    navigate(`/track/${trackId}`);
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
            <span className="text-white/80 text-sm flex items-center gap-2">
              {phase === "video" && <><PlayCircle className="h-4 w-4" /> Video Lesson</>}
              {phase === "quiz" && <><HelpCircle className="h-4 w-4" /> Quiz</>}
              {phase === "complete" && <><Trophy className="h-4 w-4" /> Complete!</>}
            </span>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">{lesson.title}</h1>
          <Progress 
            value={phase === "video" ? 0 : phase === "quiz" ? 50 + (quizProgress / 2) : 100} 
            className="h-2 bg-white/20" 
          />
        </div>
      </div>

      <div className="container py-8">
        {/* Video Phase */}
        {phase === "video" && (
          <div className="max-w-4xl mx-auto">
            <AnimatedVideoLesson
              scenes={lesson.videoScenes}
              title={lesson.title}
              onComplete={handleVideoComplete}
            />
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground text-center">
                📚 Complete the video lesson to unlock the quiz. No skipping allowed!
              </p>
            </div>
          </div>
        )}

        {/* Quiz Phase */}
        {phase === "quiz" && (
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-primary">
                    <HelpCircle className="h-5 w-5" />
                    <span className="font-semibold">Question {currentQuiz + 1} of {lesson.quiz.length}</span>
                  </div>
                  <Progress value={quizProgress} className="w-24 h-2" />
                </div>
                <CardTitle className="text-xl mt-4">
                  {lesson.quiz[currentQuiz].question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup 
                  value={selectedAnswer?.toString()} 
                  onValueChange={(v) => setSelectedAnswer(parseInt(v))}
                  className="space-y-3"
                  disabled={showExplanation}
                >
                  {lesson.quiz[currentQuiz].options.map((option, i) => {
                    const isCorrect = i === lesson.quiz[currentQuiz].correctAnswer;
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
                    selectedAnswer === lesson.quiz[currentQuiz].correctAnswer 
                      ? 'bg-green-100 dark:bg-green-950 border border-green-200 dark:border-green-800'
                      : 'bg-amber-100 dark:bg-amber-950 border border-amber-200 dark:border-amber-800'
                  }`}>
                    <p className="font-medium text-foreground mb-1">
                      {selectedAnswer === lesson.quiz[currentQuiz].correctAnswer ? '✓ Correct!' : '✗ Not quite!'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {lesson.quiz[currentQuiz].explanation}
                    </p>
                  </div>
                )}

                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={handleQuizAnswer}>
                    {!showExplanation ? (
                      "Check Answer"
                    ) : currentQuiz === lesson.quiz.length - 1 ? (
                      "Complete Lesson"
                    ) : (
                      <>
                        Next Question
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Complete Phase */}
        {phase === "complete" && (
          <div className="max-w-md mx-auto text-center">
            <Card className="shadow-lg">
              <CardContent className="pt-8 pb-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Lesson Complete!</h2>
                <p className="text-muted-foreground mb-4">
                  You got {correctAnswers} out of {lesson.quiz.length} questions correct.
                  {correctAnswers === lesson.quiz.length && " Perfect score! 🎉"}
                </p>
                <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800 mb-6">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    🎯 <strong>Next Step:</strong> Take the Module Quiz on the track page to unlock the next lesson and project!
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <Button onClick={handleContinue} className="w-full">
                    Go to Module Quiz
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
