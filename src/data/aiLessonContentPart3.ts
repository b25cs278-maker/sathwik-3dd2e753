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

export const aiLessonContentPart3: Record<string, LessonContent> = {
  "ai-5": {
    id: "ai-5",
    title: "Sentiment Analysis",
    videoScenes: [
      {
        id: "intro",
        duration: 8,
        narration: "Words carry emotions! When you read 'I love this!' you feel the happiness. When you read 'This is terrible', you sense the frustration. Today we'll learn how AI can detect these emotions automatically through sentiment analysis!",
        visualType: "intro",
        elements: [
          { type: "icon", content: "😊😐😢", position: { x: 50, y: 25 }, animation: "bounce", delay: 0.5, size: "xl" },
          { type: "text", content: "Sentiment Analysis", position: { x: 50, y: 48 }, animation: "slideUp", delay: 1, size: "xl" },
          { type: "text", content: "Teaching AI to Understand Emotions in Text", position: { x: 50, y: 62 }, animation: "fadeIn", delay: 1.5, size: "md" },
        ]
      },
      {
        id: "what-is-sentiment",
        duration: 12,
        narration: "Sentiment is the emotional tone behind words. Text can be positive - expressing happiness, love, or excitement. It can be negative - expressing anger, sadness, or disappointment. Or it can be neutral - just stating facts without emotion. Sentiment analysis detects these automatically!",
        visualType: "concept",
        elements: [
          { type: "text", content: "Three Sentiment Types", position: { x: 50, y: 15 }, animation: "fadeIn", delay: 0.3, size: "xl" },
          { type: "icon", content: "😊", position: { x: 25, y: 35 }, animation: "bounce", delay: 0.5, size: "xl" },
          { type: "text", content: "Positive", position: { x: 25, y: 52 }, animation: "fadeIn", delay: 0.6, size: "lg" },
          { type: "text", content: "\"I love this!\"", position: { x: 25, y: 62 }, animation: "fadeIn", delay: 0.7 },
          { type: "icon", content: "😐", position: { x: 50, y: 35 }, animation: "bounce", delay: 0.9, size: "xl" },
          { type: "text", content: "Neutral", position: { x: 50, y: 52 }, animation: "fadeIn", delay: 1, size: "lg" },
          { type: "text", content: "\"The meeting is at 3pm\"", position: { x: 50, y: 62 }, animation: "fadeIn", delay: 1.1 },
          { type: "icon", content: "😢", position: { x: 75, y: 35 }, animation: "bounce", delay: 1.3, size: "xl" },
          { type: "text", content: "Negative", position: { x: 75, y: 52 }, animation: "fadeIn", delay: 1.4, size: "lg" },
          { type: "text", content: "\"This is terrible\"", position: { x: 75, y: 62 }, animation: "fadeIn", delay: 1.5 },
        ],
        keyTakeaway: "Sentiment is classified as positive, negative, or neutral."
      },
      {
        id: "how-it-works",
        duration: 14,
        narration: "How does AI detect sentiment? First, it analyzes individual words - 'love', 'hate', 'amazing', 'awful'. Then it considers context - 'not bad' means good! It measures intensity - 'good' vs 'fantastic'. And it even considers emojis and punctuation - multiple exclamation marks often indicate strong emotion!",
        visualType: "deep-dive",
        elements: [
          { type: "text", content: "How AI Detects Sentiment", position: { x: 50, y: 12 }, animation: "fadeIn", delay: 0.2, size: "xl" },
          { type: "text", content: "📝 Word Analysis", position: { x: 25, y: 30 }, animation: "slideRight", delay: 0.4, size: "lg" },
          { type: "text", content: "'love' = positive", position: { x: 25, y: 40 }, animation: "fadeIn", delay: 0.5 },
          { type: "text", content: "🔍 Context Matters", position: { x: 75, y: 30 }, animation: "slideLeft", delay: 0.7, size: "lg" },
          { type: "text", content: "'not bad' = positive!", position: { x: 75, y: 40 }, animation: "fadeIn", delay: 0.8 },
          { type: "text", content: "📊 Intensity Levels", position: { x: 25, y: 55 }, animation: "slideRight", delay: 1, size: "lg" },
          { type: "text", content: "'good' < 'fantastic'", position: { x: 25, y: 65 }, animation: "fadeIn", delay: 1.1 },
          { type: "text", content: "😊❗ Emojis & Punctuation", position: { x: 75, y: 55 }, animation: "slideLeft", delay: 1.3, size: "lg" },
          { type: "text", content: "Add emotional signals", position: { x: 75, y: 65 }, animation: "fadeIn", delay: 1.4 },
        ],
        keyTakeaway: "AI combines word meaning, context, intensity, and symbols to detect emotion."
      },
      {
        id: "interactive-sentiment",
        duration: 10,
        narration: "Let's practice identifying sentiment!",
        visualType: "interactive",
        elements: [
          { type: "text", content: "Detect the Sentiment!", position: { x: 50, y: 25 }, animation: "fadeIn", delay: 0.3, size: "lg" },
          { type: "text", content: "\"The service was okay, nothing special.\"", position: { x: 50, y: 45 }, animation: "slideUp", delay: 0.5, size: "lg" },
        ],
        interaction: {
          type: "choice",
          question: "What is the sentiment of: 'The service was okay, nothing special'?",
          options: [
            { id: "a", label: "Positive - they said 'okay'", isCorrect: false },
            { id: "b", label: "Negative - they're disappointed", isCorrect: false },
            { id: "c", label: "Neutral/Slightly negative - mildly unimpressed", isCorrect: true },
          ],
          correctFeedback: "Good analysis! 'Okay' and 'nothing special' suggest mild disappointment - not strongly negative, but not positive either. This nuanced detection is what makes sentiment analysis challenging!",
          incorrectFeedback: "This is tricky! 'Okay' isn't very enthusiastic, and 'nothing special' shows mild disappointment. It's neutral to slightly negative.",
          hint: "Would you be excited if someone described your work as 'okay, nothing special'?"
        }
      },
      {
        id: "challenges-sarcasm",
        duration: 12,
        narration: "Sarcasm is a huge challenge for sentiment analysis! 'Oh great, another meeting' might sound positive, but it's actually negative. 'This is just what I needed' could be genuine gratitude or frustrated sarcasm. Humans detect sarcasm from tone of voice, but AI only sees text!",
        visualType: "concept",
        elements: [
          { type: "text", content: "The Sarcasm Challenge", position: { x: 50, y: 15 }, animation: "fadeIn", delay: 0.3, size: "xl" },
          { type: "icon", content: "😏", position: { x: 50, y: 32 }, animation: "bounce", delay: 0.5, size: "xl" },
          { type: "text", content: "\"Oh great, another meeting\"", position: { x: 50, y: 48 }, animation: "slideUp", delay: 0.8, size: "lg" },
          { type: "text", content: "Looks positive... but is actually negative!", position: { x: 50, y: 60 }, animation: "fadeIn", delay: 1.1 },
          { type: "text", content: "🤔 AI struggles because it can't hear tone of voice", position: { x: 50, y: 72 }, animation: "fadeIn", delay: 1.4 },
        ],
        keyTakeaway: "Sarcasm is difficult because positive words carry negative meaning."
      },
      {
        id: "challenges-context",
        duration: 12,
        narration: "Slang and context add more complexity! 'This is sick!' usually means 'terrible', but in slang it means 'amazing'! 'I could care less' technically means you care, but people use it to mean the opposite. AI must learn these cultural nuances!",
        visualType: "concept",
        elements: [
          { type: "text", content: "Context & Cultural Nuances", position: { x: 50, y: 15 }, animation: "fadeIn", delay: 0.3, size: "xl" },
          { type: "text", content: "\"This is sick!\"", position: { x: 50, y: 32 }, animation: "slideUp", delay: 0.5, size: "lg" },
          { type: "text", content: "🤒 Literally: something is ill (negative)", position: { x: 30, y: 48 }, animation: "slideRight", delay: 0.8 },
          { type: "text", content: "🤩 Slang: something is amazing (positive)", position: { x: 70, y: 48 }, animation: "slideLeft", delay: 1.1 },
          { type: "text", content: "AI must understand both meanings!", position: { x: 50, y: 65 }, animation: "fadeIn", delay: 1.4 },
        ]
      },
      {
        id: "real-world-uses",
        duration: 14,
        narration: "Sentiment analysis powers many real applications! Companies monitor social media to understand how customers feel about their brand. Review platforms automatically sort positive and negative reviews. Customer service prioritizes angry messages. Mental health apps detect distress signals. And markets analyze news sentiment to predict stock movements!",
        visualType: "real-world",
        elements: [
          { type: "text", content: "Real-World Applications", position: { x: 50, y: 12 }, animation: "fadeIn", delay: 0.2, size: "xl" },
          { type: "icon", content: "📱", position: { x: 20, y: 32 }, animation: "bounce", delay: 0.4 },
          { type: "text", content: "Social Media Monitoring", position: { x: 20, y: 45 }, animation: "fadeIn", delay: 0.5 },
          { type: "icon", content: "⭐", position: { x: 50, y: 32 }, animation: "bounce", delay: 0.7 },
          { type: "text", content: "Review Analysis", position: { x: 50, y: 45 }, animation: "fadeIn", delay: 0.8 },
          { type: "icon", content: "🎧", position: { x: 80, y: 32 }, animation: "bounce", delay: 1 },
          { type: "text", content: "Customer Service", position: { x: 80, y: 45 }, animation: "fadeIn", delay: 1.1 },
          { type: "icon", content: "💚", position: { x: 35, y: 58 }, animation: "bounce", delay: 1.3 },
          { type: "text", content: "Mental Health", position: { x: 35, y: 71 }, animation: "fadeIn", delay: 1.4 },
          { type: "icon", content: "📈", position: { x: 65, y: 58 }, animation: "bounce", delay: 1.6 },
          { type: "text", content: "Market Analysis", position: { x: 65, y: 71 }, animation: "fadeIn", delay: 1.7 },
        ]
      },
      {
        id: "interactive-applications",
        duration: 10,
        narration: "Let's explore how different industries use sentiment analysis!",
        visualType: "interactive",
        elements: [
          { type: "text", content: "Industry Applications", position: { x: 50, y: 25 }, animation: "fadeIn", delay: 0.3, size: "lg" },
        ],
        interaction: {
          type: "click-reveal",
          question: "Click each industry to see how they use sentiment analysis:",
          options: [
            { id: "retail", label: "🛒 Retail: Analyzes product reviews to improve items and identify issues quickly" },
            { id: "politics", label: "🗳️ Politics: Measures public opinion on policies and candidates from social media" },
            { id: "entertainment", label: "🎬 Entertainment: Gauges audience reactions to movies, shows, and games" },
            { id: "healthcare", label: "🏥 Healthcare: Monitors patient feedback and detects depression indicators" },
          ],
          correctFeedback: "Sentiment analysis has applications across virtually every industry!",
        }
      },
      {
        id: "sentiment-scores",
        duration: 12,
        narration: "Advanced sentiment analysis goes beyond just positive or negative. It can score intensity on a scale - from -1 (very negative) to +1 (very positive). It can detect specific emotions like joy, anger, fear, or sadness. And it can track sentiment changes over time!",
        visualType: "diagram",
        elements: [
          { type: "text", content: "Advanced Sentiment Scoring", position: { x: 50, y: 15 }, animation: "fadeIn", delay: 0.3, size: "xl" },
          { type: "text", content: "-1.0 ────────── 0 ────────── +1.0", position: { x: 50, y: 32 }, animation: "slideUp", delay: 0.5, size: "lg" },
          { type: "text", content: "Very Negative ← → Very Positive", position: { x: 50, y: 42 }, animation: "fadeIn", delay: 0.8 },
          { type: "text", content: "Specific Emotions:", position: { x: 50, y: 55 }, animation: "fadeIn", delay: 1.1 },
          { type: "text", content: "😊 Joy  😠 Anger  😨 Fear  😢 Sadness  😲 Surprise", position: { x: 50, y: 68 }, animation: "slideUp", delay: 1.4 },
        ],
        keyTakeaway: "Modern sentiment analysis detects intensity levels and specific emotions."
      },
      {
        id: "aspect-based",
        duration: 12,
        narration: "The most sophisticated approach is aspect-based sentiment analysis. A restaurant review might say 'Great food but terrible service!' - overall it's mixed, but the food is positive and service is negative. AI can separate these different aspects and rate each one individually!",
        visualType: "deep-dive",
        elements: [
          { type: "text", content: "Aspect-Based Sentiment", position: { x: 50, y: 15 }, animation: "fadeIn", delay: 0.3, size: "xl" },
          { type: "text", content: "\"Great food but terrible service!\"", position: { x: 50, y: 32 }, animation: "slideUp", delay: 0.5, size: "lg" },
          { type: "icon", content: "🍔", position: { x: 30, y: 50 }, animation: "bounce", delay: 0.8 },
          { type: "text", content: "Food: 😊 +0.8", position: { x: 30, y: 62 }, animation: "fadeIn", delay: 0.9 },
          { type: "icon", content: "🛎️", position: { x: 70, y: 50 }, animation: "bounce", delay: 1.1 },
          { type: "text", content: "Service: 😢 -0.9", position: { x: 70, y: 62 }, animation: "fadeIn", delay: 1.2 },
          { type: "text", content: "Different aspects, different sentiments!", position: { x: 50, y: 78 }, animation: "fadeIn", delay: 1.5 },
        ],
        keyTakeaway: "Aspect-based analysis rates different parts of a review separately."
      },
      {
        id: "ethics-privacy",
        duration: 12,
        narration: "Sentiment analysis raises ethical questions. Should companies monitor employee emotions? Could insurance companies change rates based on your social media sentiment? Is it okay to analyze private messages? These powerful tools require responsible use and clear boundaries!",
        visualType: "concept",
        elements: [
          { type: "icon", content: "⚖️", position: { x: 50, y: 20 }, animation: "bounce", delay: 0.3, size: "lg" },
          { type: "text", content: "Ethical Considerations", position: { x: 50, y: 35 }, animation: "fadeIn", delay: 0.5, size: "xl" },
          { type: "text", content: "🤔 Should employers monitor employee sentiment?", position: { x: 50, y: 50 }, animation: "slideUp", delay: 0.8 },
          { type: "text", content: "🔒 Is it okay to analyze private messages?", position: { x: 50, y: 60 }, animation: "slideUp", delay: 1.1 },
          { type: "text", content: "⚠️ Could this be used for discrimination?", position: { x: 50, y: 70 }, animation: "slideUp", delay: 1.4 },
        ],
        keyTakeaway: "Sentiment analysis power requires ethical guidelines and privacy protections."
      },
      {
        id: "summary",
        duration: 8,
        narration: "Excellent work! You've mastered sentiment analysis. You understand how AI detects emotions in text, the challenges of sarcasm and slang, real-world applications, advanced scoring techniques, and ethical considerations. You can now think critically about this powerful technology!",
        visualType: "summary",
        elements: [
          { type: "icon", content: "🎯", position: { x: 50, y: 22 }, animation: "bounce", delay: 0.3, size: "xl" },
          { type: "text", content: "Sentiment Analysis Master!", position: { x: 50, y: 38 }, animation: "slideUp", delay: 0.5, size: "xl" },
          { type: "text", content: "✅ Detecting emotions in text", position: { x: 35, y: 52 }, animation: "fadeIn", delay: 0.8 },
          { type: "text", content: "✅ Challenges & limitations", position: { x: 65, y: 52 }, animation: "fadeIn", delay: 1 },
          { type: "text", content: "✅ Real applications", position: { x: 35, y: 62 }, animation: "fadeIn", delay: 1.2 },
          { type: "text", content: "✅ Ethical considerations", position: { x: 65, y: 62 }, animation: "fadeIn", delay: 1.4 },
          { type: "text", content: "Quiz Time! 📝", position: { x: 50, y: 76 }, animation: "pulse", delay: 1.8 },
        ]
      }
    ],
    quiz: [
      {
        question: "Why is sarcasm difficult for sentiment analysis?",
        options: ["Sarcastic text is too long", "Positive words are used to express negative feelings", "Sarcasm only exists in speech", "AI can easily detect sarcasm"],
        correctAnswer: 1,
        explanation: "Sarcasm uses positive-sounding words ('Oh great...') to express negative feelings, confusing AI that looks at word meaning!"
      },
      {
        question: "What is aspect-based sentiment analysis?",
        options: ["Analyzing text length", "Rating different parts of a review separately", "Only looking at emojis", "Counting positive words"],
        correctAnswer: 1,
        explanation: "Aspect-based analysis identifies different aspects (like food vs service) and rates each separately!"
      },
      {
        question: "Which company would benefit from sentiment analysis?",
        options: ["Only tech companies", "Any company wanting to understand customer opinions", "Only social media platforms", "Sentiment analysis has no business use"],
        correctAnswer: 1,
        explanation: "Almost any organization can benefit from understanding how people feel about their products, services, or brand!"
      },
      {
        question: "What does a sentiment score of -0.9 indicate?",
        options: ["Very positive", "Neutral", "Very negative", "Error"],
        correctAnswer: 2,
        explanation: "On a scale from -1 to +1, -0.9 indicates very negative sentiment - strong negative emotion!"
      },
      {
        question: "Why should we consider ethics in sentiment analysis?",
        options: ["Ethics don't matter for AI", "It could be used to violate privacy or discriminate", "To make AI faster", "Ethics only apply to healthcare"],
        correctAnswer: 1,
        explanation: "Sentiment analysis is powerful and could be misused for surveillance or discrimination - ethical guidelines protect people!"
      }
    ]
  },
  "ai-6": {
    id: "ai-6",
    title: "Predictive Models",
    videoScenes: [
      {
        id: "intro",
        duration: 8,
        narration: "Can AI predict the future? Not exactly - but it can make incredibly informed guesses! From weather forecasts to recommendation systems, predictive models use patterns from the past to forecast what might happen next. Let's explore this fascinating capability!",
        visualType: "intro",
        elements: [
          { type: "icon", content: "🔮", position: { x: 50, y: 25 }, animation: "bounce", delay: 0.5, size: "xl" },
          { type: "text", content: "Predictive Models", position: { x: 50, y: 48 }, animation: "slideUp", delay: 1, size: "xl" },
          { type: "text", content: "Using Past Patterns to Forecast the Future", position: { x: 50, y: 62 }, animation: "fadeIn", delay: 1.5, size: "md" },
        ]
      },
      {
        id: "what-is-prediction",
        duration: 12,
        narration: "A prediction is an educated guess about what will happen based on available information. If it rained the last three Tuesdays, you might predict rain next Tuesday. Predictive models do this at massive scale - analyzing millions of data points to find patterns humans could never spot!",
        visualType: "concept",
        elements: [
          { type: "text", content: "Prediction = Educated Guess", position: { x: 50, y: 15 }, animation: "fadeIn", delay: 0.3, size: "xl" },
          { type: "icon", content: "📊", position: { x: 25, y: 38 }, animation: "bounce", delay: 0.5, size: "lg" },
          { type: "text", content: "Past Data", position: { x: 25, y: 52 }, animation: "fadeIn", delay: 0.6 },
          { type: "icon", content: "➡️", position: { x: 50, y: 38 }, animation: "fadeIn", delay: 0.8, size: "lg" },
          { type: "text", content: "Find Patterns", position: { x: 50, y: 52 }, animation: "fadeIn", delay: 0.9 },
          { type: "icon", content: "🎯", position: { x: 75, y: 38 }, animation: "bounce", delay: 1.1, size: "lg" },
          { type: "text", content: "Predict Future", position: { x: 75, y: 52 }, animation: "fadeIn", delay: 1.2 },
        ],
        keyTakeaway: "Predictions use past patterns to make informed guesses about the future."
      },
      {
        id: "types-of-prediction",
        duration: 14,
        narration: "There are different types of predictions. Classification predicts categories - will this email be spam or not spam? Regression predicts numbers - what will the temperature be tomorrow? Time series predicts sequences - how will stock prices change over the next month? Each type solves different problems!",
        visualType: "diagram",
        elements: [
          { type: "text", content: "Types of Predictive Models", position: { x: 50, y: 12 }, animation: "fadeIn", delay: 0.2, size: "xl" },
          { type: "icon", content: "📁", position: { x: 25, y: 32 }, animation: "bounce", delay: 0.4 },
          { type: "text", content: "Classification", position: { x: 25, y: 45 }, animation: "fadeIn", delay: 0.5, size: "lg" },
          { type: "text", content: "Predicts categories", position: { x: 25, y: 55 }, animation: "fadeIn", delay: 0.6 },
          { type: "text", content: "Spam or not?", position: { x: 25, y: 65 }, animation: "fadeIn", delay: 0.7 },
          { type: "icon", content: "📈", position: { x: 50, y: 32 }, animation: "bounce", delay: 0.9 },
          { type: "text", content: "Regression", position: { x: 50, y: 45 }, animation: "fadeIn", delay: 1, size: "lg" },
          { type: "text", content: "Predicts numbers", position: { x: 50, y: 55 }, animation: "fadeIn", delay: 1.1 },
          { type: "text", content: "Price = $150?", position: { x: 50, y: 65 }, animation: "fadeIn", delay: 1.2 },
          { type: "icon", content: "📉", position: { x: 75, y: 32 }, animation: "bounce", delay: 1.4 },
          { type: "text", content: "Time Series", position: { x: 75, y: 45 }, animation: "fadeIn", delay: 1.5, size: "lg" },
          { type: "text", content: "Predicts sequences", position: { x: 75, y: 55 }, animation: "fadeIn", delay: 1.6 },
          { type: "text", content: "Next 30 days?", position: { x: 75, y: 65 }, animation: "fadeIn", delay: 1.7 },
        ],
        keyTakeaway: "Classification, regression, and time series solve different prediction problems."
      },
      {
        id: "building-models",
        duration: 14,
        narration: "Building a predictive model follows a clear process. First, collect historical data - the more the better! Then clean and prepare the data, removing errors. Next, split data into training and testing sets. Train the model on training data. Test accuracy with testing data. Finally, deploy and monitor the model in the real world!",
        visualType: "deep-dive",
        elements: [
          { type: "text", content: "Building a Predictive Model", position: { x: 50, y: 10 }, animation: "fadeIn", delay: 0.2, size: "xl" },
          { type: "text", content: "1️⃣ Collect Data", position: { x: 25, y: 28 }, animation: "slideRight", delay: 0.4 },
          { type: "text", content: "2️⃣ Clean & Prepare", position: { x: 75, y: 28 }, animation: "slideLeft", delay: 0.6 },
          { type: "text", content: "3️⃣ Split Train/Test", position: { x: 25, y: 45 }, animation: "slideRight", delay: 0.8 },
          { type: "text", content: "4️⃣ Train Model", position: { x: 75, y: 45 }, animation: "slideLeft", delay: 1 },
          { type: "text", content: "5️⃣ Test Accuracy", position: { x: 25, y: 62 }, animation: "slideRight", delay: 1.2 },
          { type: "text", content: "6️⃣ Deploy & Monitor", position: { x: 75, y: 62 }, animation: "slideLeft", delay: 1.4 },
        ],
        keyTakeaway: "Building models requires collecting, preparing, training, testing, and monitoring."
      },
      {
        id: "interactive-process",
        duration: 10,
        narration: "Let's test your understanding of the model building process!",
        visualType: "interactive",
        elements: [
          { type: "text", content: "Model Building Quiz", position: { x: 50, y: 30 }, animation: "fadeIn", delay: 0.3, size: "lg" },
        ],
        interaction: {
          type: "choice",
          question: "Why do we split data into training and testing sets?",
          options: [
            { id: "a", label: "To make the model run faster", isCorrect: false },
            { id: "b", label: "To check if the model works on data it hasn't seen before", isCorrect: true },
            { id: "c", label: "Because we don't need all the data", isCorrect: false },
            { id: "d", label: "To make storage easier", isCorrect: false },
          ],
          correctFeedback: "Exactly! Testing data is 'unseen' by the model, so if it performs well on test data, it will likely work in the real world too!",
          incorrectFeedback: "We split data to verify the model works on new, unseen examples - not just the ones it was trained on!",
          hint: "What's the point of testing?"
        }
      },
      {
        id: "real-examples",
        duration: 14,
        narration: "Predictive models are everywhere! Netflix predicts what shows you'll enjoy. Weather apps predict rain and temperature. Banks predict if a loan will be repaid. Doctors use them to predict disease risk. Stores predict what products to stock. Self-driving cars predict what other cars will do!",
        visualType: "real-world",
        elements: [
          { type: "text", content: "Predictions All Around Us", position: { x: 50, y: 10 }, animation: "fadeIn", delay: 0.2, size: "xl" },
          { type: "icon", content: "📺", position: { x: 20, y: 30 }, animation: "bounce", delay: 0.4 },
          { type: "text", content: "Show recommendations", position: { x: 20, y: 43 }, animation: "fadeIn", delay: 0.5 },
          { type: "icon", content: "🌤️", position: { x: 50, y: 30 }, animation: "bounce", delay: 0.7 },
          { type: "text", content: "Weather forecasts", position: { x: 50, y: 43 }, animation: "fadeIn", delay: 0.8 },
          { type: "icon", content: "🏦", position: { x: 80, y: 30 }, animation: "bounce", delay: 1 },
          { type: "text", content: "Loan decisions", position: { x: 80, y: 43 }, animation: "fadeIn", delay: 1.1 },
          { type: "icon", content: "🏥", position: { x: 35, y: 55 }, animation: "bounce", delay: 1.3 },
          { type: "text", content: "Disease risk", position: { x: 35, y: 68 }, animation: "fadeIn", delay: 1.4 },
          { type: "icon", content: "🚗", position: { x: 65, y: 55 }, animation: "bounce", delay: 1.6 },
          { type: "text", content: "Self-driving cars", position: { x: 65, y: 68 }, animation: "fadeIn", delay: 1.7 },
        ]
      },
      {
        id: "accuracy-metrics",
        duration: 12,
        narration: "How do we know if predictions are good? We use accuracy metrics! Accuracy measures the percentage of correct predictions. Precision measures how many positive predictions were actually correct. Recall measures how many actual positives we caught. Different applications prioritize different metrics!",
        visualType: "concept",
        elements: [
          { type: "text", content: "Measuring Prediction Quality", position: { x: 50, y: 15 }, animation: "fadeIn", delay: 0.3, size: "xl" },
          { type: "text", content: "📊 Accuracy", position: { x: 25, y: 35 }, animation: "slideRight", delay: 0.5, size: "lg" },
          { type: "text", content: "% of all correct predictions", position: { x: 25, y: 47 }, animation: "fadeIn", delay: 0.6 },
          { type: "text", content: "🎯 Precision", position: { x: 50, y: 35 }, animation: "slideUp", delay: 0.8, size: "lg" },
          { type: "text", content: "When we say YES, are we right?", position: { x: 50, y: 47 }, animation: "fadeIn", delay: 0.9 },
          { type: "text", content: "🔍 Recall", position: { x: 75, y: 35 }, animation: "slideLeft", delay: 1.1, size: "lg" },
          { type: "text", content: "Did we find all the YESes?", position: { x: 75, y: 47 }, animation: "fadeIn", delay: 1.2 },
          { type: "text", content: "Medical: High recall crucial (don't miss diseases!)", position: { x: 50, y: 65 }, animation: "fadeIn", delay: 1.5 },
        ],
        keyTakeaway: "Different metrics matter for different applications - there's no one-size-fits-all!"
      },
      {
        id: "limitations",
        duration: 14,
        narration: "Predictions aren't magic - they have real limitations! Past patterns might not continue - think of the pandemic disrupting all predictions. Rare events are hard to predict because there's little data. Black swan events are nearly impossible. And predictions are probabilities, not certainties - even a 90% chance means 10% chance of being wrong!",
        visualType: "deep-dive",
        elements: [
          { type: "text", content: "⚠️ Prediction Limitations", position: { x: 50, y: 12 }, animation: "fadeIn", delay: 0.2, size: "xl" },
          { type: "text", content: "📅 Past ≠ Future", position: { x: 25, y: 32 }, animation: "slideRight", delay: 0.4 },
          { type: "text", content: "Patterns can change!", position: { x: 25, y: 44 }, animation: "fadeIn", delay: 0.5 },
          { type: "text", content: "🦢 Black Swan Events", position: { x: 75, y: 32 }, animation: "slideLeft", delay: 0.7 },
          { type: "text", content: "Rare, unpredictable events", position: { x: 75, y: 44 }, animation: "fadeIn", delay: 0.8 },
          { type: "text", content: "📊 Probability ≠ Certainty", position: { x: 25, y: 58 }, animation: "slideRight", delay: 1 },
          { type: "text", content: "90% right = 10% wrong!", position: { x: 25, y: 70 }, animation: "fadeIn", delay: 1.1 },
          { type: "text", content: "🔄 Need Continuous Updates", position: { x: 75, y: 58 }, animation: "slideLeft", delay: 1.3 },
          { type: "text", content: "Models must adapt", position: { x: 75, y: 70 }, animation: "fadeIn", delay: 1.4 },
        ],
        keyTakeaway: "Predictions are educated guesses with limitations - not guaranteed futures!"
      },
      {
        id: "interactive-limitations",
        duration: 10,
        narration: "Let's think about prediction limitations in a real scenario!",
        visualType: "interactive",
        elements: [
          { type: "icon", content: "✈️", position: { x: 50, y: 30 }, animation: "bounce", delay: 0.3, size: "lg" },
          { type: "text", content: "Airline Scenario", position: { x: 50, y: 48 }, animation: "fadeIn", delay: 0.5 },
        ],
        interaction: {
          type: "choice",
          question: "An AI predicts 95% of flights will be on time tomorrow. A volcano erupts that night. What happens?",
          options: [
            { id: "a", label: "The prediction stays accurate", isCorrect: false },
            { id: "b", label: "The prediction becomes useless because of the unexpected event", isCorrect: true },
            { id: "c", label: "AI should have predicted the volcano", isCorrect: false },
          ],
          correctFeedback: "Exactly! This is a 'black swan event' - rare and unpredictable. The AI's model was trained on normal conditions and can't account for volcanic eruptions!",
          incorrectFeedback: "Unexpected events like volcanic eruptions can make even excellent predictions completely wrong!",
          hint: "Can AI predict things that have never happened in its training data?"
        }
      },
      {
        id: "bias-in-predictions",
        duration: 12,
        narration: "Predictions can also be biased! If historical hiring data favored certain groups, a hiring prediction AI will continue that bias. If loan data shows discrimination, the model learns discrimination. This is why fairness and bias detection are critical parts of building responsible predictive systems!",
        visualType: "concept",
        elements: [
          { type: "icon", content: "⚖️", position: { x: 50, y: 18 }, animation: "bounce", delay: 0.3, size: "lg" },
          { type: "text", content: "Bias in Predictions", position: { x: 50, y: 32 }, animation: "fadeIn", delay: 0.5, size: "xl" },
          { type: "text", content: "Biased historical data", position: { x: 30, y: 48 }, animation: "slideRight", delay: 0.8 },
          { type: "icon", content: "→", position: { x: 50, y: 48 }, animation: "fadeIn", delay: 1 },
          { type: "text", content: "Biased predictions", position: { x: 70, y: 48 }, animation: "slideLeft", delay: 1.2 },
          { type: "text", content: "Solution: Bias detection & fairness testing", position: { x: 50, y: 65 }, animation: "slideUp", delay: 1.5 },
        ],
        keyTakeaway: "Predictions can inherit bias from historical data - testing for fairness is essential!"
      },
      {
        id: "explainability",
        duration: 12,
        narration: "Another challenge is explainability. Sometimes AI predictions are 'black boxes' - we know the answer but not why. If a bank denies your loan, you deserve to know why! Explainable AI helps us understand the reasons behind predictions, building trust and enabling oversight.",
        visualType: "concept",
        elements: [
          { type: "text", content: "Explainability Challenge", position: { x: 50, y: 15 }, animation: "fadeIn", delay: 0.3, size: "xl" },
          { type: "icon", content: "📦", position: { x: 30, y: 38 }, animation: "bounce", delay: 0.5, size: "lg" },
          { type: "text", content: "Black Box", position: { x: 30, y: 52 }, animation: "fadeIn", delay: 0.6 },
          { type: "text", content: "Answer: No loan", position: { x: 30, y: 62 }, animation: "fadeIn", delay: 0.7 },
          { type: "text", content: "Why? 🤷", position: { x: 30, y: 72 }, animation: "fadeIn", delay: 0.8 },
          { type: "icon", content: "🔍", position: { x: 70, y: 38 }, animation: "bounce", delay: 1, size: "lg" },
          { type: "text", content: "Explainable AI", position: { x: 70, y: 52 }, animation: "fadeIn", delay: 1.1 },
          { type: "text", content: "Answer: No loan", position: { x: 70, y: 62 }, animation: "fadeIn", delay: 1.2 },
          { type: "text", content: "Why: Income too low", position: { x: 70, y: 72 }, animation: "fadeIn", delay: 1.3 },
        ],
        keyTakeaway: "Explainable AI shows why predictions are made - crucial for trust and accountability."
      },
      {
        id: "future-of-prediction",
        duration: 10,
        narration: "The future of prediction is exciting! AI will predict diseases before symptoms appear. It will forecast climate patterns decades ahead. It will personalize education by predicting what each student needs. And it will help cities predict and prevent problems before they occur!",
        visualType: "concept",
        elements: [
          { type: "icon", content: "🚀", position: { x: 50, y: 18 }, animation: "bounce", delay: 0.3, size: "xl" },
          { type: "text", content: "The Future of Prediction", position: { x: 50, y: 32 }, animation: "fadeIn", delay: 0.5, size: "xl" },
          { type: "text", content: "🏥 Early disease detection", position: { x: 30, y: 48 }, animation: "slideRight", delay: 0.8 },
          { type: "text", content: "🌍 Climate forecasting", position: { x: 70, y: 48 }, animation: "slideLeft", delay: 1 },
          { type: "text", content: "📚 Personalized learning", position: { x: 30, y: 62 }, animation: "slideRight", delay: 1.2 },
          { type: "text", content: "🏙️ Smart cities", position: { x: 70, y: 62 }, animation: "slideLeft", delay: 1.4 },
        ]
      },
      {
        id: "summary",
        duration: 8,
        narration: "Congratulations! You've completed the entire AI Innovation track! You now understand predictive models - how they're built, where they're used, their limitations, and ethical considerations. You're equipped to think critically about AI predictions in your everyday life!",
        visualType: "summary",
        elements: [
          { type: "icon", content: "🏆", position: { x: 50, y: 20 }, animation: "bounce", delay: 0.3, size: "xl" },
          { type: "text", content: "AI Innovation Complete!", position: { x: 50, y: 36 }, animation: "slideUp", delay: 0.5, size: "xl" },
          { type: "text", content: "✅ How predictions work", position: { x: 30, y: 50 }, animation: "fadeIn", delay: 0.8 },
          { type: "text", content: "✅ Building models", position: { x: 70, y: 50 }, animation: "fadeIn", delay: 1 },
          { type: "text", content: "✅ Real-world applications", position: { x: 30, y: 60 }, animation: "fadeIn", delay: 1.2 },
          { type: "text", content: "✅ Limitations & ethics", position: { x: 70, y: 60 }, animation: "fadeIn", delay: 1.4 },
          { type: "text", content: "Final Quiz! 📝", position: { x: 50, y: 76 }, animation: "pulse", delay: 1.8 },
        ]
      }
    ],
    quiz: [
      {
        question: "What's the difference between classification and regression?",
        options: ["No difference", "Classification predicts categories, regression predicts numbers", "Classification is faster", "Regression is more accurate"],
        correctAnswer: 1,
        explanation: "Classification predicts categories (spam/not spam), while regression predicts continuous numbers (price, temperature)!"
      },
      {
        question: "Why do we test predictions on 'unseen' data?",
        options: ["To save storage", "To verify the model works on new examples, not just memorized ones", "Testing isn't important", "To make the model slower"],
        correctAnswer: 1,
        explanation: "Testing on unseen data ensures the model can generalize to new situations, not just memorize training examples!"
      },
      {
        question: "What is a 'black swan event'?",
        options: ["A rare, unpredictable event that predictions can't forecast", "A type of machine learning", "A common daily occurrence", "A prediction algorithm"],
        correctAnswer: 0,
        explanation: "Black swan events are rare, unpredictable occurrences (like volcanic eruptions) that disrupt all normal predictions!"
      },
      {
        question: "Why is explainability important in predictions?",
        options: ["It's not important", "It makes AI faster", "People deserve to know why decisions are made about them", "It reduces accuracy"],
        correctAnswer: 2,
        explanation: "Explainability builds trust and accountability - if AI denies you a loan, you should understand why!"
      },
      {
        question: "Can predictive AI inherit bias?",
        options: ["No, AI is always fair", "Yes, if trained on biased historical data", "Only in certain countries", "Bias doesn't exist in AI"],
        correctAnswer: 1,
        explanation: "AI learns from historical data - if that data contains bias, the AI will perpetuate it. Fairness testing is essential!"
      }
    ]
  }
};

export function getAILessonContentPart3(lessonId: string): LessonContent | undefined {
  return aiLessonContentPart3[lessonId];
}
