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

export const softSkillsQuizzes: ModuleQuizData = {
  "ss-1": [
    { id: "ss-1-q1", question: "What is verbal communication?", options: ["Using body language only", "Expressing ideas through spoken or written words", "Sending emails", "Listening to music"], correctAnswer: 1, explanation: "Verbal communication involves using words—spoken or written—to convey messages and ideas." },
    { id: "ss-1-q2", question: "Which is an example of non-verbal communication?", options: ["Writing an email", "Making a phone call", "Maintaining eye contact", "Reading a book"], correctAnswer: 2, explanation: "Eye contact is a powerful form of non-verbal communication that shows attention and confidence." },
    { id: "ss-1-q3", question: "Why is effective communication important?", options: ["It's not important", "It helps build relationships and avoid misunderstandings", "Only for presentations", "Only in written form"], correctAnswer: 1, explanation: "Effective communication is essential for building relationships, teamwork, and preventing misunderstandings." },
  ],
  "ss-2": [
    { id: "ss-2-q1", question: "What does confident body language look like?", options: ["Slouching and looking down", "Standing tall with open posture", "Crossing arms tightly", "Avoiding all eye contact"], correctAnswer: 1, explanation: "Confident body language includes standing tall, maintaining open posture, and making appropriate eye contact." },
    { id: "ss-2-q2", question: "How can you build self-confidence?", options: ["Avoid all challenges", "Practice skills and celebrate small wins", "Never speak in public", "Only work alone"], correctAnswer: 1, explanation: "Building confidence comes from practice, stepping outside comfort zones, and acknowledging progress." },
    { id: "ss-2-q3", question: "Why is eye contact important in communication?", options: ["It's rude", "It shows engagement and builds trust", "It's only for formal settings", "It doesn't matter"], correctAnswer: 1, explanation: "Appropriate eye contact shows you're engaged, builds trust, and makes communication more effective." },
  ],
  "ss-3": [
    { id: "ss-3-q1", question: "What is active listening?", options: ["Hearing words without paying attention", "Fully concentrating and responding thoughtfully", "Interrupting frequently", "Multitasking while listening"], correctAnswer: 1, explanation: "Active listening means fully focusing on the speaker, understanding their message, and responding thoughtfully." },
    { id: "ss-3-q2", question: "Which technique helps in active listening?", options: ["Checking your phone", "Paraphrasing what the speaker said", "Planning your response while they talk", "Looking away"], correctAnswer: 1, explanation: "Paraphrasing confirms understanding and shows the speaker you're truly listening." },
    { id: "ss-3-q3", question: "What should you avoid during active listening?", options: ["Nodding to show understanding", "Asking clarifying questions", "Interrupting the speaker", "Making eye contact"], correctAnswer: 2, explanation: "Interrupting breaks the flow of communication and shows you're not fully listening." },
  ],
  "ss-4": [
    { id: "ss-4-q1", question: "What makes a team effective?", options: ["One person doing all the work", "Clear communication and shared goals", "Avoiding disagreements entirely", "Working independently"], correctAnswer: 1, explanation: "Effective teams communicate openly, share goals, and leverage each member's strengths." },
    { id: "ss-4-q2", question: "How should conflicts be handled in a team?", options: ["Ignore them", "Through open discussion and compromise", "By removing team members", "Letting the leader decide everything"], correctAnswer: 1, explanation: "Healthy conflict resolution involves open discussion, active listening, and finding mutually acceptable solutions." },
    { id: "ss-4-q3", question: "What is a key quality of a good team player?", options: ["Always agreeing with everyone", "Being reliable and contributing actively", "Working only on easy tasks", "Taking credit for others' work"], correctAnswer: 1, explanation: "Good team players are reliable, contribute actively, and support their teammates." },
  ],
  "ss-5": [
    { id: "ss-5-q1", question: "What is time management?", options: ["Working longer hours", "Planning and controlling how time is spent on activities", "Doing everything at once", "Avoiding deadlines"], correctAnswer: 1, explanation: "Time management is the practice of planning and controlling how you spend your time to work more effectively." },
    { id: "ss-5-q2", question: "Which technique helps prioritize tasks?", options: ["Doing the easiest task first always", "The Eisenhower Matrix (urgent vs important)", "Random selection", "Procrastination"], correctAnswer: 1, explanation: "The Eisenhower Matrix helps prioritize by categorizing tasks as urgent/not urgent and important/not important." },
    { id: "ss-5-q3", question: "What is a common time-waster?", options: ["Setting clear goals", "Multitasking without focus", "Creating to-do lists", "Taking scheduled breaks"], correctAnswer: 1, explanation: "Multitasking without focus reduces productivity and increases errors. Focused work is more effective." },
  ],
};

export const englishLearningQuizzes: ModuleQuizData = {
  "eng-1": [
    { id: "eng-1-q1", question: "What is a sentence?", options: ["A single word", "A group of words that expresses a complete thought", "Just a verb", "A paragraph"], correctAnswer: 1, explanation: "A sentence is a group of words that contains a subject and predicate and expresses a complete thought." },
    { id: "eng-1-q2", question: "Which is the correct sentence?", options: ["She go to school.", "She goes to school.", "She going school.", "She school goes."], correctAnswer: 1, explanation: "'She goes to school' uses the correct subject-verb agreement for third person singular present tense." },
    { id: "eng-1-q3", question: "What are the three main tenses in English?", options: ["Fast, slow, medium", "Past, present, future", "First, second, third", "Simple, complex, compound"], correctAnswer: 1, explanation: "The three main tenses are past (happened before), present (happening now), and future (will happen)." },
  ],
  "eng-2": [
    { id: "eng-2-q1", question: "How do you greet someone in a formal setting?", options: ["Hey, what's up?", "Good morning, how are you?", "Yo!", "Sup?"], correctAnswer: 1, explanation: "'Good morning, how are you?' is appropriate for formal greetings in professional or academic settings." },
    { id: "eng-2-q2", question: "Which phrase is used to ask for directions?", options: ["Give me food", "Could you tell me how to get to...?", "I want to go", "Where is?"], correctAnswer: 1, explanation: "'Could you tell me how to get to...?' is a polite and complete way to ask for directions." },
    { id: "eng-2-q3", question: "How do you politely ask for something?", options: ["Give me that!", "Could I please have...?", "I want!", "Get me..."], correctAnswer: 1, explanation: "Using 'Could I please have...' shows politeness and respect in English conversation." },
  ],
  "eng-3": [
    { id: "eng-3-q1", question: "What does 'collaborate' mean?", options: ["To work alone", "To work together with others", "To compete against", "To ignore"], correctAnswer: 1, explanation: "'Collaborate' means to work jointly with others on a task or project." },
    { id: "eng-3-q2", question: "Choose the correct synonym for 'important':", options: ["Trivial", "Significant", "Boring", "Small"], correctAnswer: 1, explanation: "'Significant' is a synonym for 'important', meaning having great value or consequence." },
    { id: "eng-3-q3", question: "What is the opposite of 'increase'?", options: ["Grow", "Expand", "Decrease", "Rise"], correctAnswer: 2, explanation: "'Decrease' is the antonym of 'increase', meaning to become smaller or less." },
  ],
  "eng-4": [
    { id: "eng-4-q1", question: "How should a professional email begin?", options: ["Hey dude!", "Dear Mr./Ms. [Name],", "What's up?", "Yo,"], correctAnswer: 1, explanation: "Professional emails should start with a formal greeting like 'Dear Mr./Ms. [Name],' to show respect." },
    { id: "eng-4-q2", question: "What should you include in a professional email?", options: ["Emojis and slang", "Clear subject, greeting, body, and closing", "Only your name", "Long personal stories"], correctAnswer: 1, explanation: "Professional emails need a clear subject line, appropriate greeting, concise body, and professional closing." },
    { id: "eng-4-q3", question: "Which closing is appropriate for a formal email?", options: ["Later!", "Best regards,", "See ya!", "XOXO"], correctAnswer: 1, explanation: "'Best regards' is a professional and widely accepted way to close formal emails." },
  ],
};

export const interviewSkillsQuizzes: ModuleQuizData = {
  "int-1": [
    { id: "int-1-q1", question: "What are the main types of interviews?", options: ["Only phone interviews", "HR, technical, and behavioral interviews", "Only written tests", "Only group discussions"], correctAnswer: 1, explanation: "Interviews typically include HR (screening), technical (skills-based), and behavioral (situation-based) rounds." },
    { id: "int-1-q2", question: "What should you research before an interview?", options: ["Nothing, just wing it", "The company, role, and industry", "Only the salary", "Your horoscope"], correctAnswer: 1, explanation: "Researching the company, role, and industry shows preparation and genuine interest to the interviewer." },
    { id: "int-1-q3", question: "What is appropriate interview attire?", options: ["Casual beach wear", "Clean, professional clothing appropriate for the company", "Pajamas", "Halloween costume"], correctAnswer: 1, explanation: "Professional attire appropriate to the company culture shows respect and seriousness about the opportunity." },
  ],
  "int-2": [
    { id: "int-2-q1", question: "How should you answer 'Tell me about yourself'?", options: ["Share your entire life story", "Give a brief professional summary highlighting relevant experience", "Say 'I don't know'", "Talk about your pets"], correctAnswer: 1, explanation: "A brief professional summary covering education, experience, and career goals makes a strong first impression." },
    { id: "int-2-q2", question: "What is the STAR method?", options: ["A constellation guide", "Situation, Task, Action, Result - a framework for answering behavioral questions", "A rating system", "A type of interview"], correctAnswer: 1, explanation: "STAR (Situation, Task, Action, Result) helps structure clear, compelling answers to behavioral questions." },
    { id: "int-2-q3", question: "How should you handle the question 'What is your weakness?'", options: ["Say you have none", "Mention a genuine area of improvement and how you're working on it", "List all your flaws", "Refuse to answer"], correctAnswer: 1, explanation: "Sharing a genuine weakness with steps you're taking to improve shows self-awareness and growth mindset." },
  ],
  "int-3": [
    { id: "int-3-q1", question: "How should you explain a project in an interview?", options: ["Give every technical detail possible", "Describe the problem, your approach, and the impact clearly", "Say it was easy", "Skip the explanation"], correctAnswer: 1, explanation: "Structure your project explanation around the problem, your specific contributions, and measurable results." },
    { id: "int-3-q2", question: "What should you do if you don't know an answer?", options: ["Make up an answer", "Honestly say you're unsure but explain your approach to finding the answer", "Leave the room", "Change the subject"], correctAnswer: 1, explanation: "Honesty combined with showing your problem-solving approach demonstrates integrity and critical thinking." },
    { id: "int-3-q3", question: "Why are follow-up questions important?", options: ["They waste time", "They show genuine interest and help you assess the role", "They're not important", "They annoy the interviewer"], correctAnswer: 1, explanation: "Thoughtful questions show you're genuinely interested and help you evaluate if the role is right for you." },
  ],
  "int-4": [
    { id: "int-4-q1", question: "What is a mock interview?", options: ["A fake company", "A practice interview simulating real conditions", "A written test", "A group activity"], correctAnswer: 1, explanation: "Mock interviews simulate real interview conditions to help you practice and improve your performance." },
    { id: "int-4-q2", question: "What should you do after an interview?", options: ["Forget about it", "Send a thank-you email within 24 hours", "Call repeatedly", "Post about it on social media"], correctAnswer: 1, explanation: "A timely thank-you email shows professionalism and reinforces your interest in the position." },
    { id: "int-4-q3", question: "How can you manage interview anxiety?", options: ["Avoid interviews entirely", "Prepare thoroughly, practice, and use breathing techniques", "Drink lots of coffee", "Don't think about it at all"], correctAnswer: 1, explanation: "Thorough preparation, practice, and relaxation techniques like deep breathing help manage interview anxiety." },
  ],
};
