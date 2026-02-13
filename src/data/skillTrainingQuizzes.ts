import type { Question } from "@/components/tracks/ModuleQuiz";

interface ModuleQuizData {
  [lessonId: string]: Question[];
}

export const softSkillsQuizzes: ModuleQuizData = {
  "ss-1": [
    { id: "ss-1-q1", question: "What is verbal communication?", options: ["Using body language only", "Expressing ideas through spoken or written words", "Sending emails", "Listening to music"], correctAnswer: 1, explanation: "Verbal communication involves using words—spoken or written—to convey messages and ideas." },
    { id: "ss-1-q2", type: "fill-blank", question: "Complete the sentence:", blankSentence: "Maintaining ___ contact is a powerful form of non-verbal communication.", correctAnswer: "eye", acceptableAnswers: ["Eye", "EYE"], explanation: "Eye contact is a powerful form of non-verbal communication that shows attention and confidence." },
    { id: "ss-1-q3", question: "Why is effective communication important?", options: ["It's not important", "It helps build relationships and avoid misunderstandings", "Only for presentations", "Only in written form"], correctAnswer: 1, explanation: "Effective communication is essential for building relationships, teamwork, and preventing misunderstandings." },
  ],
  "ss-2": [
    { id: "ss-2-q1", question: "What does confident body language look like?", options: ["Slouching and looking down", "Standing tall with open posture", "Crossing arms tightly", "Avoiding all eye contact"], correctAnswer: 1, explanation: "Confident body language includes standing tall, maintaining open posture, and making appropriate eye contact." },
    { id: "ss-2-q2", type: "fill-blank", question: "Fill in the blank:", blankSentence: "Good ___ and open body posture project confidence in any interaction.", correctAnswer: "posture", acceptableAnswers: ["Posture", "POSTURE"], explanation: "Good posture is a key component of confident body language." },
    { id: "ss-2-q3", type: "drag-drop", question: "Arrange these from least to most confident body language:", items: ["Standing tall with open arms", "Slouching with arms crossed", "Neutral standing position"], correctOrder: ["Slouching with arms crossed", "Neutral standing position", "Standing tall with open arms"], explanation: "Confidence increases from closed posture (slouching) through neutral to open, tall posture." },
  ],
  "ss-3": [
    { id: "ss-3-q1", question: "What is active listening?", options: ["Hearing words without paying attention", "Fully concentrating and responding thoughtfully", "Interrupting frequently", "Multitasking while listening"], correctAnswer: 1, explanation: "Active listening means fully focusing on the speaker, understanding their message, and responding thoughtfully." },
    { id: "ss-3-q2", type: "fill-blank", question: "Complete the sentence:", blankSentence: "___ what the speaker said is a technique that confirms understanding.", correctAnswer: "Paraphrasing", acceptableAnswers: ["paraphrasing", "PARAPHRASING"], explanation: "Paraphrasing confirms understanding and shows the speaker you're truly listening." },
    { id: "ss-3-q3", question: "What should you avoid during active listening?", options: ["Nodding to show understanding", "Asking clarifying questions", "Interrupting the speaker", "Making eye contact"], correctAnswer: 2, explanation: "Interrupting breaks the flow of communication and shows you're not fully listening." },
  ],
  "ss-4": [
    { id: "ss-4-q1", question: "What makes a team effective?", options: ["One person doing all the work", "Clear communication and shared goals", "Avoiding disagreements entirely", "Working independently"], correctAnswer: 1, explanation: "Effective teams communicate openly, share goals, and leverage each member's strengths." },
    { id: "ss-4-q2", type: "drag-drop", question: "Arrange the conflict resolution steps in order:", items: ["Find a Compromise", "Listen to All Sides", "Identify the Issue", "Implement the Solution"], correctOrder: ["Identify the Issue", "Listen to All Sides", "Find a Compromise", "Implement the Solution"], explanation: "Conflict resolution follows: identify the issue → listen to everyone → find compromise → implement." },
    { id: "ss-4-q3", question: "What is a key quality of a good team player?", options: ["Always agreeing with everyone", "Being reliable and contributing actively", "Working only on easy tasks", "Taking credit for others' work"], correctAnswer: 1, explanation: "Good team players are reliable, contribute actively, and support their teammates." },
  ],
  "ss-5": [
    { id: "ss-5-q1", question: "What is time management?", options: ["Working longer hours", "Planning and controlling how time is spent on activities", "Doing everything at once", "Avoiding deadlines"], correctAnswer: 1, explanation: "Time management is the practice of planning and controlling how you spend your time to work more effectively." },
    { id: "ss-5-q2", type: "fill-blank", question: "Complete the sentence:", blankSentence: "The ___ Matrix categorizes tasks by urgency and importance to help prioritize.", correctAnswer: "Eisenhower", acceptableAnswers: ["eisenhower", "EISENHOWER"], explanation: "The Eisenhower Matrix helps prioritize by categorizing tasks as urgent/not urgent and important/not important." },
    { id: "ss-5-q3", question: "What is a common time-waster?", options: ["Setting clear goals", "Multitasking without focus", "Creating to-do lists", "Taking scheduled breaks"], correctAnswer: 1, explanation: "Multitasking without focus reduces productivity and increases errors." },
  ],
};

export const englishLearningQuizzes: ModuleQuizData = {
  "eng-1": [
    { id: "eng-1-q1", question: "What is a sentence?", options: ["A single word", "A group of words that expresses a complete thought", "Just a verb", "A paragraph"], correctAnswer: 1, explanation: "A sentence is a group of words that contains a subject and predicate and expresses a complete thought." },
    { id: "eng-1-q2", type: "fill-blank", question: "Fill in the correct verb:", blankSentence: "She ___ to school every day.", correctAnswer: "goes", acceptableAnswers: ["Goes", "GOES"], explanation: "'She goes' uses the correct subject-verb agreement for third person singular present tense." },
    { id: "eng-1-q3", type: "drag-drop", question: "Arrange the three main English tenses in chronological order:", items: ["Future", "Past", "Present"], correctOrder: ["Past", "Present", "Future"], explanation: "The three main tenses are past (happened before), present (happening now), and future (will happen)." },
  ],
  "eng-2": [
    { id: "eng-2-q1", question: "How do you greet someone in a formal setting?", options: ["Hey, what's up?", "Good morning, how are you?", "Yo!", "Sup?"], correctAnswer: 1, explanation: "'Good morning, how are you?' is appropriate for formal greetings." },
    { id: "eng-2-q2", type: "fill-blank", question: "Complete the polite request:", blankSentence: "Could you ___ tell me how to get to the station?", correctAnswer: "please", acceptableAnswers: ["Please", "PLEASE"], explanation: "Using 'please' makes requests more polite in English conversation." },
    { id: "eng-2-q3", question: "How do you politely ask for something?", options: ["Give me that!", "Could I please have...?", "I want!", "Get me..."], correctAnswer: 1, explanation: "Using 'Could I please have...' shows politeness and respect." },
  ],
  "eng-3": [
    { id: "eng-3-q1", question: "What does 'collaborate' mean?", options: ["To work alone", "To work together with others", "To compete against", "To ignore"], correctAnswer: 1, explanation: "'Collaborate' means to work jointly with others on a task or project." },
    { id: "eng-3-q2", type: "fill-blank", question: "Choose the correct synonym:", blankSentence: "A word that means the same as 'important' is ___.", correctAnswer: "significant", acceptableAnswers: ["Significant", "SIGNIFICANT", "crucial", "Crucial"], explanation: "'Significant' is a synonym for 'important', meaning having great value or consequence." },
    { id: "eng-3-q3", question: "What is the opposite of 'increase'?", options: ["Grow", "Expand", "Decrease", "Rise"], correctAnswer: 2, explanation: "'Decrease' is the antonym of 'increase', meaning to become smaller or less." },
  ],
  "eng-4": [
    { id: "eng-4-q1", question: "How should a professional email begin?", options: ["Hey dude!", "Dear Mr./Ms. [Name],", "What's up?", "Yo,"], correctAnswer: 1, explanation: "Professional emails should start with a formal greeting like 'Dear Mr./Ms. [Name],'." },
    { id: "eng-4-q2", type: "drag-drop", question: "Arrange the parts of a professional email in correct order:", items: ["Closing (Best regards)", "Subject Line", "Body (Main message)", "Greeting (Dear...)"], correctOrder: ["Subject Line", "Greeting (Dear...)", "Body (Main message)", "Closing (Best regards)"], explanation: "A professional email follows: subject line → greeting → body → closing." },
    { id: "eng-4-q3", type: "fill-blank", question: "Complete the email closing:", blankSentence: "Best ___,\nJohn Smith", correctAnswer: "regards", acceptableAnswers: ["Regards", "REGARDS"], explanation: "'Best regards' is a professional and widely accepted way to close formal emails." },
  ],
};

export const interviewSkillsQuizzes: ModuleQuizData = {
  "int-1": [
    { id: "int-1-q1", question: "What are the main types of interviews?", options: ["Only phone interviews", "HR, technical, and behavioral interviews", "Only written tests", "Only group discussions"], correctAnswer: 1, explanation: "Interviews typically include HR, technical, and behavioral rounds." },
    { id: "int-1-q2", type: "fill-blank", question: "Complete the interview tip:", blankSentence: "Before an interview, always ___ the company, role, and industry.", correctAnswer: "research", acceptableAnswers: ["Research", "RESEARCH"], explanation: "Researching the company shows preparation and genuine interest to the interviewer." },
    { id: "int-1-q3", question: "What is appropriate interview attire?", options: ["Casual beach wear", "Clean, professional clothing appropriate for the company", "Pajamas", "Halloween costume"], correctAnswer: 1, explanation: "Professional attire shows respect and seriousness about the opportunity." },
  ],
  "int-2": [
    { id: "int-2-q1", question: "How should you answer 'Tell me about yourself'?", options: ["Share your entire life story", "Give a brief professional summary highlighting relevant experience", "Say 'I don't know'", "Talk about your pets"], correctAnswer: 1, explanation: "A brief professional summary covering education, experience, and career goals makes a strong first impression." },
    { id: "int-2-q2", type: "drag-drop", question: "Arrange the STAR method components in correct order:", items: ["Result", "Situation", "Action", "Task"], correctOrder: ["Situation", "Task", "Action", "Result"], explanation: "STAR stands for Situation → Task → Action → Result, a framework for answering behavioral questions." },
    { id: "int-2-q3", type: "fill-blank", question: "Complete the interview advice:", blankSentence: "When discussing weaknesses, mention a genuine area of improvement and how you're ___ on it.", correctAnswer: "working", acceptableAnswers: ["Working", "WORKING", "improving"], explanation: "Sharing a genuine weakness with steps you're taking to improve shows self-awareness." },
  ],
  "int-3": [
    { id: "int-3-q1", question: "How should you explain a project in an interview?", options: ["Give every technical detail possible", "Describe the problem, your approach, and the impact clearly", "Say it was easy", "Skip the explanation"], correctAnswer: 1, explanation: "Structure your project explanation around the problem, your contributions, and measurable results." },
    { id: "int-3-q2", type: "fill-blank", question: "Complete the sentence:", blankSentence: "If you don't know an answer, honestly say you're ___ but explain your approach to finding it.", correctAnswer: "unsure", acceptableAnswers: ["Unsure", "UNSURE", "uncertain", "Uncertain"], explanation: "Honesty combined with showing your problem-solving approach demonstrates integrity." },
    { id: "int-3-q3", question: "Why are follow-up questions important?", options: ["They waste time", "They show genuine interest and help you assess the role", "They're not important", "They annoy the interviewer"], correctAnswer: 1, explanation: "Thoughtful questions show you're genuinely interested and help evaluate if the role is right for you." },
  ],
  "int-4": [
    { id: "int-4-q1", question: "What is a mock interview?", options: ["A fake company", "A practice interview simulating real conditions", "A written test", "A group activity"], correctAnswer: 1, explanation: "Mock interviews simulate real interview conditions to help you practice and improve." },
    { id: "int-4-q2", type: "fill-blank", question: "Complete the tip:", blankSentence: "After an interview, send a thank-you ___ within 24 hours.", correctAnswer: "email", acceptableAnswers: ["Email", "EMAIL", "message", "Message", "note", "Note"], explanation: "A timely thank-you email shows professionalism and reinforces your interest." },
    { id: "int-4-q3", type: "drag-drop", question: "Arrange the interview preparation steps in order:", items: ["Send Thank-You Note", "Research the Company", "Practice Common Questions", "Attend the Interview"], correctOrder: ["Research the Company", "Practice Common Questions", "Attend the Interview", "Send Thank-You Note"], explanation: "Preparation follows: research → practice → attend → follow up with a thank-you note." },
  ],
};
