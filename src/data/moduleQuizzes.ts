import type { Question } from "@/components/tracks/ModuleQuiz";

interface ModuleQuizData {
  [lessonId: string]: Question[];
}

export const aiInnovationQuizzes: ModuleQuizData = {
  "ai-1": [
    {
      id: "ai-1-q1",
      question: "What is Artificial Intelligence (AI)?",
      options: [
        "A type of robot that looks like a human",
        "Computer systems designed to perform tasks that typically require human intelligence",
        "A programming language for creating websites",
        "A device for storing large amounts of data"
      ],
      correctAnswer: 1,
      explanation: "AI refers to computer systems that can perform tasks like learning, reasoning, and problem-solving that normally require human intelligence."
    },
    {
      id: "ai-1-q2",
      type: "fill-blank",
      question: "Complete the sentence about AI:",
      blankSentence: "AI stands for Artificial ___.",
      correctAnswer: "Intelligence",
      acceptableAnswers: ["intelligence", "INTELLIGENCE"],
      explanation: "AI stands for Artificial Intelligence — the simulation of human intelligence by machines."
    },
    {
      id: "ai-1-q3",
      question: "What makes AI different from regular computer programs?",
      options: [
        "AI programs are always faster",
        "AI can learn and improve from experience",
        "AI only works on smartphones",
        "AI doesn't need electricity"
      ],
      correctAnswer: 1,
      explanation: "Unlike traditional programs that follow fixed rules, AI systems can learn from data and improve their performance over time."
    },
    {
      id: "ai-1-q4",
      type: "drag-drop",
      question: "Arrange these AI concepts from simplest to most complex:",
      items: ["Deep Learning", "Artificial Intelligence", "Machine Learning"],
      correctOrder: ["Artificial Intelligence", "Machine Learning", "Deep Learning"],
      explanation: "AI is the broadest concept, Machine Learning is a subset of AI, and Deep Learning is a specialized subset of Machine Learning."
    }
  ],
  "ai-2": [
    {
      id: "ai-2-q1",
      question: "What is 'data' in the context of AI?",
      options: [
        "Only numbers and statistics",
        "Information that AI uses to learn and make decisions",
        "Secret codes used by computers",
        "Physical files stored in cabinets"
      ],
      correctAnswer: 1,
      explanation: "Data includes any information (text, images, numbers, sounds) that AI systems use to learn patterns and make predictions."
    },
    {
      id: "ai-2-q2",
      type: "fill-blank",
      question: "Complete the data quality principle:",
      blankSentence: "In AI, the principle 'garbage in, ___ out' means bad data leads to bad results.",
      correctAnswer: "garbage",
      acceptableAnswers: ["Garbage", "GARBAGE"],
      explanation: "The 'garbage in, garbage out' principle means that AI can only be as good as the data it learns from."
    },
    {
      id: "ai-2-q3",
      type: "drag-drop",
      question: "Arrange the data pipeline steps in correct order:",
      items: ["Train the Model", "Clean the Data", "Collect Raw Data", "Evaluate Results"],
      correctOrder: ["Collect Raw Data", "Clean the Data", "Train the Model", "Evaluate Results"],
      explanation: "The data pipeline flows from collection → cleaning → training → evaluation to ensure quality AI outcomes."
    },
    {
      id: "ai-2-q4",
      question: "What is a 'dataset'?",
      options: [
        "A single piece of information",
        "A collection of related data organized together",
        "A type of computer virus",
        "A hardware component"
      ],
      correctAnswer: 1,
      explanation: "A dataset is a structured collection of data that AI uses for training, testing, or making predictions."
    }
  ],
  "ai-3": [
    {
      id: "ai-3-q1",
      question: "What is pattern recognition in AI?",
      options: [
        "Drawing patterns on a screen",
        "AI's ability to identify regularities and trends in data",
        "A type of game",
        "Creating new patterns randomly"
      ],
      correctAnswer: 1,
      explanation: "Pattern recognition is how AI identifies recurring features or trends in data, enabling it to classify, predict, or make decisions."
    },
    {
      id: "ai-3-q2",
      type: "fill-blank",
      question: "Fill in the blank:",
      blankSentence: "Email spam filters use ___ recognition to identify junk mail.",
      correctAnswer: "pattern",
      acceptableAnswers: ["Pattern", "PATTERN"],
      explanation: "Spam filters use pattern recognition to identify characteristics common to spam emails and filter them out."
    },
    {
      id: "ai-3-q3",
      type: "drag-drop",
      question: "Order these pattern recognition steps:",
      items: ["Make Prediction", "Identify Patterns", "Collect Data", "Validate Results"],
      correctOrder: ["Collect Data", "Identify Patterns", "Make Prediction", "Validate Results"],
      explanation: "Pattern recognition follows: data collection → pattern identification → prediction → validation."
    },
    {
      id: "ai-3-q4",
      question: "Which of these uses pattern recognition?",
      options: [
        "Email spam filters identifying junk mail",
        "A light bulb turning on",
        "A simple timer counting down",
        "An electric fan spinning"
      ],
      correctAnswer: 0,
      explanation: "Spam filters use pattern recognition to identify characteristics common to spam emails and filter them out."
    }
  ],
  "ai-4": [
    {
      id: "ai-4-q1",
      question: "What is a chatbot?",
      options: [
        "A robot that can walk and talk",
        "A computer program that simulates conversation with users",
        "A social media platform",
        "A type of smartphone"
      ],
      correctAnswer: 1,
      explanation: "A chatbot is an AI-powered program designed to interact with humans through text or voice, simulating natural conversation."
    },
    {
      id: "ai-4-q2",
      type: "fill-blank",
      question: "Complete the sentence:",
      blankSentence: "___ Language Processing (NLP) helps chatbots understand human language.",
      correctAnswer: "Natural",
      acceptableAnswers: ["natural", "NATURAL"],
      explanation: "Natural Language Processing (NLP) is the AI technology that enables computers to understand and generate human language."
    },
    {
      id: "ai-4-q3",
      question: "What is an 'intent' in chatbot design?",
      options: [
        "The chatbot's personality",
        "The goal or purpose behind a user's message",
        "The chatbot's response speed",
        "The chatbot's visual design"
      ],
      correctAnswer: 1,
      explanation: "Intent refers to what the user is trying to accomplish with their message."
    },
    {
      id: "ai-4-q4",
      type: "drag-drop",
      question: "Arrange the chatbot conversation flow in correct order:",
      items: ["Generate Response", "Identify Intent", "Receive User Input", "Deliver Reply"],
      correctOrder: ["Receive User Input", "Identify Intent", "Generate Response", "Deliver Reply"],
      explanation: "A chatbot first receives input, identifies what the user wants (intent), generates an appropriate response, and delivers it."
    }
  ],
  "ai-5": [
    {
      id: "ai-5-q1",
      question: "What is sentiment analysis?",
      options: [
        "Analyzing the speed of text typing",
        "AI's ability to detect emotions and opinions in text",
        "Counting the number of words in a sentence",
        "Translating text to another language"
      ],
      correctAnswer: 1,
      explanation: "Sentiment analysis uses AI to identify and extract emotions, opinions, and attitudes expressed in text."
    },
    {
      id: "ai-5-q2",
      type: "fill-blank",
      question: "Fill in the blank:",
      blankSentence: "The three typical sentiment categories are positive, negative, and ___.",
      correctAnswer: "neutral",
      acceptableAnswers: ["Neutral", "NEUTRAL"],
      explanation: "Sentiment is typically classified as positive, negative, or neutral."
    },
    {
      id: "ai-5-q3",
      question: "Which business might use sentiment analysis?",
      options: [
        "A company analyzing customer reviews",
        "A bakery counting ingredients",
        "A construction company building houses",
        "A farmer planting crops"
      ],
      correctAnswer: 0,
      explanation: "Companies use sentiment analysis to understand customer opinions from reviews and social media."
    },
    {
      id: "ai-5-q4",
      type: "drag-drop",
      question: "Classify these phrases from most negative to most positive sentiment:",
      items: ["I love this product!", "Worst experience ever.", "It's okay, nothing special."],
      correctOrder: ["Worst experience ever.", "It's okay, nothing special.", "I love this product!"],
      explanation: "Sentiment ranges from negative ('Worst experience') through neutral ('It's okay') to positive ('I love this')."
    }
  ],
  "ai-6": [
    {
      id: "ai-6-q1",
      question: "What is a predictive model?",
      options: [
        "A model that describes past events",
        "An AI system that forecasts future outcomes based on data",
        "A 3D printed object",
        "A fashion model"
      ],
      correctAnswer: 1,
      explanation: "A predictive model uses historical data and AI algorithms to make informed predictions about future events."
    },
    {
      id: "ai-6-q2",
      type: "fill-blank",
      question: "Complete the sentence:",
      blankSentence: "Predictive models use ___ data to forecast future outcomes.",
      correctAnswer: "historical",
      acceptableAnswers: ["Historical", "HISTORICAL", "past", "Past"],
      explanation: "Predictive models analyze historical (past) data to identify patterns and make predictions about the future."
    },
    {
      id: "ai-6-q3",
      question: "Which is an example of predictive AI?",
      options: [
        "A basic calculator",
        "Weather forecasting systems",
        "A digital clock",
        "A simple notepad app"
      ],
      correctAnswer: 1,
      explanation: "Weather forecasting uses predictive AI models that analyze historical weather data to predict future weather."
    },
    {
      id: "ai-6-q4",
      type: "drag-drop",
      question: "Arrange the predictive modeling steps in order:",
      items: ["Make Predictions", "Define the Problem", "Train the Model", "Collect Historical Data"],
      correctOrder: ["Define the Problem", "Collect Historical Data", "Train the Model", "Make Predictions"],
      explanation: "Building a predictive model starts with defining the problem, then collecting data, training the model, and finally making predictions."
    }
  ]
};

export const environmentalInnovationQuizzes: ModuleQuizData = {
  "env-1": [
    {
      id: "env-1-q1",
      question: "What are environmental metrics?",
      options: [
        "Measurements used to assess environmental conditions and impacts",
        "A type of math problem",
        "Weather forecasts only",
        "Pictures of nature"
      ],
      correctAnswer: 0,
      explanation: "Environmental metrics are quantitative measures used to track, analyze, and report on environmental conditions."
    },
    {
      id: "env-1-q2",
      type: "fill-blank",
      question: "Complete the sentence:",
      blankSentence: "A carbon ___ measures the total greenhouse gas emissions caused by a person or organization.",
      correctAnswer: "footprint",
      acceptableAnswers: ["Footprint", "FOOTPRINT"],
      explanation: "Carbon footprint measures the total amount of greenhouse gases produced by human activities."
    },
    {
      id: "env-1-q3",
      question: "Why is environmental data important?",
      options: [
        "It's not important at all",
        "It helps us understand and address environmental issues",
        "Only scientists need it",
        "It's only for decoration"
      ],
      correctAnswer: 1,
      explanation: "Environmental data helps us understand the health of our planet and make informed decisions."
    }
  ],
  "env-2": [
    {
      id: "env-2-q1",
      question: "What are the main categories of waste?",
      options: [
        "Only plastic and paper",
        "Recyclable, compostable, and landfill waste",
        "Big and small waste",
        "Indoor and outdoor waste"
      ],
      correctAnswer: 1,
      explanation: "Waste is typically categorized into recyclables, compostables, and landfill waste."
    },
    {
      id: "env-2-q2",
      type: "drag-drop",
      question: "Arrange these materials by decomposition time (shortest to longest):",
      items: ["Plastic Bottle (450+ years)", "Banana Peel (2-5 weeks)", "Paper (2-6 weeks)", "Glass Bottle (1 million+ years)"],
      correctOrder: ["Banana Peel (2-5 weeks)", "Paper (2-6 weeks)", "Plastic Bottle (450+ years)", "Glass Bottle (1 million+ years)"],
      explanation: "Organic materials decompose fastest, while synthetic materials like plastic and glass take centuries."
    },
    {
      id: "env-2-q3",
      type: "fill-blank",
      question: "Complete the eco principle:",
      blankSentence: "The 3 R's of waste management are Reduce, Reuse, and ___.",
      correctAnswer: "Recycle",
      acceptableAnswers: ["recycle", "RECYCLE"],
      explanation: "Reduce, Reuse, Recycle are the three fundamental principles of waste management."
    }
  ],
  "env-3": [
    {
      id: "env-3-q1",
      question: "What is CO₂?",
      options: ["A type of vitamin", "Carbon dioxide, a greenhouse gas", "A computer code", "A type of battery"],
      correctAnswer: 1,
      explanation: "CO₂ (carbon dioxide) is a greenhouse gas that traps heat in Earth's atmosphere."
    },
    {
      id: "env-3-q2",
      type: "fill-blank",
      question: "Fill in the blank:",
      blankSentence: "Burning ___ fuels like coal, oil, and gas is the largest source of CO₂ emissions.",
      correctAnswer: "fossil",
      acceptableAnswers: ["Fossil", "FOSSIL"],
      explanation: "Burning fossil fuels for electricity, heat, and transportation is the largest source of CO₂ emissions."
    },
    {
      id: "env-3-q3",
      question: "What can individuals do to reduce their carbon footprint?",
      options: [
        "Nothing, it's impossible",
        "Use public transport, conserve energy, reduce waste",
        "Only governments can act",
        "Buy more products"
      ],
      correctAnswer: 1,
      explanation: "Individuals can reduce their carbon footprint through choices like using public transport and saving energy."
    }
  ],
  "env-4": [
    {
      id: "env-4-q1",
      question: "What is data visualization?",
      options: ["Making data invisible", "Presenting data in graphical or visual formats", "Deleting all data", "Writing data in code"],
      correctAnswer: 1,
      explanation: "Data visualization transforms complex data into visual formats like charts and graphs."
    },
    {
      id: "env-4-q2",
      type: "fill-blank",
      question: "Complete the sentence:",
      blankSentence: "A ___ chart is ideal for showing how values change over time.",
      correctAnswer: "line",
      acceptableAnswers: ["Line", "LINE"],
      explanation: "Line charts are ideal for showing how values change over time, making them perfect for tracking trends."
    },
    {
      id: "env-4-q3",
      type: "drag-drop",
      question: "Match the best chart type to use (from simple comparison to complex trends):",
      items: ["Line Chart (trends over time)", "Pie Chart (proportions)", "Bar Chart (comparisons)"],
      correctOrder: ["Pie Chart (proportions)", "Bar Chart (comparisons)", "Line Chart (trends over time)"],
      explanation: "Pie charts show simple proportions, bar charts compare values, and line charts reveal trends over time."
    }
  ],
  "env-5": [
    {
      id: "env-5-q1",
      question: "Why are educational games effective for learning?",
      options: ["They're not effective", "They make learning engaging and memorable", "They only work for adults", "They replace teachers completely"],
      correctAnswer: 1,
      explanation: "Educational games increase engagement, motivation, and retention by making learning interactive."
    },
    {
      id: "env-5-q2",
      type: "fill-blank",
      question: "Fill in the blank:",
      blankSentence: "___ is the application of game elements to non-game contexts to boost engagement.",
      correctAnswer: "Gamification",
      acceptableAnswers: ["gamification", "GAMIFICATION"],
      explanation: "Gamification uses game mechanics like points, badges, and leaderboards in educational contexts."
    },
    {
      id: "env-5-q3",
      question: "What makes a good environmental education game?",
      options: ["Complex rules that no one understands", "Clear goals, engaging mechanics, and accurate information", "No learning objectives", "Only violence and competition"],
      correctAnswer: 1,
      explanation: "Effective educational games balance fun gameplay with clear learning objectives and accurate content."
    }
  ],
  "env-6": [
    {
      id: "env-6-q1",
      question: "What is an environmental dashboard?",
      options: ["A car's control panel", "A visual interface displaying environmental metrics and analytics", "A wooden board", "A type of game"],
      correctAnswer: 1,
      explanation: "An environmental dashboard displays key environmental metrics, trends, and analytics in an organized format."
    },
    {
      id: "env-6-q2",
      type: "drag-drop",
      question: "Arrange the dashboard design process in order:",
      items: ["Build Visualizations", "Test with Users", "Define Key Metrics", "Gather Data Sources"],
      correctOrder: ["Define Key Metrics", "Gather Data Sources", "Build Visualizations", "Test with Users"],
      explanation: "Designing a dashboard starts with defining metrics, gathering data, building visuals, and testing with users."
    },
    {
      id: "env-6-q3",
      question: "Who can benefit from environmental dashboards?",
      options: ["Only large corporations", "Individuals, organizations, governments, and communities", "Only environmental scientists", "No one really uses them"],
      correctAnswer: 1,
      explanation: "Environmental dashboards help everyone from individuals to governments monitor environmental goals."
    }
  ]
};
