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
        content: "The quality and quantity of data directly affects how well AI can learn:\n\n• **More data** = AI can find more patterns\n• **Clean data** = AI makes fewer mistakes\n• **Diverse data** = AI works for more situations\n\nImagine trying to learn about animals by only seeing pictures of cats. You would think all animals are cats! AI has the same problem if it does not see enough variety.",
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
  "ai-3": {
    id: "ai-3",
    title: "Pattern Recognition",
    sections: [
      {
        type: "text",
        title: "What are Patterns?",
        content: "Patterns are regularities or repeated elements that we can observe. AI is incredibly good at finding patterns that humans might miss!\n\nExamples of patterns:\n• **Visual**: Stripes on a zebra, shapes in clouds\n• **Numerical**: 2, 4, 6, 8 (adding 2 each time)\n• **Behavioral**: People buy more ice cream when it is hot\n• **Language**: Sentences usually have subjects and verbs",
      },
      {
        type: "visual",
        title: "How AI Sees Patterns",
        content: "AI breaks down images into tiny pieces called pixels and looks for patterns in colors and shapes.",
        imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop",
      },
      {
        type: "text",
        title: "Pattern Recognition in Action",
        content: "Here is how AI uses pattern recognition:\n\n1. **Face Recognition**: AI learns that faces have two eyes, a nose, and a mouth in specific positions\n\n2. **Spam Detection**: AI learns that spam emails often have certain words like \"free money\" or \"click here\"\n\n3. **Music Recommendations**: AI learns what songs you like and finds similar patterns in other songs\n\n4. **Weather Prediction**: AI learns patterns in temperature, pressure, and wind to predict weather",
      },
      {
        type: "quiz",
        question: "How does AI recognize faces in photos?",
        options: [
          "It asks a human to identify each face",
          "It learns patterns like eye and nose positions",
          "It reads the person's name tag",
          "It guesses randomly"
        ],
        correctAnswer: 1,
        explanation: "AI learns that faces have specific patterns - two eyes, a nose, and a mouth in predictable positions!",
      },
    ],
  },
  "ai-4": {
    id: "ai-4",
    title: "Building a Chatbot",
    sections: [
      {
        type: "text",
        title: "What is a Chatbot?",
        content: "A chatbot is an AI program that can have conversations with people. You have probably used chatbots before!\n\nCommon chatbots:\n• **Virtual assistants**: Siri, Alexa, Google Assistant\n• **Customer service**: Help bots on websites\n• **Fun bots**: Game characters that talk to you\n• **Educational bots**: Tutors that answer questions",
      },
      {
        type: "text",
        title: "How Chatbots Work",
        content: "Chatbots work by understanding what you say and generating appropriate responses:\n\n1. **Input Processing**: The chatbot reads your message\n\n2. **Intent Recognition**: It figures out what you want (asking a question, making a request, etc.)\n\n3. **Response Generation**: It creates a helpful reply\n\n4. **Learning**: Modern chatbots improve from conversations\n\nSimple chatbots use rules (if user says X, respond with Y). Advanced chatbots use AI to understand context and generate natural responses.",
      },
      {
        type: "visual",
        title: "Chatbot Conversation Flow",
        content: "A chatbot conversation follows a natural back-and-forth pattern, just like talking to a friend.",
        imageUrl: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=600&h=400&fit=crop",
      },
      {
        type: "quiz",
        question: "What is the first step when a chatbot receives your message?",
        options: [
          "Generate a random response",
          "Process and understand your input",
          "Ask another human for help",
          "Ignore the message"
        ],
        correctAnswer: 1,
        explanation: "The chatbot first processes your input to understand what you are asking before it can respond!",
      },
    ],
  },
  "ai-5": {
    id: "ai-5",
    title: "Sentiment Analysis",
    sections: [
      {
        type: "text",
        title: "What is Sentiment?",
        content: "Sentiment is the emotion or feeling behind words. When you say \"I love this!\" the sentiment is positive. When you say \"This is terrible\" the sentiment is negative.\n\nSentiment can be:\n• **Positive**: Happy, excited, grateful, satisfied\n• **Negative**: Sad, angry, frustrated, disappointed\n• **Neutral**: Factual statements without strong emotion",
      },
      {
        type: "text",
        title: "How AI Detects Sentiment",
        content: "AI learns to detect sentiment by analyzing many examples of text with known emotions:\n\n1. **Word Analysis**: Certain words signal emotions (\"love\" = positive, \"hate\" = negative)\n\n2. **Context Matters**: \"This movie was sick!\" could be positive (cool) or negative (bad) depending on context\n\n3. **Intensity**: \"Good\" vs \"Amazing\" vs \"Incredible\" have different strengths\n\n4. **Emoji and Punctuation**: 😊 and !!! can indicate emotion",
      },
      {
        type: "text",
        title: "Real-World Uses",
        content: "Sentiment analysis is used everywhere:\n\n• **Social Media**: Companies track how people feel about their products\n• **Customer Reviews**: Automatically sort positive and negative reviews\n• **News Analysis**: Understand public opinion on events\n• **Mental Health**: Apps that detect emotional distress\n• **Market Research**: Predict trends based on public sentiment",
      },
      {
        type: "quiz",
        question: "Why might AI have trouble with the phrase 'This is sick!'?",
        options: [
          "The word is too short",
          "It could mean positive or negative depending on context",
          "AI cannot read English",
          "The sentence has no sentiment"
        ],
        correctAnswer: 1,
        explanation: "Slang like 'sick' can mean 'cool/awesome' (positive) or 'bad/gross' (negative) - AI needs context to decide!",
      },
    ],
  },
  "ai-6": {
    id: "ai-6",
    title: "Predictive Models",
    sections: [
      {
        type: "text",
        title: "What are Predictions?",
        content: "Predictions are educated guesses about the future based on patterns from the past. AI can make predictions by learning from historical data.\n\nExamples of predictions:\n• **Weather**: Tomorrow will be sunny based on atmospheric patterns\n• **Sports**: Team A has 70% chance to win based on past performance\n• **Shopping**: You might like this product based on what you bought before\n• **Health**: Risk of disease based on lifestyle factors",
      },
      {
        type: "visual",
        title: "Making Predictions with Data",
        content: "AI analyzes trends and patterns in data to forecast what might happen next.",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      },
      {
        type: "text",
        title: "How Predictive Models Work",
        content: "Building a predictive model involves several steps:\n\n1. **Collect Data**: Gather historical information (past sales, weather records, etc.)\n\n2. **Find Patterns**: AI identifies relationships in the data\n\n3. **Build the Model**: Create rules based on patterns found\n\n4. **Make Predictions**: Apply the model to new data\n\n5. **Evaluate Accuracy**: Check how well predictions match reality\n\n6. **Improve**: Refine the model based on results",
      },
      {
        type: "text",
        title: "Limitations of Predictions",
        content: "Predictions are not perfect! Remember:\n\n• **Past does not guarantee future**: Patterns can change\n• **Garbage in, garbage out**: Bad data leads to bad predictions\n• **Probability, not certainty**: 80% chance of rain means 20% chance of no rain\n• **Unexpected events**: AI cannot predict truly random events\n• **Bias**: If training data is biased, predictions will be too",
      },
      {
        type: "quiz",
        question: "Why might a predictive model make wrong predictions?",
        options: [
          "AI is always 100% accurate",
          "Patterns can change and past does not guarantee future",
          "Predictions do not use data",
          "Models only work on weekdays"
        ],
        correctAnswer: 1,
        explanation: "Patterns can change over time, and past data does not always predict the future perfectly!",
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
        content: "Environmental data helps us understand and protect our planet. Scientists and everyday people collect information about:\n\n• **Air Quality**: Pollution levels, CO2 concentration\n• **Water**: Temperature, cleanliness, ocean levels\n• **Land**: Forest coverage, soil health, wildlife\n• **Climate**: Temperature changes, rainfall, extreme weather",
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
          "It is too complicated to be useful",
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
        content: "Not all trash is the same! Understanding waste categories is the first step to recycling:\n\n• **Recyclables**: Paper, cardboard, glass, metal, some plastics\n• **Organic Waste**: Food scraps, yard waste, can become compost\n• **Hazardous Waste**: Batteries, chemicals, electronics\n• **General Waste**: Items that cannot be recycled or composted",
      },
      {
        type: "text",
        title: "The 3 Rs: Reduce, Reuse, Recycle",
        content: "The best way to manage waste is to follow the 3 Rs in order:\n\n1. **Reduce**: Use less stuff in the first place\n2. **Reuse**: Find new uses for items before throwing them away\n3. **Recycle**: Turn old materials into new products\n\nRecycling is important, but reducing and reusing come first!",
      },
      {
        type: "quiz",
        question: "Which of the 3 Rs should come first?",
        options: [
          "Recycle",
          "Reuse",
          "Reduce",
          "They are all equal"
        ],
        correctAnswer: 2,
        explanation: "Reduce comes first! Using less stuff in the first place is the most effective way to minimize waste.",
      },
    ],
  },
  "env-3": {
    id: "env-3",
    title: "Carbon Footprint",
    sections: [
      {
        type: "text",
        title: "What is Carbon Footprint?",
        content: "Your carbon footprint is the total amount of greenhouse gases (especially CO2) produced by your activities.\n\nActivities that create carbon emissions:\n• **Transportation**: Driving cars, flying in planes\n• **Energy Use**: Electricity for lights, heating, cooling\n• **Food**: Meat production, food transportation\n• **Products**: Manufacturing and shipping items you buy",
      },
      {
        type: "visual",
        title: "CO2 in Our Atmosphere",
        content: "Carbon dioxide traps heat in our atmosphere, contributing to global warming.",
        imageUrl: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=600&h=400&fit=crop",
      },
      {
        type: "text",
        title: "Reducing Your Carbon Footprint",
        content: "Simple ways to reduce your carbon footprint:\n\n1. **Walk or Bike**: Use less fuel for short trips\n2. **Save Energy**: Turn off lights, use efficient appliances\n3. **Eat Less Meat**: Plant-based foods have lower emissions\n4. **Reduce, Reuse, Recycle**: Less production means less carbon\n5. **Plant Trees**: Trees absorb CO2 from the air",
      },
      {
        type: "text",
        title: "Measuring Carbon",
        content: "Carbon footprint is measured in kilograms or tons of CO2:\n\n• Average person: ~4-16 tons CO2 per year (varies by country)\n• One flight across the country: ~0.5-1 ton CO2\n• Driving 1 mile: ~0.4 kg CO2\n• Eating a beef burger: ~3-6 kg CO2\n\nKnowing these numbers helps us make better choices!",
      },
      {
        type: "quiz",
        question: "Which activity typically produces the MOST carbon emissions?",
        options: [
          "Walking to school",
          "Flying on an airplane",
          "Eating a salad",
          "Reading a book"
        ],
        correctAnswer: 1,
        explanation: "Flying produces significant carbon emissions - a single flight can equal months of other activities combined!",
      },
    ],
  },
  "env-4": {
    id: "env-4",
    title: "Data Visualization",
    sections: [
      {
        type: "text",
        title: "Why Visualize Data?",
        content: "Data visualization turns numbers into pictures that are easier to understand.\n\nBenefits of visualization:\n• **See patterns quickly**: Trends jump out visually\n• **Compare easily**: Side-by-side comparisons\n• **Tell stories**: Make data memorable\n• **Spot outliers**: Unusual data points stand out",
      },
      {
        type: "text",
        title: "Types of Charts",
        content: "Different charts work best for different data:\n\n• **Bar Charts**: Compare categories (recycling rates by city)\n• **Line Charts**: Show change over time (temperature trends)\n• **Pie Charts**: Show parts of a whole (waste composition)\n• **Maps**: Show geographic data (pollution levels by region)\n• **Scatter Plots**: Show relationships (temperature vs. energy use)",
      },
      {
        type: "visual",
        title: "Environmental Data Visualizations",
        content: "Scientists use colorful charts and maps to show climate data and trends.",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      },
      {
        type: "text",
        title: "Creating Good Visualizations",
        content: "Tips for effective data visualization:\n\n1. **Choose the right chart type**: Match chart to your data\n2. **Keep it simple**: Do not overcrowd with information\n3. **Use clear labels**: Everyone should understand axes and legends\n4. **Use appropriate colors**: Make it accessible and meaningful\n5. **Tell a story**: Have a clear message",
      },
      {
        type: "quiz",
        question: "Which chart type is best for showing how something changes over time?",
        options: [
          "Pie chart",
          "Line chart",
          "Bar chart",
          "Scatter plot"
        ],
        correctAnswer: 1,
        explanation: "Line charts are perfect for showing trends and changes over time - the line connects data points chronologically!",
      },
    ],
  },
  "env-5": {
    id: "env-5",
    title: "Interactive Games",
    sections: [
      {
        type: "text",
        title: "Learning Through Games",
        content: "Educational games make learning fun and memorable!\n\nWhy games work for learning:\n• **Engagement**: Games are fun and motivating\n• **Practice**: Repeat actions to build skills\n• **Feedback**: Immediate response to choices\n• **Safe failure**: Learn from mistakes without real consequences\n• **Challenge**: Progressive difficulty keeps you growing",
      },
      {
        type: "text",
        title: "Elements of Good Educational Games",
        content: "What makes a game educational AND fun:\n\n1. **Clear Goals**: Players know what to achieve\n2. **Meaningful Choices**: Decisions affect outcomes\n3. **Rewards**: Points, badges, or progress indicators\n4. **Increasing Challenge**: Start easy, get harder\n5. **Learning Moments**: Teach without being boring",
      },
      {
        type: "visual",
        title: "Gamification in Action",
        content: "Games can teach environmental concepts through interactive challenges and simulations.",
        imageUrl: "https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=600&h=400&fit=crop",
      },
      {
        type: "text",
        title: "Designing Your Own Game",
        content: "Steps to create an educational game:\n\n1. **Pick Your Topic**: What do you want to teach?\n2. **Define the Goal**: What should players learn?\n3. **Create Rules**: How does the game work?\n4. **Add Challenges**: What makes it interesting?\n5. **Include Feedback**: How do players know they are learning?\n6. **Test and Improve**: Play it and make it better!",
      },
      {
        type: "quiz",
        question: "What makes educational games effective for learning?",
        options: [
          "They are very long",
          "They provide feedback and meaningful choices",
          "They have no rules",
          "They are always single-player"
        ],
        correctAnswer: 1,
        explanation: "Good educational games give immediate feedback on your choices, helping you learn from both successes and mistakes!",
      },
    ],
  },
  "env-6": {
    id: "env-6",
    title: "Dashboard Design",
    sections: [
      {
        type: "text",
        title: "What is a Dashboard?",
        content: "A dashboard is a visual display that shows important information at a glance, like the dashboard in a car.\n\nDashboards are used for:\n• **Monitoring**: Track progress toward goals\n• **Decision Making**: See data to make informed choices\n• **Alerts**: Notice problems quickly\n• **Communication**: Share information with others",
      },
      {
        type: "visual",
        title: "Analytics Dashboards",
        content: "Modern dashboards combine multiple visualizations to show a complete picture of data.",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      },
      {
        type: "text",
        title: "Key Dashboard Components",
        content: "A good environmental dashboard includes:\n\n1. **Key Metrics**: The most important numbers (total emissions, waste diverted)\n2. **Trends**: How things are changing over time\n3. **Comparisons**: How you compare to goals or others\n4. **Alerts**: Warnings when something needs attention\n5. **Actions**: What you can do to improve",
      },
      {
        type: "text",
        title: "Dashboard Design Principles",
        content: "Design tips for effective dashboards:\n\n• **Prioritize**: Most important info should be most visible\n• **Group Related Items**: Organize logically\n• **Use Color Wisely**: Green for good, red for alerts\n• **Keep It Updated**: Show current data\n• **Make It Actionable**: Help users know what to do next\n• **Mobile Friendly**: Work on different screen sizes",
      },
      {
        type: "quiz",
        question: "What is the main purpose of a dashboard?",
        options: [
          "To look pretty",
          "To show important information at a glance",
          "To hide data from users",
          "To replace all charts"
        ],
        correctAnswer: 1,
        explanation: "Dashboards are designed to show important information quickly so you can monitor progress and make decisions!",
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
