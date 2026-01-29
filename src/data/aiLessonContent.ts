import { InteractiveScene } from "@/components/lessons/InteractiveVideoLesson";

interface LessonContent {
  id: string;
  title: string;
  videoScenes: InteractiveScene[];
  quiz: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
}

export const aiLessonContent: Record<string, LessonContent> = {
  "ai-1": {
    id: "ai-1",
    title: "What is AI?",
    videoScenes: [
      {
        id: "intro",
        duration: 8,
        narration: "Welcome to the exciting world of Artificial Intelligence! Today we'll explore what AI really means, how it works, and why it's changing our world. Get ready for an interactive journey!",
        visualType: "intro",
        elements: [
          { type: "icon", content: "🤖", position: { x: 50, y: 25 }, animation: "bounce", delay: 0.5, size: "xl" },
          { type: "text", content: "What is Artificial Intelligence?", position: { x: 50, y: 50 }, animation: "slideUp", delay: 1, size: "xl" },
          { type: "text", content: "An Interactive Learning Experience", position: { x: 50, y: 65 }, animation: "fadeIn", delay: 1.5, size: "md" },
        ]
      },
      {
        id: "definition",
        duration: 12,
        narration: "Artificial Intelligence, or AI, is the science of making computers think and learn like humans. Instead of following strict rules, AI systems can learn from experience, adapt to new situations, and make decisions on their own.",
        visualType: "concept",
        elements: [
          { type: "character", content: "🧠", position: { x: 25, y: 35 }, animation: "bounce", delay: 0.3 },
          { type: "icon", content: "➡️", position: { x: 50, y: 35 }, animation: "fadeIn", delay: 0.8 },
          { type: "character", content: "💻", position: { x: 75, y: 35 }, animation: "bounce", delay: 1.2 },
          { type: "text", content: "Human Intelligence → Machines", position: { x: 50, y: 55 }, animation: "slideUp", delay: 1.5, size: "lg" },
        ],
        keyTakeaway: "AI makes computers think and learn like humans!"
      },
      {
        id: "types-of-ai",
        duration: 14,
        narration: "There are different types of AI. Narrow AI is designed for specific tasks like playing chess or recommending movies. General AI would match human intelligence across all areas - but this doesn't exist yet! And Superintelligent AI would surpass human intelligence - this is still science fiction.",
        visualType: "deep-dive",
        elements: [
          { type: "text", content: "🎯 Narrow AI", position: { x: 25, y: 25 }, animation: "slideRight", delay: 0.3, size: "lg" },
          { type: "text", content: "Specific tasks (Exists today!)", position: { x: 25, y: 35 }, animation: "fadeIn", delay: 0.5 },
          { type: "text", content: "🌐 General AI", position: { x: 50, y: 45 }, animation: "slideUp", delay: 0.8, size: "lg" },
          { type: "text", content: "Human-level (Research goal)", position: { x: 50, y: 55 }, animation: "fadeIn", delay: 1 },
          { type: "text", content: "🚀 Super AI", position: { x: 75, y: 65 }, animation: "slideLeft", delay: 1.3, size: "lg" },
          { type: "text", content: "Beyond human (Science fiction)", position: { x: 75, y: 75 }, animation: "fadeIn", delay: 1.5 },
        ],
        keyTakeaway: "Most AI today is Narrow AI - designed for specific tasks."
      },
      {
        id: "interactive-types",
        duration: 10,
        narration: "Let's check your understanding! Which type of AI powers voice assistants like Siri and Alexa?",
        visualType: "interactive",
        elements: [
          { type: "icon", content: "🎤", position: { x: 50, y: 30 }, animation: "bounce", delay: 0.3, size: "lg" },
          { type: "text", content: "Voice Assistants", position: { x: 50, y: 45 }, animation: "fadeIn", delay: 0.5 },
        ],
        interaction: {
          type: "choice",
          question: "What type of AI powers Siri, Alexa, and Google Assistant?",
          options: [
            { id: "a", label: "General AI - They can do anything!", isCorrect: false },
            { id: "b", label: "Narrow AI - Designed for voice tasks", isCorrect: true },
            { id: "c", label: "Super AI - They're smarter than humans", isCorrect: false },
          ],
          correctFeedback: "Correct! Voice assistants are Narrow AI - they're very good at understanding speech and answering questions, but can't do other things like drive a car.",
          incorrectFeedback: "Not quite! Voice assistants are actually Narrow AI - they excel at specific tasks but can't do everything.",
          hint: "Think about what these assistants can and cannot do..."
        }
      },
      {
        id: "how-ai-learns",
        duration: 14,
        narration: "How does AI actually learn? It's similar to how you learn! First, AI collects data - like how you read books and observe the world. Then it finds patterns - like noticing that cats have whiskers and dogs have wet noses. Next it makes predictions - using those patterns to guess about new things. Finally, it improves from feedback - just like you learn from your mistakes!",
        visualType: "diagram",
        elements: [
          { type: "text", content: "1️⃣ Collect Data", position: { x: 25, y: 25 }, animation: "slideUp", delay: 0.3, size: "lg" },
          { type: "icon", content: "📚", position: { x: 25, y: 35 }, animation: "bounce", delay: 0.5 },
          { type: "text", content: "2️⃣ Find Patterns", position: { x: 75, y: 25 }, animation: "slideUp", delay: 0.8, size: "lg" },
          { type: "icon", content: "🔍", position: { x: 75, y: 35 }, animation: "bounce", delay: 1 },
          { type: "text", content: "3️⃣ Make Predictions", position: { x: 25, y: 55 }, animation: "slideUp", delay: 1.3, size: "lg" },
          { type: "icon", content: "🎯", position: { x: 25, y: 65 }, animation: "bounce", delay: 1.5 },
          { type: "text", content: "4️⃣ Improve!", position: { x: 75, y: 55 }, animation: "slideUp", delay: 1.8, size: "lg" },
          { type: "icon", content: "📈", position: { x: 75, y: 65 }, animation: "bounce", delay: 2 },
        ],
        keyTakeaway: "AI learns through data, patterns, predictions, and feedback - just like you!"
      },
      {
        id: "machine-learning",
        duration: 12,
        narration: "Machine Learning is how AI learns from examples. Imagine teaching a computer to recognize cats. Instead of writing rules like 'cats have pointy ears', you show it thousands of cat pictures. The computer figures out the patterns on its own! This is called training.",
        visualType: "concept",
        elements: [
          { type: "icon", content: "🐱", position: { x: 20, y: 30 }, animation: "bounce", delay: 0.3 },
          { type: "icon", content: "🐱", position: { x: 35, y: 30 }, animation: "bounce", delay: 0.5 },
          { type: "icon", content: "🐱", position: { x: 50, y: 30 }, animation: "bounce", delay: 0.7 },
          { type: "icon", content: "➡️", position: { x: 65, y: 30 }, animation: "fadeIn", delay: 1 },
          { type: "icon", content: "🤖", position: { x: 80, y: 30 }, animation: "bounce", delay: 1.2 },
          { type: "text", content: "Many Examples → AI Learns Patterns", position: { x: 50, y: 50 }, animation: "slideUp", delay: 1.5, size: "lg" },
        ],
        keyTakeaway: "Machine Learning lets AI learn patterns from thousands of examples."
      },
      {
        id: "neural-networks",
        duration: 14,
        narration: "Deep inside AI are neural networks - structures inspired by our brains! Your brain has billions of neurons connected together. Neural networks simulate this with artificial neurons. Information flows through layers, each layer recognizing more complex patterns. The first layer might see lines, the next sees shapes, and deeper layers recognize faces!",
        visualType: "deep-dive",
        elements: [
          { type: "icon", content: "⚪", position: { x: 20, y: 30 }, animation: "fadeIn", delay: 0.2 },
          { type: "icon", content: "⚪", position: { x: 20, y: 45 }, animation: "fadeIn", delay: 0.3 },
          { type: "icon", content: "⚪", position: { x: 20, y: 60 }, animation: "fadeIn", delay: 0.4 },
          { type: "icon", content: "🔵", position: { x: 40, y: 35 }, animation: "fadeIn", delay: 0.6 },
          { type: "icon", content: "🔵", position: { x: 40, y: 55 }, animation: "fadeIn", delay: 0.7 },
          { type: "icon", content: "🟣", position: { x: 60, y: 45 }, animation: "fadeIn", delay: 0.9 },
          { type: "icon", content: "🎯", position: { x: 80, y: 45 }, animation: "bounce", delay: 1.2 },
          { type: "text", content: "Input → Hidden Layers → Output", position: { x: 50, y: 75 }, animation: "slideUp", delay: 1.5, size: "md" },
        ],
        keyTakeaway: "Neural networks are inspired by human brains with layers that recognize patterns."
      },
      {
        id: "ai-examples-everyday",
        duration: 12,
        narration: "AI is already all around you! When Netflix recommends shows you might like - that's AI. When your phone recognizes your face - that's AI. When Google translates languages instantly - that's AI. When spam emails get filtered - that's AI. When video games adapt to your skill level - that's AI too!",
        visualType: "real-world",
        elements: [
          { type: "icon", content: "📺", position: { x: 20, y: 28 }, animation: "bounce", delay: 0.3 },
          { type: "text", content: "Recommendations", position: { x: 20, y: 40 }, animation: "fadeIn", delay: 0.4 },
          { type: "icon", content: "👤", position: { x: 40, y: 28 }, animation: "bounce", delay: 0.6 },
          { type: "text", content: "Face ID", position: { x: 40, y: 40 }, animation: "fadeIn", delay: 0.7 },
          { type: "icon", content: "🌐", position: { x: 60, y: 28 }, animation: "bounce", delay: 0.9 },
          { type: "text", content: "Translation", position: { x: 60, y: 40 }, animation: "fadeIn", delay: 1 },
          { type: "icon", content: "📧", position: { x: 80, y: 28 }, animation: "bounce", delay: 1.2 },
          { type: "text", content: "Spam Filter", position: { x: 80, y: 40 }, animation: "fadeIn", delay: 1.3 },
          { type: "icon", content: "🎮", position: { x: 50, y: 55 }, animation: "bounce", delay: 1.5 },
          { type: "text", content: "Smart Games", position: { x: 50, y: 67 }, animation: "fadeIn", delay: 1.6 },
        ]
      },
      {
        id: "interactive-examples",
        duration: 10,
        narration: "Click on each box to discover how AI is used in different areas of your daily life!",
        visualType: "interactive",
        elements: [
          { type: "text", content: "Discover AI in Daily Life", position: { x: 50, y: 25 }, animation: "fadeIn", delay: 0.3, size: "lg" },
        ],
        interaction: {
          type: "click-reveal",
          question: "Click each card to reveal how AI helps in that area:",
          options: [
            { id: "home", label: "🏠 Home: Smart speakers, thermostats, robot vacuums" },
            { id: "school", label: "📚 School: Personalized learning, auto-grading" },
            { id: "health", label: "🏥 Health: Disease detection, drug discovery" },
            { id: "transport", label: "🚗 Transport: GPS routing, self-driving cars" },
          ],
          correctFeedback: "Great job exploring! AI touches almost every part of modern life.",
        }
      },
      {
        id: "ai-capabilities",
        duration: 12,
        narration: "AI has some amazing superpowers! It can process millions of data points in seconds - something humans could never do. It never gets tired or bored. It can find patterns humans miss. And it can work 24 hours a day, 7 days a week without breaks!",
        visualType: "concept",
        elements: [
          { type: "text", content: "⚡ Speed", position: { x: 25, y: 28 }, animation: "slideUp", delay: 0.3, size: "lg" },
          { type: "text", content: "Millions of calculations per second", position: { x: 25, y: 38 }, animation: "fadeIn", delay: 0.5 },
          { type: "text", content: "🔋 Tireless", position: { x: 75, y: 28 }, animation: "slideUp", delay: 0.8, size: "lg" },
          { type: "text", content: "Works 24/7 without breaks", position: { x: 75, y: 38 }, animation: "fadeIn", delay: 1 },
          { type: "text", content: "🔬 Precision", position: { x: 25, y: 55 }, animation: "slideUp", delay: 1.3, size: "lg" },
          { type: "text", content: "Finds hidden patterns", position: { x: 25, y: 65 }, animation: "fadeIn", delay: 1.5 },
          { type: "text", content: "📊 Scale", position: { x: 75, y: 55 }, animation: "slideUp", delay: 1.8, size: "lg" },
          { type: "text", content: "Handles massive data", position: { x: 75, y: 65 }, animation: "fadeIn", delay: 2 },
        ],
        keyTakeaway: "AI excels at speed, consistency, finding patterns, and handling huge amounts of data."
      },
      {
        id: "ai-limitations",
        duration: 12,
        narration: "But AI also has important limitations! It can only work with the data it was trained on. It doesn't truly understand context like humans do. It can make confident mistakes. It lacks common sense and creativity. And it can inherit biases from its training data.",
        visualType: "concept",
        elements: [
          { type: "text", content: "⚠️ AI Limitations", position: { x: 50, y: 20 }, animation: "fadeIn", delay: 0.3, size: "xl" },
          { type: "text", content: "❌ No true understanding", position: { x: 30, y: 38 }, animation: "slideRight", delay: 0.6 },
          { type: "text", content: "❌ Can be confidently wrong", position: { x: 70, y: 38 }, animation: "slideLeft", delay: 0.9 },
          { type: "text", content: "❌ Limited to training data", position: { x: 30, y: 52 }, animation: "slideRight", delay: 1.2 },
          { type: "text", content: "❌ Can inherit biases", position: { x: 70, y: 52 }, animation: "slideLeft", delay: 1.5 },
          { type: "text", content: "❌ Lacks common sense", position: { x: 50, y: 66 }, animation: "slideUp", delay: 1.8 },
        ],
        keyTakeaway: "AI is powerful but has real limitations - it's a tool, not a replacement for human thinking."
      },
      {
        id: "ai-ethics",
        duration: 14,
        narration: "With great power comes great responsibility! AI raises important ethical questions. Should AI make life-or-death decisions? How do we prevent AI bias against certain groups? Who is responsible when AI makes mistakes? How do we protect privacy? These are questions society is still working to answer.",
        visualType: "deep-dive",
        elements: [
          { type: "icon", content: "⚖️", position: { x: 50, y: 25 }, animation: "bounce", delay: 0.3, size: "lg" },
          { type: "text", content: "AI Ethics Questions", position: { x: 50, y: 38 }, animation: "fadeIn", delay: 0.5, size: "lg" },
          { type: "text", content: "🤔 Decision Making - Should AI decide important things?", position: { x: 50, y: 50 }, animation: "slideUp", delay: 0.8 },
          { type: "text", content: "👥 Fairness - How do we prevent bias?", position: { x: 50, y: 58 }, animation: "slideUp", delay: 1.1 },
          { type: "text", content: "🔒 Privacy - How do we protect data?", position: { x: 50, y: 66 }, animation: "slideUp", delay: 1.4 },
        ],
        keyTakeaway: "AI ethics matter - we must use AI responsibly and fairly."
      },
      {
        id: "interactive-ethics",
        duration: 10,
        narration: "Here's a thought experiment for you. A self-driving car must make a split-second decision. What should it prioritize?",
        visualType: "interactive",
        elements: [
          { type: "icon", content: "🚗", position: { x: 50, y: 30 }, animation: "bounce", delay: 0.3, size: "lg" },
          { type: "text", content: "The Self-Driving Car Dilemma", position: { x: 50, y: 45 }, animation: "fadeIn", delay: 0.5, size: "lg" },
        ],
        interaction: {
          type: "choice",
          question: "If a self-driving car can't avoid an accident, what's the most important principle?",
          options: [
            { id: "a", label: "Always protect the passenger at all costs", isCorrect: false },
            { id: "b", label: "Minimize total harm to everyone", isCorrect: true },
            { id: "c", label: "Just let the AI decide randomly", isCorrect: false },
          ],
          correctFeedback: "This is what most ethicists recommend - but it's still debated! There's no perfect answer, which is why AI ethics is so complex.",
          incorrectFeedback: "This is a tricky question! Most ethicists suggest minimizing total harm, but it's still debated.",
          hint: "Think about what would be fair to everyone involved..."
        }
      },
      {
        id: "future-of-ai",
        duration: 12,
        narration: "The future of AI is incredibly exciting! AI will help doctors diagnose diseases earlier. It will make education personalized for every student. It will help solve climate change. It will create art and music. And it will open doors to careers we can't even imagine yet!",
        visualType: "concept",
        elements: [
          { type: "icon", content: "🔮", position: { x: 50, y: 20 }, animation: "bounce", delay: 0.3, size: "lg" },
          { type: "text", content: "The Future of AI", position: { x: 50, y: 32 }, animation: "fadeIn", delay: 0.5, size: "xl" },
          { type: "icon", content: "🏥", position: { x: 20, y: 50 }, animation: "bounce", delay: 0.8 },
          { type: "icon", content: "📚", position: { x: 35, y: 50 }, animation: "bounce", delay: 1 },
          { type: "icon", content: "🌍", position: { x: 50, y: 50 }, animation: "bounce", delay: 1.2 },
          { type: "icon", content: "🎨", position: { x: 65, y: 50 }, animation: "bounce", delay: 1.4 },
          { type: "icon", content: "💼", position: { x: 80, y: 50 }, animation: "bounce", delay: 1.6 },
          { type: "text", content: "Healthcare • Education • Climate • Art • New Careers", position: { x: 50, y: 65 }, animation: "slideUp", delay: 1.8 },
        ]
      },
      {
        id: "your-role",
        duration: 10,
        narration: "Here's the most important part: YOU can shape the future of AI! By learning about AI now, you'll be ready to create, guide, and use AI responsibly. Whether you become an AI researcher, an ethical advisor, or just a smart user - your understanding matters!",
        visualType: "concept",
        elements: [
          { type: "icon", content: "👆", position: { x: 50, y: 25 }, animation: "bounce", delay: 0.3, size: "lg" },
          { type: "text", content: "YOU Can Shape AI's Future!", position: { x: 50, y: 40 }, animation: "slideUp", delay: 0.6, size: "xl" },
          { type: "text", content: "🔬 Create new AI solutions", position: { x: 30, y: 55 }, animation: "fadeIn", delay: 0.9 },
          { type: "text", content: "⚖️ Guide ethical AI use", position: { x: 70, y: 55 }, animation: "fadeIn", delay: 1.2 },
          { type: "text", content: "💡 Use AI to solve problems", position: { x: 50, y: 68 }, animation: "fadeIn", delay: 1.5 },
        ],
        keyTakeaway: "Your AI education today prepares you to lead tomorrow!"
      },
      {
        id: "summary",
        duration: 8,
        narration: "Congratulations! You've completed an in-depth introduction to Artificial Intelligence. You learned what AI is, how it learns, the different types of AI, real-world examples, AI's strengths and limitations, and important ethical considerations. Now let's test your knowledge with a quiz!",
        visualType: "summary",
        elements: [
          { type: "icon", content: "🎉", position: { x: 50, y: 25 }, animation: "bounce", delay: 0.3, size: "xl" },
          { type: "text", content: "Module Complete!", position: { x: 50, y: 42 }, animation: "slideUp", delay: 0.6, size: "xl" },
          { type: "text", content: "✅ AI Definition & Types", position: { x: 30, y: 55 }, animation: "fadeIn", delay: 0.9 },
          { type: "text", content: "✅ How AI Learns", position: { x: 70, y: 55 }, animation: "fadeIn", delay: 1.1 },
          { type: "text", content: "✅ Real-World Applications", position: { x: 30, y: 65 }, animation: "fadeIn", delay: 1.3 },
          { type: "text", content: "✅ Ethics & Future", position: { x: 70, y: 65 }, animation: "fadeIn", delay: 1.5 },
          { type: "text", content: "Ready for the Quiz! 📝", position: { x: 50, y: 78 }, animation: "pulse", delay: 2 },
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
        question: "What type of AI do voice assistants like Siri use?",
        options: ["General AI", "Narrow AI", "Super AI", "Human AI"],
        correctAnswer: 1,
        explanation: "Voice assistants use Narrow AI - they're designed for specific tasks like understanding speech and answering questions."
      },
      {
        question: "What are neural networks inspired by?",
        options: ["Computer circuits", "The human brain", "Spider webs", "The internet"],
        correctAnswer: 1,
        explanation: "Neural networks are inspired by the structure of the human brain, with artificial neurons connected in layers!"
      },
      {
        question: "Which is NOT a limitation of AI?",
        options: ["Can make confident mistakes", "Lacks common sense", "Can process data faster than humans", "Can inherit biases"],
        correctAnswer: 2,
        explanation: "Processing data fast is actually a strength of AI! The limitations include lacking common sense, potential biases, and making confident mistakes."
      },
      {
        question: "Why is AI ethics important?",
        options: ["It makes AI faster", "It ensures AI is used fairly and responsibly", "It's not actually important", "It only matters for robots"],
        correctAnswer: 1,
        explanation: "AI ethics ensures that AI technology is developed and used in ways that are fair, safe, and beneficial to everyone!"
      }
    ]
  },
  "ai-2": {
    id: "ai-2",
    title: "Understanding Data",
    videoScenes: [
      {
        id: "intro",
        duration: 8,
        narration: "Data is the fuel that powers AI! Without data, AI can't learn anything. Today we'll explore what data is, the different types of data, how AI uses data to learn, and why data quality matters so much.",
        visualType: "intro",
        elements: [
          { type: "icon", content: "📊", position: { x: 50, y: 25 }, animation: "bounce", delay: 0.5, size: "xl" },
          { type: "text", content: "Understanding Data", position: { x: 50, y: 48 }, animation: "slideUp", delay: 1, size: "xl" },
          { type: "text", content: "The Fuel That Powers AI", position: { x: 50, y: 62 }, animation: "fadeIn", delay: 1.5, size: "md" },
        ]
      },
      {
        id: "what-is-data",
        duration: 12,
        narration: "Data is simply information that has been collected and stored. Everything around you can become data! Your height is data. The temperature outside is data. The words in this video are data. Even your heartbeat can be recorded as data!",
        visualType: "concept",
        elements: [
          { type: "text", content: "Data = Information", position: { x: 50, y: 22 }, animation: "fadeIn", delay: 0.3, size: "xl" },
          { type: "icon", content: "📏", position: { x: 20, y: 40 }, animation: "bounce", delay: 0.5 },
          { type: "text", content: "Height", position: { x: 20, y: 52 }, animation: "fadeIn", delay: 0.6 },
          { type: "icon", content: "🌡️", position: { x: 40, y: 40 }, animation: "bounce", delay: 0.8 },
          { type: "text", content: "Temperature", position: { x: 40, y: 52 }, animation: "fadeIn", delay: 0.9 },
          { type: "icon", content: "📝", position: { x: 60, y: 40 }, animation: "bounce", delay: 1.1 },
          { type: "text", content: "Text", position: { x: 60, y: 52 }, animation: "fadeIn", delay: 1.2 },
          { type: "icon", content: "💓", position: { x: 80, y: 40 }, animation: "bounce", delay: 1.4 },
          { type: "text", content: "Heartbeat", position: { x: 80, y: 52 }, animation: "fadeIn", delay: 1.5 },
        ],
        keyTakeaway: "Data is any information that can be collected and stored."
      },
      {
        id: "types-of-data",
        duration: 14,
        narration: "There are four main types of data that AI works with. Numerical data includes numbers like age, price, and measurements. Text data includes words, sentences, and documents. Image data includes photos, drawings, and videos. And categorical data includes labels like colors, types, or yes/no answers.",
        visualType: "diagram",
        elements: [
          { type: "text", content: "Types of Data", position: { x: 50, y: 15 }, animation: "fadeIn", delay: 0.2, size: "xl" },
          { type: "icon", content: "🔢", position: { x: 25, y: 32 }, animation: "bounce", delay: 0.4 },
          { type: "text", content: "Numerical", position: { x: 25, y: 42 }, animation: "fadeIn", delay: 0.5, size: "lg" },
          { type: "text", content: "Age, price, score", position: { x: 25, y: 50 }, animation: "fadeIn", delay: 0.6 },
          { type: "icon", content: "📝", position: { x: 75, y: 32 }, animation: "bounce", delay: 0.8 },
          { type: "text", content: "Text", position: { x: 75, y: 42 }, animation: "fadeIn", delay: 0.9, size: "lg" },
          { type: "text", content: "Words, sentences", position: { x: 75, y: 50 }, animation: "fadeIn", delay: 1 },
          { type: "icon", content: "🖼️", position: { x: 25, y: 62 }, animation: "bounce", delay: 1.2 },
          { type: "text", content: "Images", position: { x: 25, y: 72 }, animation: "fadeIn", delay: 1.3, size: "lg" },
          { type: "text", content: "Photos, videos", position: { x: 25, y: 80 }, animation: "fadeIn", delay: 1.4 },
          { type: "icon", content: "🏷️", position: { x: 75, y: 62 }, animation: "bounce", delay: 1.6 },
          { type: "text", content: "Categorical", position: { x: 75, y: 72 }, animation: "fadeIn", delay: 1.7, size: "lg" },
          { type: "text", content: "Labels, types", position: { x: 75, y: 80 }, animation: "fadeIn", delay: 1.8 },
        ],
        keyTakeaway: "The four main data types are: numerical, text, image, and categorical."
      },
      {
        id: "interactive-data-types",
        duration: 10,
        narration: "Let's test your understanding of data types!",
        visualType: "interactive",
        elements: [
          { type: "text", content: "Identify the Data Type", position: { x: 50, y: 25 }, animation: "fadeIn", delay: 0.3, size: "lg" },
          { type: "icon", content: "🎂", position: { x: 50, y: 40 }, animation: "bounce", delay: 0.5, size: "lg" },
        ],
        interaction: {
          type: "choice",
          question: "A person's age (like 12 years old) is what type of data?",
          options: [
            { id: "a", label: "Text data", isCorrect: false },
            { id: "b", label: "Numerical data", isCorrect: true },
            { id: "c", label: "Image data", isCorrect: false },
            { id: "d", label: "Categorical data", isCorrect: false },
          ],
          correctFeedback: "Correct! Age is a number, so it's numerical data. AI can easily compare and calculate with numerical data.",
          incorrectFeedback: "Not quite! Age is measured in numbers (like 12), making it numerical data.",
          hint: "Think about how age is typically expressed..."
        }
      },
      {
        id: "structured-unstructured",
        duration: 12,
        narration: "Data also comes in two forms: structured and unstructured. Structured data is organized neatly in tables - like a spreadsheet with names, ages, and grades. Unstructured data is messy and free-form - like social media posts, images, or videos. Most real-world data is actually unstructured!",
        visualType: "concept",
        elements: [
          { type: "text", content: "Structured Data", position: { x: 25, y: 25 }, animation: "slideRight", delay: 0.3, size: "lg" },
          { type: "icon", content: "📋", position: { x: 25, y: 40 }, animation: "bounce", delay: 0.5, size: "lg" },
          { type: "text", content: "Organized in tables", position: { x: 25, y: 55 }, animation: "fadeIn", delay: 0.7 },
          { type: "text", content: "~20% of data", position: { x: 25, y: 65 }, animation: "fadeIn", delay: 0.9 },
          { type: "text", content: "Unstructured Data", position: { x: 75, y: 25 }, animation: "slideLeft", delay: 0.3, size: "lg" },
          { type: "icon", content: "🌊", position: { x: 75, y: 40 }, animation: "bounce", delay: 0.5, size: "lg" },
          { type: "text", content: "Free-form content", position: { x: 75, y: 55 }, animation: "fadeIn", delay: 0.7 },
          { type: "text", content: "~80% of data!", position: { x: 75, y: 65 }, animation: "fadeIn", delay: 0.9 },
        ],
        keyTakeaway: "80% of real-world data is unstructured - AI helps us make sense of it!"
      },
      {
        id: "data-quality",
        duration: 14,
        narration: "Data quality is crucial for AI! There's a famous saying: 'Garbage in, garbage out.' If you train AI on bad data, you get bad results. Good data is accurate, complete, consistent, and relevant. Bad data has errors, missing values, contradictions, or irrelevant information.",
        visualType: "deep-dive",
        elements: [
          { type: "text", content: "Garbage In → Garbage Out", position: { x: 50, y: 18 }, animation: "fadeIn", delay: 0.3, size: "xl" },
          { type: "text", content: "Good Data ✅", position: { x: 25, y: 35 }, animation: "slideRight", delay: 0.6, size: "lg" },
          { type: "text", content: "• Accurate", position: { x: 25, y: 45 }, animation: "fadeIn", delay: 0.8 },
          { type: "text", content: "• Complete", position: { x: 25, y: 53 }, animation: "fadeIn", delay: 0.9 },
          { type: "text", content: "• Consistent", position: { x: 25, y: 61 }, animation: "fadeIn", delay: 1 },
          { type: "text", content: "• Relevant", position: { x: 25, y: 69 }, animation: "fadeIn", delay: 1.1 },
          { type: "text", content: "Bad Data ❌", position: { x: 75, y: 35 }, animation: "slideLeft", delay: 0.6, size: "lg" },
          { type: "text", content: "• Has errors", position: { x: 75, y: 45 }, animation: "fadeIn", delay: 0.8 },
          { type: "text", content: "• Missing values", position: { x: 75, y: 53 }, animation: "fadeIn", delay: 0.9 },
          { type: "text", content: "• Contradictions", position: { x: 75, y: 61 }, animation: "fadeIn", delay: 1 },
          { type: "text", content: "• Irrelevant info", position: { x: 75, y: 69 }, animation: "fadeIn", delay: 1.1 },
        ],
        keyTakeaway: "AI is only as good as the data it learns from - quality matters!"
      },
      {
        id: "data-bias",
        duration: 14,
        narration: "One of the biggest problems in AI is data bias. If you train an AI to recognize faces but only use photos of one group of people, the AI won't work well for everyone else. This has happened in real life! Biased data leads to unfair AI that can discriminate against certain groups.",
        visualType: "deep-dive",
        elements: [
          { type: "icon", content: "⚠️", position: { x: 50, y: 20 }, animation: "bounce", delay: 0.3, size: "lg" },
          { type: "text", content: "Data Bias Problem", position: { x: 50, y: 33 }, animation: "fadeIn", delay: 0.5, size: "xl" },
          { type: "icon", content: "👤", position: { x: 30, y: 48 }, animation: "bounce", delay: 0.8 },
          { type: "icon", content: "👤", position: { x: 40, y: 48 }, animation: "bounce", delay: 0.9 },
          { type: "icon", content: "👤", position: { x: 50, y: 48 }, animation: "bounce", delay: 1 },
          { type: "text", content: "Limited training data", position: { x: 50, y: 58 }, animation: "fadeIn", delay: 1.2 },
          { type: "text", content: "→ AI fails for underrepresented groups", position: { x: 50, y: 68 }, animation: "slideUp", delay: 1.5 },
        ],
        keyTakeaway: "Biased data creates biased AI - diversity in data is essential for fairness!"
      },
      {
        id: "data-diversity",
        duration: 12,
        narration: "The solution is diverse data! AI needs to see examples from all groups it will serve. If you're building a medical AI, you need data from patients of all ages, backgrounds, and conditions. Diverse data leads to fair, accurate AI that works for everyone.",
        visualType: "concept",
        elements: [
          { type: "text", content: "Diverse Data = Fair AI", position: { x: 50, y: 20 }, animation: "fadeIn", delay: 0.3, size: "xl" },
          { type: "icon", content: "👧", position: { x: 20, y: 42 }, animation: "bounce", delay: 0.5 },
          { type: "icon", content: "👨", position: { x: 32, y: 42 }, animation: "bounce", delay: 0.6 },
          { type: "icon", content: "👵", position: { x: 44, y: 42 }, animation: "bounce", delay: 0.7 },
          { type: "icon", content: "👦", position: { x: 56, y: 42 }, animation: "bounce", delay: 0.8 },
          { type: "icon", content: "👩", position: { x: 68, y: 42 }, animation: "bounce", delay: 0.9 },
          { type: "icon", content: "🧓", position: { x: 80, y: 42 }, animation: "bounce", delay: 1 },
          { type: "text", content: "Include everyone → Works for everyone", position: { x: 50, y: 60 }, animation: "slideUp", delay: 1.3, size: "lg" },
        ],
        keyTakeaway: "Diverse training data ensures AI works fairly for all users."
      },
      {
        id: "interactive-bias",
        duration: 10,
        narration: "Let's think about data bias with a real example.",
        visualType: "interactive",
        elements: [
          { type: "icon", content: "🏥", position: { x: 50, y: 30 }, animation: "bounce", delay: 0.3, size: "lg" },
          { type: "text", content: "Medical AI Scenario", position: { x: 50, y: 45 }, animation: "fadeIn", delay: 0.5 },
        ],
        interaction: {
          type: "choice",
          question: "A skin cancer detection AI was trained only on light-skinned patients. What problem might occur?",
          options: [
            { id: "a", label: "The AI will work perfectly for everyone", isCorrect: false },
            { id: "b", label: "The AI may miss cancers on darker skin tones", isCorrect: true },
            { id: "c", label: "The AI will be faster at diagnosis", isCorrect: false },
          ],
          correctFeedback: "Exactly right! This actually happened in real life. AI trained on limited skin tone data performed poorly on underrepresented groups, showing why diverse data is critical in healthcare AI.",
          incorrectFeedback: "Unfortunately, AI trained on biased data can miss important cases in underrepresented groups.",
          hint: "Think about what the AI has and hasn't seen..."
        }
      },
      {
        id: "data-collection",
        duration: 12,
        narration: "Where does data come from? It can be collected from sensors like cameras and microphones. From user interactions like clicks and purchases. From public records like weather and census data. Or it can be manually labeled by humans. Each source has advantages and challenges!",
        visualType: "diagram",
        elements: [
          { type: "text", content: "Data Sources", position: { x: 50, y: 15 }, animation: "fadeIn", delay: 0.2, size: "xl" },
          { type: "icon", content: "📷", position: { x: 25, y: 32 }, animation: "bounce", delay: 0.4 },
          { type: "text", content: "Sensors", position: { x: 25, y: 44 }, animation: "fadeIn", delay: 0.5 },
          { type: "icon", content: "👆", position: { x: 75, y: 32 }, animation: "bounce", delay: 0.7 },
          { type: "text", content: "User Actions", position: { x: 75, y: 44 }, animation: "fadeIn", delay: 0.8 },
          { type: "icon", content: "📊", position: { x: 25, y: 58 }, animation: "bounce", delay: 1 },
          { type: "text", content: "Public Records", position: { x: 25, y: 70 }, animation: "fadeIn", delay: 1.1 },
          { type: "icon", content: "✏️", position: { x: 75, y: 58 }, animation: "bounce", delay: 1.3 },
          { type: "text", content: "Human Labels", position: { x: 75, y: 70 }, animation: "fadeIn", delay: 1.4 },
        ]
      },
      {
        id: "data-privacy",
        duration: 12,
        narration: "Data privacy is a serious concern! Much of the data AI uses comes from people. Companies must ask permission before collecting personal data. Data should be anonymized when possible. People have the right to know how their data is used. Laws like GDPR protect these rights.",
        visualType: "concept",
        elements: [
          { type: "icon", content: "🔒", position: { x: 50, y: 20 }, animation: "bounce", delay: 0.3, size: "lg" },
          { type: "text", content: "Data Privacy Rights", position: { x: 50, y: 35 }, animation: "fadeIn", delay: 0.5, size: "xl" },
          { type: "text", content: "✓ Permission before collecting", position: { x: 50, y: 50 }, animation: "slideUp", delay: 0.8 },
          { type: "text", content: "✓ Anonymize personal info", position: { x: 50, y: 58 }, animation: "slideUp", delay: 1 },
          { type: "text", content: "✓ Transparency about usage", position: { x: 50, y: 66 }, animation: "slideUp", delay: 1.2 },
          { type: "text", content: "✓ Protected by law (GDPR)", position: { x: 50, y: 74 }, animation: "slideUp", delay: 1.4 },
        ],
        keyTakeaway: "People have rights over their data - privacy must be respected!"
      },
      {
        id: "big-data",
        duration: 12,
        narration: "We live in the age of Big Data! Every day, humans create 2.5 quintillion bytes of data. That's 2.5 followed by 18 zeros! This massive amount of data is what makes modern AI possible. More data means AI can find more patterns and make better predictions.",
        visualType: "real-world",
        elements: [
          { type: "text", content: "Big Data Era", position: { x: 50, y: 18 }, animation: "fadeIn", delay: 0.3, size: "xl" },
          { type: "text", content: "2,500,000,000,000,000,000", position: { x: 50, y: 35 }, animation: "typewriter", delay: 0.6, size: "lg" },
          { type: "text", content: "bytes created EVERY DAY", position: { x: 50, y: 45 }, animation: "fadeIn", delay: 1 },
          { type: "icon", content: "📱", position: { x: 25, y: 62 }, animation: "bounce", delay: 1.3 },
          { type: "icon", content: "💻", position: { x: 40, y: 62 }, animation: "bounce", delay: 1.4 },
          { type: "icon", content: "📷", position: { x: 55, y: 62 }, animation: "bounce", delay: 1.5 },
          { type: "icon", content: "🌐", position: { x: 70, y: 62 }, animation: "bounce", delay: 1.6 },
        ],
        keyTakeaway: "Big Data enables powerful AI - but comes with responsibility!"
      },
      {
        id: "summary",
        duration: 8,
        narration: "Excellent work! You now understand data deeply. You learned about different data types, structured vs unstructured data, why quality matters, the dangers of bias, privacy concerns, and the scale of big data. Data is truly the foundation of AI!",
        visualType: "summary",
        elements: [
          { type: "icon", content: "🎓", position: { x: 50, y: 22 }, animation: "bounce", delay: 0.3, size: "xl" },
          { type: "text", content: "Data Mastery Complete!", position: { x: 50, y: 38 }, animation: "slideUp", delay: 0.5, size: "xl" },
          { type: "text", content: "✅ Data Types & Structures", position: { x: 30, y: 52 }, animation: "fadeIn", delay: 0.8 },
          { type: "text", content: "✅ Quality & Bias", position: { x: 70, y: 52 }, animation: "fadeIn", delay: 1 },
          { type: "text", content: "✅ Privacy & Ethics", position: { x: 30, y: 62 }, animation: "fadeIn", delay: 1.2 },
          { type: "text", content: "✅ Big Data Scale", position: { x: 70, y: 62 }, animation: "fadeIn", delay: 1.4 },
          { type: "text", content: "Ready for Quiz! 📝", position: { x: 50, y: 76 }, animation: "pulse", delay: 1.8 },
        ]
      }
    ],
    quiz: [
      {
        question: "Which of these is an example of numerical data?",
        options: ["A person's name", "A photo of a cat", "Someone's age (12 years)", "The color blue"],
        correctAnswer: 2,
        explanation: "Age is a number that can be counted and calculated, making it numerical data!"
      },
      {
        question: "What does 'Garbage in, garbage out' mean for AI?",
        options: ["AI produces trash", "Bad data leads to bad AI results", "AI can clean up garbage", "Computers need recycling"],
        correctAnswer: 1,
        explanation: "If you train AI with poor quality data, the AI will produce poor quality results!"
      },
      {
        question: "Why is diverse training data important?",
        options: ["It makes training faster", "It helps AI work fairly for all groups", "It uses less storage", "It's not actually important"],
        correctAnswer: 1,
        explanation: "Diverse data ensures AI works well for everyone, not just the groups overrepresented in training!"
      },
      {
        question: "What percentage of real-world data is unstructured?",
        options: ["About 20%", "About 50%", "About 80%", "About 5%"],
        correctAnswer: 2,
        explanation: "Around 80% of real-world data is unstructured - like social media posts, images, and videos!"
      },
      {
        question: "Which is a data privacy right?",
        options: ["Companies can collect any data secretly", "People can know how their data is used", "Data should never be collected", "Privacy doesn't apply to AI"],
        correctAnswer: 1,
        explanation: "People have the right to know how their data is collected, stored, and used by companies and AI systems."
      }
    ]
  },
  // Continue with ai-3 through ai-6...
};

// Export the lesson content for other modules
export function getAILessonContent(lessonId: string): LessonContent | undefined {
  return aiLessonContent[lessonId];
}
