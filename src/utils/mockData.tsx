import { 
  Brain, 
  Leaf, 
  Trophy, 
  Users, 
  GraduationCap, 
  Target,
  MessageSquare,
  Award,
  Zap
} from 'lucide-react';
import React from 'react';

export const mockData = {
  stats: [
    { value: '50K+', label: 'Active Learners' },
    { value: '500+', label: 'AI Modules' },
    { value: '95%', label: 'Success Rate' },
    { value: '24/7', label: 'Expert Support' }
  ],

  features: [
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'AI Innovation Track',
      description: 'Build chatbots, dashboards, and smart tools with cutting-edge AI technology',
      badge: '40+ Modules'
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: 'Environmental Solutions',
      description: 'Solve real-world ecological problems with technology-driven sustainability projects',
      badge: 'Hands-on Projects'
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: 'Gamified Challenges',
      description: 'Earn points and badges through exciting quiz battles and learning challenges',
      badge: '10-50 Points'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Global Community',
      description: 'Connect with 50,000+ learners worldwide and grow together',
      badge: '50K+ Members'
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: 'Expert Workshops',
      description: 'Live learning sessions with industry experts and certified instructors',
      badge: 'Live Sessions'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'AI Learning Planner',
      description: 'Personalized learning paths powered by AI to match your goals',
      badge: 'Personalized'
    }
  ],

  aiTrack: [
    'Build production-ready AI applications',
    'Master machine learning fundamentals',
    'Create intelligent chatbots and assistants',
    'Develop data-driven dashboards',
    'Deploy AI models to real-world scenarios',
    'Get certified by industry experts'
  ],

  challenges: [
    {
      level: 'EASY',
      title: 'Innovation Basics',
      description: 'Learn fundamentals of innovation and creative thinking',
      points: '10',
      duration: '3 min'
    },
    {
      level: 'MEDIUM',
      title: 'Climate & Ecosystems',
      description: 'Understand climate change and ecosystem dynamics',
      points: '25',
      duration: '4 min'
    },
    {
      level: 'HARD',
      title: 'Environmental Solutions',
      description: 'Advanced environmental challenges and AI-driven solutions',
      points: '50',
      duration: '5 min'
    }
  ],

  leaderboard: [
    { name: 'Ramya K.', credits: 1847, modules: 28 },
    { name: 'Saipriya M.', credits: 1653, modules: 24 },
    { name: 'Deni S.', credits: 1420, modules: 22 },
    { name: 'Akshitha R.', credits: 1298, modules: 20 },
    { name: 'Satya P.', credits: 1156, modules: 18 }
  ],

  communityFeatures: [
    {
      icon: <MessageSquare className="w-5 h-5 text-cyan-400" />,
      name: 'Discussion Forums',
      description: 'Ask questions and get peer support'
    },
    {
      icon: <Users className="w-5 h-5 text-cyan-400" />,
      name: 'Study Groups',
      description: 'Learn together with like-minded peers'
    },
    {
      icon: <Award className="w-5 h-5 text-cyan-400" />,
      name: 'Share Achievements',
      description: 'Celebrate your learning milestones'
    },
    {
      icon: <Zap className="w-5 h-5 text-cyan-400" />,
      name: 'Collaborate on Projects',
      description: 'Work on real-world challenges together'
    }
  ],

  workshops: [
    {
      title: 'Building AI Chatbots with GPT',
      instructor: 'Dr. Sarah Chen, AI Researcher',
      type: 'Live Workshop',
      date: 'Jan 15, 2026',
      enrolled: '234',
      image: 'https://images.pexels.com/photos/7562050/pexels-photo-7562050.jpeg'
    },
    {
      title: 'Climate Data Analysis',
      instructor: 'Prof. Michael Green',
      type: 'Expert Session',
      date: 'Jan 18, 2026',
      enrolled: '189',
      image: 'https://images.unsplash.com/photo-1707457784605-9d9f1a7e8632'
    },
    {
      title: 'Machine Learning Fundamentals',
      instructor: 'Alex Rodriguez, ML Engineer',
      type: 'Masterclass',
      date: 'Jan 22, 2026',
      enrolled: '312',
      image: 'https://images.pexels.com/photos/7688549/pexels-photo-7688549.jpeg'
    }
  ],

  testimonials: [
    {
      name: 'Priya Sharma',
      role: 'AI Developer at Tech Corp',
      avatar: 'PS',
      text: 'EcoLearn transformed my career. The AI track gave me practical skills I use daily. Within 6 months, I landed my dream job as an AI developer!',
      achievement: '🎯 Completed 45 AI modules • 2,340 credits earned'
    },
    {
      name: 'Rahul Verma',
      role: 'Environmental Consultant',
      avatar: 'RV',
      text: 'The combination of AI and environmental focus is brilliant. I built a climate prediction model using skills learned here. The community support is incredible.',
      achievement: '🌱 Led 12 environmental projects • Top 5 leaderboard'
    },
    {
      name: 'Ananya Reddy',
      role: 'College Student',
      avatar: 'AR',
      text: 'As a student, the gamified learning kept me engaged. I earned 3,000+ credits and gained real-world AI skills that make me stand out in interviews.',
      achievement: '🏆 50-day learning streak • 3,124 credits'
    }
  ]
};
