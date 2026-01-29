interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

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
      question: "Which of the following is an example of AI in everyday life?",
      options: [
        "A calculator performing basic math",
        "Voice assistants like Siri or Alexa",
        "A light switch turning on/off",
        "A printed book"
      ],
      correctAnswer: 1,
      explanation: "Voice assistants use AI to understand and respond to natural language, making decisions based on your requests."
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
      question: "Why is having good quality data important for AI?",
      options: [
        "It makes the AI look prettier",
        "AI can make better and more accurate decisions with good data",
        "It's not important at all",
        "It only matters for gaming AI"
      ],
      correctAnswer: 1,
      explanation: "The quality of data directly affects AI performance - garbage in, garbage out. Better data leads to more accurate and reliable AI systems."
    },
    {
      id: "ai-2-q3",
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
      question: "How does an AI learn to recognize patterns?",
      options: [
        "By being programmed with every possible pattern",
        "By analyzing many examples and finding similarities",
        "By asking humans for help each time",
        "Patterns cannot be learned by AI"
      ],
      correctAnswer: 1,
      explanation: "AI learns patterns by processing large amounts of examples, identifying common features, and building internal models to recognize similar patterns in new data."
    },
    {
      id: "ai-3-q3",
      question: "Which of these uses pattern recognition?",
      options: [
        "Email spam filters identifying junk mail",
        "A light bulb turning on",
        "A simple timer counting down",
        "An electric fan spinning"
      ],
      correctAnswer: 0,
      explanation: "Spam filters use pattern recognition to identify characteristics common to spam emails (certain words, sender patterns, formatting) and filter them out."
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
      question: "What technology helps chatbots understand human language?",
      options: [
        "HTML and CSS",
        "Natural Language Processing (NLP)",
        "Spreadsheet formulas",
        "Photo editing software"
      ],
      correctAnswer: 1,
      explanation: "Natural Language Processing (NLP) is the AI technology that enables computers to understand, interpret, and generate human language."
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
      explanation: "Intent refers to what the user is trying to accomplish with their message - like asking a question, making a request, or seeking information."
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
      explanation: "Sentiment analysis uses AI to identify and extract emotions, opinions, and attitudes expressed in text - determining if content is positive, negative, or neutral."
    },
    {
      id: "ai-5-q2",
      question: "Which business might use sentiment analysis?",
      options: [
        "A company analyzing customer reviews",
        "A bakery counting ingredients",
        "A construction company building houses",
        "A farmer planting crops"
      ],
      correctAnswer: 0,
      explanation: "Companies use sentiment analysis to understand customer opinions from reviews, social media, and feedback to improve products and services."
    },
    {
      id: "ai-5-q3",
      question: "What are the typical sentiment categories?",
      options: [
        "Fast, slow, medium",
        "Positive, negative, neutral",
        "Big, small, average",
        "Hot, cold, warm"
      ],
      correctAnswer: 1,
      explanation: "Sentiment is typically classified as positive (happy, satisfied), negative (angry, disappointed), or neutral (factual, no strong emotion)."
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
      explanation: "A predictive model uses historical data and AI algorithms to make informed predictions about future events or outcomes."
    },
    {
      id: "ai-6-q2",
      question: "What is needed to build a good predictive model?",
      options: [
        "Only guessing and intuition",
        "Historical data, patterns, and proper training",
        "Just random numbers",
        "A crystal ball"
      ],
      correctAnswer: 1,
      explanation: "Good predictive models require quality historical data, identified patterns, proper algorithm training, and validation to make accurate forecasts."
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
      explanation: "Weather forecasting uses predictive AI models that analyze historical weather data, current conditions, and patterns to predict future weather."
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
      explanation: "Environmental metrics are quantitative measures used to track, analyze, and report on environmental conditions, impacts, and sustainability efforts."
    },
    {
      id: "env-1-q2",
      question: "Why is environmental data important?",
      options: [
        "It's not important at all",
        "It helps us understand and address environmental issues",
        "Only scientists need it",
        "It's only for decoration"
      ],
      correctAnswer: 1,
      explanation: "Environmental data helps us understand the health of our planet, track changes over time, and make informed decisions to protect the environment."
    },
    {
      id: "env-1-q3",
      question: "What is carbon footprint?",
      options: [
        "Footprints made of carbon",
        "The total greenhouse gas emissions caused by an individual or organization",
        "A type of shoe",
        "A hiking trail"
      ],
      correctAnswer: 1,
      explanation: "Carbon footprint measures the total amount of greenhouse gases (especially CO₂) produced directly and indirectly by human activities."
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
      explanation: "Waste is typically categorized into recyclables (can be processed again), compostables (organic matter that decomposes), and landfill waste (non-recyclable)."
    },
    {
      id: "env-2-q2",
      question: "What does 'recycling' mean?",
      options: [
        "Throwing things away",
        "Converting waste materials into new products",
        "Burning garbage",
        "Burying trash underground"
      ],
      correctAnswer: 1,
      explanation: "Recycling is the process of collecting and processing materials that would otherwise be thrown away and turning them into new products."
    },
    {
      id: "env-2-q3",
      question: "Which material takes the longest to decompose?",
      options: [
        "Paper (2-6 weeks)",
        "Banana peel (2-5 weeks)",
        "Plastic bottle (450+ years)",
        "Cotton cloth (1-5 months)"
      ],
      correctAnswer: 2,
      explanation: "Plastic takes hundreds of years to decompose, which is why reducing plastic use and proper recycling is so important for the environment."
    }
  ],
  "env-3": [
    {
      id: "env-3-q1",
      question: "What is CO₂?",
      options: [
        "A type of vitamin",
        "Carbon dioxide, a greenhouse gas",
        "A computer code",
        "A type of battery"
      ],
      correctAnswer: 1,
      explanation: "CO₂ (carbon dioxide) is a greenhouse gas that traps heat in Earth's atmosphere, contributing to global warming and climate change."
    },
    {
      id: "env-3-q2",
      question: "Which activity produces the most CO₂ emissions globally?",
      options: [
        "Reading books",
        "Burning fossil fuels (coal, oil, gas)",
        "Walking in parks",
        "Drinking water"
      ],
      correctAnswer: 1,
      explanation: "Burning fossil fuels for electricity, heat, and transportation is the largest source of CO₂ emissions, contributing significantly to climate change."
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
      explanation: "Individuals can reduce their carbon footprint through choices like using public transport, saving energy, reducing waste, and choosing sustainable products."
    }
  ],
  "env-4": [
    {
      id: "env-4-q1",
      question: "What is data visualization?",
      options: [
        "Making data invisible",
        "Presenting data in graphical or visual formats",
        "Deleting all data",
        "Writing data in code"
      ],
      correctAnswer: 1,
      explanation: "Data visualization transforms complex data into visual formats like charts, graphs, and maps, making it easier to understand patterns and insights."
    },
    {
      id: "env-4-q2",
      question: "Why are charts useful for environmental data?",
      options: [
        "They look pretty",
        "They help identify trends and patterns quickly",
        "They hide important information",
        "They're only for decoration"
      ],
      correctAnswer: 1,
      explanation: "Charts and graphs help people quickly understand complex environmental data, spot trends, compare values, and communicate findings effectively."
    },
    {
      id: "env-4-q3",
      question: "Which chart type best shows change over time?",
      options: [
        "Pie chart",
        "Line chart",
        "Bar code",
        "Word cloud"
      ],
      correctAnswer: 1,
      explanation: "Line charts are ideal for showing how values change over time, making them perfect for tracking environmental metrics like temperature or emissions trends."
    }
  ],
  "env-5": [
    {
      id: "env-5-q1",
      question: "Why are educational games effective for learning?",
      options: [
        "They're not effective",
        "They make learning engaging and memorable",
        "They only work for adults",
        "They replace teachers completely"
      ],
      correctAnswer: 1,
      explanation: "Educational games increase engagement, motivation, and retention by making learning interactive, fun, and providing immediate feedback."
    },
    {
      id: "env-5-q2",
      question: "What makes a good environmental education game?",
      options: [
        "Complex rules that no one understands",
        "Clear goals, engaging mechanics, and accurate information",
        "No learning objectives",
        "Only violence and competition"
      ],
      correctAnswer: 1,
      explanation: "Effective educational games balance fun gameplay with clear learning objectives, accurate content, and meaningful choices that reinforce key concepts."
    },
    {
      id: "env-5-q3",
      question: "How can games promote environmental awareness?",
      options: [
        "By ignoring environmental issues",
        "By simulating real-world environmental challenges and solutions",
        "By only showing negative outcomes",
        "Games can't teach about environment"
      ],
      correctAnswer: 1,
      explanation: "Games can simulate environmental scenarios, letting players experience consequences of choices and discover sustainable solutions in a safe, engaging way."
    }
  ],
  "env-6": [
    {
      id: "env-6-q1",
      question: "What is an environmental dashboard?",
      options: [
        "A car's control panel",
        "A visual interface displaying environmental metrics and analytics",
        "A wooden board",
        "A type of game"
      ],
      correctAnswer: 1,
      explanation: "An environmental dashboard is a visual tool that displays key environmental metrics, trends, and analytics in an organized, easy-to-understand format."
    },
    {
      id: "env-6-q2",
      question: "What key features should an environmental dashboard have?",
      options: [
        "Only text, no visuals",
        "Real-time data, visualizations, and actionable insights",
        "Random colors and shapes",
        "Password protection only"
      ],
      correctAnswer: 1,
      explanation: "Effective dashboards combine real-time data updates, clear visualizations, key metrics, and actionable insights to support decision-making."
    },
    {
      id: "env-6-q3",
      question: "Who can benefit from environmental dashboards?",
      options: [
        "Only large corporations",
        "Individuals, organizations, governments, and communities",
        "Only environmental scientists",
        "No one really uses them"
      ],
      correctAnswer: 1,
      explanation: "Environmental dashboards help everyone from individuals tracking personal impact to governments monitoring national environmental policies and goals."
    }
  ]
};
