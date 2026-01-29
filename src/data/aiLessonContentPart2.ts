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

export const aiLessonContentPart2: Record<string, LessonContent> = {
  "ai-3": {
    id: "ai-3",
    title: "Pattern Recognition",
    videoScenes: [
      {
        id: "intro",
        duration: 8,
        narration: "Patterns are everywhere - in nature, music, language, and data! Today we'll explore how AI becomes a master at finding patterns that even humans might miss. This superpower is what makes AI so useful!",
        visualType: "intro",
        elements: [
          { type: "icon", content: "🔍", position: { x: 50, y: 25 }, animation: "bounce", delay: 0.5, size: "xl" },
          { type: "text", content: "Pattern Recognition", position: { x: 50, y: 48 }, animation: "slideUp", delay: 1, size: "xl" },
          { type: "text", content: "AI's Superpower for Finding Hidden Connections", position: { x: 50, y: 62 }, animation: "fadeIn", delay: 1.5, size: "md" },
        ]
      },
      {
        id: "what-are-patterns",
        duration: 12,
        narration: "A pattern is anything that repeats or follows a predictable rule. In nature, zebra stripes follow patterns. In music, rhythms repeat in patterns. In numbers, sequences like 2, 4, 6, 8 follow patterns. In language, grammar follows patterns. AI excels at finding these!",
        visualType: "concept",
        elements: [
          { type: "text", content: "Patterns = Predictable Repetition", position: { x: 50, y: 18 }, animation: "fadeIn", delay: 0.3, size: "xl" },
          { type: "icon", content: "🦓", position: { x: 20, y: 38 }, animation: "bounce", delay: 0.5 },
          { type: "text", content: "Nature", position: { x: 20, y: 50 }, animation: "fadeIn", delay: 0.6 },
          { type: "icon", content: "🎵", position: { x: 40, y: 38 }, animation: "bounce", delay: 0.8 },
          { type: "text", content: "Music", position: { x: 40, y: 50 }, animation: "fadeIn", delay: 0.9 },
          { type: "icon", content: "🔢", position: { x: 60, y: 38 }, animation: "bounce", delay: 1.1 },
          { type: "text", content: "Numbers", position: { x: 60, y: 50 }, animation: "fadeIn", delay: 1.2 },
          { type: "icon", content: "📝", position: { x: 80, y: 38 }, animation: "bounce", delay: 1.4 },
          { type: "text", content: "Language", position: { x: 80, y: 50 }, animation: "fadeIn", delay: 1.5 },
        ],
        keyTakeaway: "Patterns are predictable rules or repetitions that AI can learn to recognize."
      },
      {
        id: "how-ai-sees",
        duration: 14,
        narration: "When AI looks at an image, it doesn't see a cat - it sees millions of tiny colored dots called pixels. It learns to recognize patterns in these pixels: edges form shapes, shapes form features like ears and eyes, and features combine to form 'cat'. Each layer of understanding builds on the last!",
        visualType: "deep-dive",
        elements: [
          { type: "text", content: "How AI 'Sees' Images", position: { x: 50, y: 15 }, animation: "fadeIn", delay: 0.3, size: "xl" },
          { type: "text", content: "⬜⬜⬜ → Pixels", position: { x: 25, y: 35 }, animation: "slideRight", delay: 0.5 },
          { type: "text", content: "📐 → Edges", position: { x: 50, y: 35 }, animation: "slideUp", delay: 0.8 },
          { type: "text", content: "◯ → Shapes", position: { x: 75, y: 35 }, animation: "slideLeft", delay: 1.1 },
          { type: "text", content: "👁️ → Features", position: { x: 35, y: 55 }, animation: "slideRight", delay: 1.4 },
          { type: "icon", content: "🐱", position: { x: 65, y: 55 }, animation: "bounce", delay: 1.7, size: "lg" },
          { type: "text", content: "= Object!", position: { x: 78, y: 55 }, animation: "fadeIn", delay: 1.9 },
        ],
        keyTakeaway: "AI builds understanding layer by layer: pixels → edges → shapes → features → objects."
      },
      {
        id: "interactive-pattern",
        duration: 10,
        narration: "Let's see if you can spot the pattern like an AI would!",
        visualType: "interactive",
        elements: [
          { type: "text", content: "Find the Pattern!", position: { x: 50, y: 25 }, animation: "fadeIn", delay: 0.3, size: "lg" },
          { type: "text", content: "2, 4, 8, 16, ?", position: { x: 50, y: 40 }, animation: "fadeIn", delay: 0.5, size: "xl" },
        ],
        interaction: {
          type: "choice",
          question: "What comes next in the pattern: 2, 4, 8, 16, ?",
          options: [
            { id: "a", label: "18 (adding 2)", isCorrect: false },
            { id: "b", label: "24 (adding 8)", isCorrect: false },
            { id: "c", label: "32 (doubling)", isCorrect: true },
            { id: "d", label: "20 (adding 4)", isCorrect: false },
          ],
          correctFeedback: "Excellent pattern recognition! Each number doubles: 2×2=4, 4×2=8, 8×2=16, 16×2=32. AI finds patterns exactly like this!",
          incorrectFeedback: "Look more closely! Each number is exactly double the previous one.",
          hint: "Compare each number to the one before it..."
        }
      },
      {
        id: "face-recognition",
        duration: 14,
        narration: "Face recognition is an amazing example of pattern finding! AI learns that all faces have common patterns: two eyes positioned side by side, a nose in the center below the eyes, and a mouth below the nose. It also learns to recognize unique patterns that make each face different - like face shape, eye color, and distance between features.",
        visualType: "concept",
        elements: [
          { type: "text", content: "Face Recognition Patterns", position: { x: 50, y: 15 }, animation: "fadeIn", delay: 0.3, size: "xl" },
          { type: "icon", content: "👤", position: { x: 50, y: 35 }, animation: "bounce", delay: 0.5, size: "xl" },
          { type: "text", content: "Universal: Eye position, nose location, mouth placement", position: { x: 50, y: 55 }, animation: "slideUp", delay: 0.8 },
          { type: "text", content: "Unique: Face shape, distances, proportions", position: { x: 50, y: 65 }, animation: "slideUp", delay: 1.2 },
        ],
        keyTakeaway: "AI learns both common patterns (all faces) and unique patterns (your specific face)."
      },
      {
        id: "spam-detection",
        duration: 12,
        narration: "Spam filters use pattern recognition too! They learn that spam emails often contain words like 'FREE', 'WINNER', or 'URGENT'. They notice patterns like excessive exclamation marks, suspicious links, and unusual sender addresses. By combining many small patterns, AI can accurately identify spam!",
        visualType: "real-world",
        elements: [
          { type: "icon", content: "📧", position: { x: 50, y: 20 }, animation: "bounce", delay: 0.3, size: "lg" },
          { type: "text", content: "Spam Detection Patterns", position: { x: 50, y: 35 }, animation: "fadeIn", delay: 0.5, size: "xl" },
          { type: "text", content: "🚩 'FREE!' 'WINNER!' 'URGENT!'", position: { x: 50, y: 48 }, animation: "slideUp", delay: 0.8 },
          { type: "text", content: "🚩 Suspicious links", position: { x: 40, y: 58 }, animation: "slideUp", delay: 1.1 },
          { type: "text", content: "🚩 Unknown senders", position: { x: 60, y: 58 }, animation: "slideUp", delay: 1.4 },
          { type: "text", content: "= Many patterns combined = Spam detected!", position: { x: 50, y: 72 }, animation: "fadeIn", delay: 1.7 },
        ]
      },
      {
        id: "language-patterns",
        duration: 14,
        narration: "Language is full of patterns! AI learns that 'the' is usually followed by a noun or adjective. It learns that questions often start with words like 'what', 'why', or 'how'. It learns that sentences have subjects and verbs. These patterns help AI understand and generate human language!",
        visualType: "deep-dive",
        elements: [
          { type: "text", content: "Language Pattern Examples", position: { x: 50, y: 15 }, animation: "fadeIn", delay: 0.3, size: "xl" },
          { type: "text", content: "The ___ jumped.", position: { x: 50, y: 32 }, animation: "slideUp", delay: 0.6, size: "lg" },
          { type: "text", content: "AI knows: noun goes here!", position: { x: 50, y: 42 }, animation: "fadeIn", delay: 0.9 },
          { type: "text", content: "'Why is the sky ___?'", position: { x: 50, y: 55 }, animation: "slideUp", delay: 1.2, size: "lg" },
          { type: "text", content: "AI knows: adjective expected!", position: { x: 50, y: 65 }, animation: "fadeIn", delay: 1.5 },
        ],
        keyTakeaway: "AI learns grammar and word patterns to understand and generate language."
      },
      {
        id: "music-patterns",
        duration: 12,
        narration: "Music is mathematical! AI can analyze songs and find patterns in rhythm, melody, and chord progressions. It notices that pop songs often use similar chord patterns. It can predict what note comes next, compose new music, and even identify genres just from audio patterns!",
        visualType: "concept",
        elements: [
          { type: "icon", content: "🎵", position: { x: 50, y: 20 }, animation: "bounce", delay: 0.3, size: "xl" },
          { type: "text", content: "Music = Mathematical Patterns", position: { x: 50, y: 38 }, animation: "fadeIn", delay: 0.5, size: "xl" },
          { type: "text", content: "🥁 Rhythm patterns", position: { x: 30, y: 52 }, animation: "slideRight", delay: 0.8 },
          { type: "text", content: "🎹 Chord progressions", position: { x: 70, y: 52 }, animation: "slideLeft", delay: 1.1 },
          { type: "text", content: "🎤 Melody sequences", position: { x: 30, y: 64 }, animation: "slideRight", delay: 1.4 },
          { type: "text", content: "🎧 Genre signatures", position: { x: 70, y: 64 }, animation: "slideLeft", delay: 1.7 },
        ]
      },
      {
        id: "interactive-applications",
        duration: 10,
        narration: "Click to discover how pattern recognition powers different AI applications!",
        visualType: "interactive",
        elements: [
          { type: "text", content: "Explore AI Applications", position: { x: 50, y: 25 }, animation: "fadeIn", delay: 0.3, size: "lg" },
        ],
        interaction: {
          type: "click-reveal",
          question: "Click each card to see how pattern recognition is used:",
          options: [
            { id: "medical", label: "🏥 Medical: Spots tumors in X-rays by finding unusual tissue patterns" },
            { id: "finance", label: "💰 Finance: Detects fraud by finding suspicious transaction patterns" },
            { id: "weather", label: "🌤️ Weather: Predicts storms by finding atmospheric patterns" },
            { id: "social", label: "📱 Social: Recommends content by finding preference patterns" },
          ],
          correctFeedback: "Pattern recognition is the foundation of countless AI applications!",
        }
      },
      {
        id: "clustering",
        duration: 12,
        narration: "One powerful technique is clustering - grouping similar things together. AI can look at millions of customer purchases and automatically group customers with similar tastes. This happens without human guidance - AI finds the natural patterns in the data!",
        visualType: "concept",
        elements: [
          { type: "text", content: "Clustering: Grouping by Similarity", position: { x: 50, y: 18 }, animation: "fadeIn", delay: 0.3, size: "xl" },
          { type: "icon", content: "🔴", position: { x: 25, y: 38 }, animation: "bounce", delay: 0.5 },
          { type: "icon", content: "🔴", position: { x: 30, y: 42 }, animation: "bounce", delay: 0.6 },
          { type: "icon", content: "🔴", position: { x: 27, y: 48 }, animation: "bounce", delay: 0.7 },
          { type: "icon", content: "🔵", position: { x: 50, y: 35 }, animation: "bounce", delay: 0.9 },
          { type: "icon", content: "🔵", position: { x: 55, y: 40 }, animation: "bounce", delay: 1 },
          { type: "icon", content: "🔵", position: { x: 52, y: 48 }, animation: "bounce", delay: 1.1 },
          { type: "icon", content: "🟢", position: { x: 75, y: 38 }, animation: "bounce", delay: 1.3 },
          { type: "icon", content: "🟢", position: { x: 78, y: 45 }, animation: "bounce", delay: 1.4 },
          { type: "icon", content: "🟢", position: { x: 72, y: 50 }, animation: "bounce", delay: 1.5 },
          { type: "text", content: "AI finds natural groups automatically!", position: { x: 50, y: 68 }, animation: "slideUp", delay: 1.8 },
        ],
        keyTakeaway: "Clustering lets AI discover natural groupings without being told what to look for."
      },
      {
        id: "anomaly-detection",
        duration: 12,
        narration: "Sometimes the most important thing is finding what DOESN'T fit the pattern! This is called anomaly detection. Credit card companies use this - if you always shop locally, but suddenly there's a purchase from another country, AI flags it as unusual. It learned your normal patterns!",
        visualType: "deep-dive",
        elements: [
          { type: "text", content: "Anomaly Detection", position: { x: 50, y: 15 }, animation: "fadeIn", delay: 0.3, size: "xl" },
          { type: "text", content: "Finding What Doesn't Fit", position: { x: 50, y: 28 }, animation: "fadeIn", delay: 0.5 },
          { type: "icon", content: "✓", position: { x: 25, y: 48 }, animation: "bounce", delay: 0.7, color: "text-green-500" },
          { type: "icon", content: "✓", position: { x: 38, y: 48 }, animation: "bounce", delay: 0.8, color: "text-green-500" },
          { type: "icon", content: "✓", position: { x: 51, y: 48 }, animation: "bounce", delay: 0.9, color: "text-green-500" },
          { type: "icon", content: "⚠️", position: { x: 65, y: 45 }, animation: "bounce", delay: 1.1, size: "lg" },
          { type: "icon", content: "✓", position: { x: 78, y: 48 }, animation: "bounce", delay: 1.2, color: "text-green-500" },
          { type: "text", content: "Normal, Normal, Normal, UNUSUAL!, Normal", position: { x: 50, y: 62 }, animation: "fadeIn", delay: 1.5 },
        ],
        keyTakeaway: "Anomaly detection finds unusual events by learning what's 'normal'."
      },
      {
        id: "limitations",
        duration: 10,
        narration: "Pattern recognition has limits! AI can find correlations that aren't real causes - just because two things happen together doesn't mean one causes the other. AI might miss rare patterns it hasn't seen enough of. And some patterns are just coincidence!",
        visualType: "concept",
        elements: [
          { type: "text", content: "⚠️ Pattern Pitfalls", position: { x: 50, y: 18 }, animation: "fadeIn", delay: 0.3, size: "xl" },
          { type: "text", content: "Correlation ≠ Causation", position: { x: 50, y: 35 }, animation: "slideUp", delay: 0.6, size: "lg" },
          { type: "text", content: "Ice cream sales and shark attacks both increase in summer...", position: { x: 50, y: 48 }, animation: "fadeIn", delay: 0.9 },
          { type: "text", content: "...but ice cream doesn't cause shark attacks!", position: { x: 50, y: 58 }, animation: "fadeIn", delay: 1.2 },
          { type: "text", content: "(Hot weather causes both!)", position: { x: 50, y: 68 }, animation: "fadeIn", delay: 1.5 },
        ],
        keyTakeaway: "Just because AI finds a pattern doesn't mean it's meaningful - always think critically!"
      },
      {
        id: "summary",
        duration: 8,
        narration: "Outstanding work! You've mastered pattern recognition - AI's fundamental superpower. You learned how AI finds patterns in images, text, numbers, and more. You explored real applications from face recognition to fraud detection. Now you understand both the power and limitations of pattern finding!",
        visualType: "summary",
        elements: [
          { type: "icon", content: "🦸", position: { x: 50, y: 22 }, animation: "bounce", delay: 0.3, size: "xl" },
          { type: "text", content: "Pattern Master!", position: { x: 50, y: 38 }, animation: "slideUp", delay: 0.5, size: "xl" },
          { type: "text", content: "✅ What patterns are", position: { x: 30, y: 52 }, animation: "fadeIn", delay: 0.8 },
          { type: "text", content: "✅ How AI finds them", position: { x: 70, y: 52 }, animation: "fadeIn", delay: 1 },
          { type: "text", content: "✅ Real applications", position: { x: 30, y: 62 }, animation: "fadeIn", delay: 1.2 },
          { type: "text", content: "✅ Limitations", position: { x: 70, y: 62 }, animation: "fadeIn", delay: 1.4 },
          { type: "text", content: "Quiz Time! 📝", position: { x: 50, y: 76 }, animation: "pulse", delay: 1.8 },
        ]
      }
    ],
    quiz: [
      {
        question: "How does AI 'see' an image?",
        options: ["It sees it like humans do", "It reads the file name", "It analyzes millions of tiny pixels", "It asks a human to describe it"],
        correctAnswer: 2,
        explanation: "AI breaks down images into pixels and learns patterns from how these pixels are arranged!"
      },
      {
        question: "What is anomaly detection?",
        options: ["Finding common patterns", "Finding things that don't fit the normal pattern", "Making random guesses", "Deleting bad data"],
        correctAnswer: 1,
        explanation: "Anomaly detection identifies unusual events by learning what 'normal' looks like!"
      },
      {
        question: "Why is 'correlation ≠ causation' important?",
        options: ["It's a math formula", "Just because two things happen together doesn't mean one causes the other", "AI never makes mistakes", "Patterns are always meaningful"],
        correctAnswer: 1,
        explanation: "AI can find patterns that look connected but aren't actually related - we must think critically!"
      },
      {
        question: "Which uses pattern recognition?",
        options: ["Only face recognition", "Only spam filters", "Many AI applications including medical, finance, and more", "None of the above"],
        correctAnswer: 2,
        explanation: "Pattern recognition is fundamental to countless AI applications across all industries!"
      },
      {
        question: "What is clustering?",
        options: ["Making AI faster", "Automatically grouping similar things together", "Deleting duplicate data", "A programming language"],
        correctAnswer: 1,
        explanation: "Clustering allows AI to find natural groups in data without human guidance!"
      }
    ]
  },
  "ai-4": {
    id: "ai-4",
    title: "Building a Chatbot",
    videoScenes: [
      {
        id: "intro",
        duration: 8,
        narration: "Have you ever talked to Siri, Alexa, or ChatGPT? These are all chatbots! Today we'll dive deep into how chatbots work, the technology behind them, and even think about designing one ourselves!",
        visualType: "intro",
        elements: [
          { type: "icon", content: "💬", position: { x: 50, y: 25 }, animation: "bounce", delay: 0.5, size: "xl" },
          { type: "text", content: "Building a Chatbot", position: { x: 50, y: 48 }, animation: "slideUp", delay: 1, size: "xl" },
          { type: "text", content: "Understanding Conversational AI", position: { x: 50, y: 62 }, animation: "fadeIn", delay: 1.5, size: "md" },
        ]
      },
      {
        id: "what-is-chatbot",
        duration: 12,
        narration: "A chatbot is an AI program that can have conversations with humans. Unlike simple programs that follow exact scripts, modern chatbots can understand natural language, handle variations in how people speak, and even learn from conversations!",
        visualType: "concept",
        elements: [
          { type: "icon", content: "🤖", position: { x: 30, y: 35 }, animation: "bounce", delay: 0.3, size: "lg" },
          { type: "icon", content: "↔️", position: { x: 50, y: 35 }, animation: "fadeIn", delay: 0.6, size: "lg" },
          { type: "icon", content: "👤", position: { x: 70, y: 35 }, animation: "bounce", delay: 0.9, size: "lg" },
          { type: "text", content: "Natural conversation between AI and humans", position: { x: 50, y: 55 }, animation: "slideUp", delay: 1.2, size: "lg" },
        ],
        keyTakeaway: "Chatbots understand and respond to human language naturally."
      },
      {
        id: "types-of-chatbots",
        duration: 14,
        narration: "There are different types of chatbots. Rule-based bots follow scripted responses - like phone menu systems. Retrieval-based bots pick answers from a database of prepared responses. And generative bots, like ChatGPT, create entirely new responses by understanding language deeply!",
        visualType: "diagram",
        elements: [
          { type: "text", content: "Types of Chatbots", position: { x: 50, y: 12 }, animation: "fadeIn", delay: 0.2, size: "xl" },
          { type: "icon", content: "📋", position: { x: 20, y: 35 }, animation: "bounce", delay: 0.4 },
          { type: "text", content: "Rule-Based", position: { x: 20, y: 48 }, animation: "fadeIn", delay: 0.5, size: "lg" },
          { type: "text", content: "Follows scripts", position: { x: 20, y: 58 }, animation: "fadeIn", delay: 0.6 },
          { type: "icon", content: "📚", position: { x: 50, y: 35 }, animation: "bounce", delay: 0.8 },
          { type: "text", content: "Retrieval-Based", position: { x: 50, y: 48 }, animation: "fadeIn", delay: 0.9, size: "lg" },
          { type: "text", content: "Picks from database", position: { x: 50, y: 58 }, animation: "fadeIn", delay: 1 },
          { type: "icon", content: "✨", position: { x: 80, y: 35 }, animation: "bounce", delay: 1.2 },
          { type: "text", content: "Generative", position: { x: 80, y: 48 }, animation: "fadeIn", delay: 1.3, size: "lg" },
          { type: "text", content: "Creates new responses", position: { x: 80, y: 58 }, animation: "fadeIn", delay: 1.4 },
        ],
        keyTakeaway: "Generative AI creates new, unique responses rather than following scripts."
      },
      {
        id: "how-chatbots-work",
        duration: 14,
        narration: "Let's break down how a chatbot processes your message. First, it receives your input. Then it tokenizes - breaking your message into pieces. Next comes intent recognition - figuring out what you want. Then entity extraction - identifying important details. Finally, it generates and delivers a response!",
        visualType: "deep-dive",
        elements: [
          { type: "text", content: "Chatbot Processing Pipeline", position: { x: 50, y: 12 }, animation: "fadeIn", delay: 0.2, size: "xl" },
          { type: "text", content: "1️⃣ Receive Input", position: { x: 25, y: 30 }, animation: "slideRight", delay: 0.4 },
          { type: "text", content: "2️⃣ Tokenize", position: { x: 75, y: 30 }, animation: "slideLeft", delay: 0.6 },
          { type: "text", content: "3️⃣ Intent Recognition", position: { x: 25, y: 48 }, animation: "slideRight", delay: 0.8 },
          { type: "text", content: "4️⃣ Entity Extraction", position: { x: 75, y: 48 }, animation: "slideLeft", delay: 1 },
          { type: "text", content: "5️⃣ Generate Response", position: { x: 50, y: 65 }, animation: "slideUp", delay: 1.2, size: "lg" },
        ],
        keyTakeaway: "Chatbots process messages through multiple steps to understand and respond."
      },
      {
        id: "intent-example",
        duration: 12,
        narration: "Let's see intent recognition in action! If you say 'What's the weather today?', the chatbot recognizes the intent is 'get weather'. If you say 'Tell me if I need an umbrella', it's the SAME intent - just expressed differently. Good chatbots understand many ways of saying the same thing!",
        visualType: "example",
        elements: [
          { type: "text", content: "Intent Recognition Example", position: { x: 50, y: 15 }, animation: "fadeIn", delay: 0.3, size: "xl" },
          { type: "text", content: "\"What's the weather?\"", position: { x: 30, y: 35 }, animation: "slideRight", delay: 0.6 },
          { type: "text", content: "\"Do I need an umbrella?\"", position: { x: 70, y: 35 }, animation: "slideLeft", delay: 0.9 },
          { type: "text", content: "\"Is it going to rain?\"", position: { x: 30, y: 50 }, animation: "slideRight", delay: 1.2 },
          { type: "text", content: "\"What should I wear?\"", position: { x: 70, y: 50 }, animation: "slideLeft", delay: 1.5 },
          { type: "icon", content: "⬇️", position: { x: 50, y: 62 }, animation: "bounce", delay: 1.8 },
          { type: "text", content: "Same Intent: GET_WEATHER 🌤️", position: { x: 50, y: 75 }, animation: "pulse", delay: 2.1, size: "lg" },
        ]
      },
      {
        id: "interactive-intent",
        duration: 10,
        narration: "Can you identify the intent like a chatbot would?",
        visualType: "interactive",
        elements: [
          { type: "text", content: "Be the Chatbot!", position: { x: 50, y: 25 }, animation: "fadeIn", delay: 0.3, size: "lg" },
          { type: "text", content: "\"Set an alarm for 7 AM tomorrow\"", position: { x: 50, y: 45 }, animation: "slideUp", delay: 0.5, size: "lg" },
        ],
        interaction: {
          type: "choice",
          question: "What is the intent of: 'Set an alarm for 7 AM tomorrow'?",
          options: [
            { id: "a", label: "GET_WEATHER - asking about weather", isCorrect: false },
            { id: "b", label: "SET_ALARM - wants to create an alarm", isCorrect: true },
            { id: "c", label: "SEND_MESSAGE - wants to message someone", isCorrect: false },
            { id: "d", label: "PLAY_MUSIC - wants to hear music", isCorrect: false },
          ],
          correctFeedback: "Perfect! You identified the intent correctly. The user wants to SET_ALARM. The entities would be: time='7 AM' and date='tomorrow'.",
          incorrectFeedback: "The user wants to set an alarm - that's the SET_ALARM intent!",
          hint: "What action is the user asking for?"
        }
      },
      {
        id: "entities",
        duration: 12,
        narration: "Entity extraction finds the specific details in your message. In 'Book a table for 4 at 7pm at Pizza Palace', the entities are: number='4', time='7pm', and restaurant='Pizza Palace'. These details are needed to complete the task!",
        visualType: "diagram",
        elements: [
          { type: "text", content: "Entity Extraction", position: { x: 50, y: 15 }, animation: "fadeIn", delay: 0.3, size: "xl" },
          { type: "text", content: "\"Book a table for 4 at 7pm at Pizza Palace\"", position: { x: 50, y: 32 }, animation: "slideUp", delay: 0.6, size: "lg" },
          { type: "text", content: "📊 Number: 4", position: { x: 25, y: 52 }, animation: "bounce", delay: 0.9 },
          { type: "text", content: "⏰ Time: 7pm", position: { x: 50, y: 52 }, animation: "bounce", delay: 1.2 },
          { type: "text", content: "🍕 Place: Pizza Palace", position: { x: 75, y: 52 }, animation: "bounce", delay: 1.5 },
          { type: "text", content: "Intent: BOOK_RESERVATION", position: { x: 50, y: 70 }, animation: "fadeIn", delay: 1.8, size: "lg" },
        ],
        keyTakeaway: "Entities are the specific details (who, what, when, where) extracted from messages."
      },
      {
        id: "context-memory",
        duration: 14,
        narration: "Great chatbots remember context! If you ask 'What's the weather in Paris?' and then 'What about tomorrow?', the chatbot remembers you're still talking about Paris. This context tracking makes conversations feel natural instead of robotic!",
        visualType: "concept",
        elements: [
          { type: "text", content: "Context & Memory", position: { x: 50, y: 15 }, animation: "fadeIn", delay: 0.3, size: "xl" },
          { type: "icon", content: "👤", position: { x: 20, y: 35 }, animation: "fadeIn", delay: 0.5 },
          { type: "text", content: "Weather in Paris?", position: { x: 40, y: 35 }, animation: "slideRight", delay: 0.6 },
          { type: "icon", content: "🤖", position: { x: 80, y: 35 }, animation: "fadeIn", delay: 0.8 },
          { type: "text", content: "It's 22°C and sunny!", position: { x: 60, y: 45 }, animation: "slideLeft", delay: 0.9 },
          { type: "icon", content: "👤", position: { x: 20, y: 58 }, animation: "fadeIn", delay: 1.1 },
          { type: "text", content: "What about tomorrow?", position: { x: 40, y: 58 }, animation: "slideRight", delay: 1.2 },
          { type: "icon", content: "🤖", position: { x: 80, y: 58 }, animation: "fadeIn", delay: 1.4 },
          { type: "text", content: "Paris will be 24°C!", position: { x: 60, y: 68 }, animation: "slideLeft", delay: 1.5 },
          { type: "text", content: "Bot remembers: Location = Paris 📍", position: { x: 50, y: 82 }, animation: "pulse", delay: 1.8 },
        ],
        keyTakeaway: "Context memory allows chatbots to have natural, flowing conversations."
      },
      {
        id: "nlp-technology",
        duration: 12,
        narration: "Behind chatbots is Natural Language Processing or NLP. This technology helps computers understand human language with all its complexity - sarcasm, slang, typos, and different accents. NLP bridges the gap between how humans speak and how computers process information!",
        visualType: "deep-dive",
        elements: [
          { type: "text", content: "Natural Language Processing (NLP)", position: { x: 50, y: 15 }, animation: "fadeIn", delay: 0.3, size: "xl" },
          { type: "text", content: "Human Language → AI Understanding", position: { x: 50, y: 30 }, animation: "slideUp", delay: 0.6, size: "lg" },
          { type: "text", content: "😏 Sarcasm", position: { x: 20, y: 48 }, animation: "bounce", delay: 0.9 },
          { type: "text", content: "🗣️ Slang", position: { x: 40, y: 48 }, animation: "bounce", delay: 1.1 },
          { type: "text", content: "✏️ Typos", position: { x: 60, y: 48 }, animation: "bounce", delay: 1.3 },
          { type: "text", content: "🌍 Accents", position: { x: 80, y: 48 }, animation: "bounce", delay: 1.5 },
          { type: "text", content: "NLP handles all these challenges!", position: { x: 50, y: 65 }, animation: "fadeIn", delay: 1.8 },
        ]
      },
      {
        id: "large-language-models",
        duration: 14,
        narration: "The most advanced chatbots use Large Language Models or LLMs - like GPT. These models are trained on billions of words from the internet. They learn language patterns so well that they can generate human-like responses, write stories, explain concepts, and even code!",
        visualType: "concept",
        elements: [
          { type: "text", content: "Large Language Models (LLMs)", position: { x: 50, y: 15 }, animation: "fadeIn", delay: 0.3, size: "xl" },
          { type: "icon", content: "📚", position: { x: 25, y: 35 }, animation: "bounce", delay: 0.5 },
          { type: "icon", content: "📚", position: { x: 35, y: 35 }, animation: "bounce", delay: 0.6 },
          { type: "icon", content: "📚", position: { x: 45, y: 35 }, animation: "bounce", delay: 0.7 },
          { type: "text", content: "Billions of words", position: { x: 35, y: 48 }, animation: "fadeIn", delay: 0.9 },
          { type: "icon", content: "➡️", position: { x: 55, y: 35 }, animation: "fadeIn", delay: 1.1 },
          { type: "icon", content: "🧠", position: { x: 70, y: 35 }, animation: "bounce", delay: 1.3, size: "lg" },
          { type: "text", content: "Deep understanding", position: { x: 70, y: 48 }, animation: "fadeIn", delay: 1.5 },
          { type: "text", content: "Result: Human-like conversation!", position: { x: 50, y: 65 }, animation: "pulse", delay: 1.8, size: "lg" },
        ],
        keyTakeaway: "LLMs like GPT are trained on billions of words to understand and generate language."
      },
      {
        id: "chatbot-design",
        duration: 12,
        narration: "Designing a good chatbot requires thinking about users. What problems will it solve? What questions will people ask? How should it respond to confusion? Should it have a personality? Good chatbot design focuses on being helpful, clear, and knowing when to escalate to a human!",
        visualType: "hands-on",
        elements: [
          { type: "text", content: "Chatbot Design Principles", position: { x: 50, y: 15 }, animation: "fadeIn", delay: 0.3, size: "xl" },
          { type: "text", content: "🎯 Clear purpose", position: { x: 30, y: 35 }, animation: "slideRight", delay: 0.5 },
          { type: "text", content: "💬 Natural responses", position: { x: 70, y: 35 }, animation: "slideLeft", delay: 0.7 },
          { type: "text", content: "❓ Handle confusion", position: { x: 30, y: 52 }, animation: "slideRight", delay: 0.9 },
          { type: "text", content: "😊 Appropriate personality", position: { x: 70, y: 52 }, animation: "slideLeft", delay: 1.1 },
          { type: "text", content: "👋 Know when to get human help", position: { x: 50, y: 68 }, animation: "slideUp", delay: 1.3 },
        ]
      },
      {
        id: "interactive-design",
        duration: 10,
        narration: "Let's think about chatbot design together!",
        visualType: "interactive",
        elements: [
          { type: "icon", content: "🏥", position: { x: 50, y: 30 }, animation: "bounce", delay: 0.3, size: "lg" },
          { type: "text", content: "Hospital Chatbot Scenario", position: { x: 50, y: 48 }, animation: "fadeIn", delay: 0.5 },
        ],
        interaction: {
          type: "choice",
          question: "A hospital chatbot receives: 'I'm having chest pain and trouble breathing'. What should it do?",
          options: [
            { id: "a", label: "Answer with general health tips", isCorrect: false },
            { id: "b", label: "Immediately recommend calling emergency services or seeing a doctor", isCorrect: true },
            { id: "c", label: "Ask more questions about their symptoms", isCorrect: false },
            { id: "d", label: "Schedule a non-urgent appointment", isCorrect: false },
          ],
          correctFeedback: "Exactly right! A well-designed healthcare chatbot should recognize emergencies and immediately direct users to appropriate help. Safety comes first!",
          incorrectFeedback: "For potential emergencies like chest pain, the chatbot should immediately recommend getting medical help!",
          hint: "This sounds like it could be serious - what's the safest response?"
        }
      },
      {
        id: "summary",
        duration: 8,
        narration: "Fantastic work! You now understand how chatbots work from the inside. You learned about intent recognition, entity extraction, context memory, NLP, and Large Language Models. You even thought about chatbot design! You're ready to understand any chatbot you interact with!",
        visualType: "summary",
        elements: [
          { type: "icon", content: "🤖", position: { x: 50, y: 22 }, animation: "bounce", delay: 0.3, size: "xl" },
          { type: "text", content: "Chatbot Expert!", position: { x: 50, y: 38 }, animation: "slideUp", delay: 0.5, size: "xl" },
          { type: "text", content: "✅ How chatbots process language", position: { x: 35, y: 52 }, animation: "fadeIn", delay: 0.8 },
          { type: "text", content: "✅ Intent & entity extraction", position: { x: 65, y: 52 }, animation: "fadeIn", delay: 1 },
          { type: "text", content: "✅ LLMs & NLP technology", position: { x: 35, y: 62 }, animation: "fadeIn", delay: 1.2 },
          { type: "text", content: "✅ Design principles", position: { x: 65, y: 62 }, animation: "fadeIn", delay: 1.4 },
          { type: "text", content: "Quiz Time! 📝", position: { x: 50, y: 76 }, animation: "pulse", delay: 1.8 },
        ]
      }
    ],
    quiz: [
      {
        question: "What is 'intent recognition' in chatbots?",
        options: ["Recognizing faces", "Figuring out what the user wants to do", "Playing music", "Checking spelling"],
        correctAnswer: 1,
        explanation: "Intent recognition identifies what the user is trying to accomplish - like 'get weather' or 'set alarm'!"
      },
      {
        question: "In 'Book a flight to Tokyo for Friday', what are the entities?",
        options: ["Just 'book'", "Destination='Tokyo' and Date='Friday'", "There are no entities", "Only the word 'flight'"],
        correctAnswer: 1,
        explanation: "Entities are the specific details: destination (Tokyo) and date (Friday)!"
      },
      {
        question: "Why is context memory important for chatbots?",
        options: ["It makes them faster", "It lets them remember earlier parts of the conversation", "It's not actually important", "It saves battery"],
        correctAnswer: 1,
        explanation: "Context memory lets chatbots have natural conversations by remembering what was discussed!"
      },
      {
        question: "What are Large Language Models (LLMs)?",
        options: ["Very big dictionaries", "AI trained on billions of words to understand language", "Types of chatbot hardware", "Chat room software"],
        correctAnswer: 1,
        explanation: "LLMs like GPT are trained on massive amounts of text to deeply understand language!"
      },
      {
        question: "What should a well-designed healthcare chatbot do for emergencies?",
        options: ["Ignore them", "Schedule regular appointments", "Immediately direct users to get help", "Provide general health tips"],
        correctAnswer: 2,
        explanation: "Safety first! Good chatbots recognize emergencies and direct users to appropriate help immediately."
      }
    ]
  }
};

export function getAILessonContentPart2(lessonId: string): LessonContent | undefined {
  return aiLessonContentPart2[lessonId];
}
