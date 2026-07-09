// Demo/placeholder content for profile sections that don't yet have backing tables.
// Replace section-by-section as real Supabase tables come online.
import type {
  UserProfile,
  Skill,
  Project,
  Certificate,
  ActivityItem,
  Connection,
  AnalyticsData,
  AIInsight,
} from '@/types/profile';

export const currentUser: UserProfile = {
  id: 'user-1',
  username: 'learner',
  displayName: 'NexusCraft Member',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NexusCraft',
  coverImage:
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=300&fit=crop',
  bio: 'Lifelong learner exploring AI, sustainability, and building real-world projects.',
  tagline: 'Learning, building, contributing',
  level: 1,
  xp: 0,
  streak: 0,
  totalXp: 0,
  joinDate: new Date(),
  socialLinks: {},
  education: [],
  experience: [],
  privacy: {
    profileVisibility: 'public',
    activityVisibility: 'everyone',
    connectionRequests: 'everyone',
  },
  theme: 'dark',
};

export const skills: Skill[] = [
  { id: 'skill-1', name: 'TypeScript', category: 'Languages', proficiency: 85, endorsements: 12, lastUsedDate: new Date(Date.now() - 1 * 86400000) },
  { id: 'skill-2', name: 'React', category: 'Frontend', proficiency: 88, endorsements: 18, lastUsedDate: new Date() },
  { id: 'skill-3', name: 'Node.js', category: 'Backend', proficiency: 75, endorsements: 9, lastUsedDate: new Date(Date.now() - 3 * 86400000) },
  { id: 'skill-4', name: 'Python', category: 'Languages', proficiency: 70, endorsements: 7, lastUsedDate: new Date(Date.now() - 5 * 86400000) },
  { id: 'skill-5', name: 'PostgreSQL', category: 'Data', proficiency: 72, endorsements: 6, lastUsedDate: new Date(Date.now() - 4 * 86400000) },
  { id: 'skill-6', name: 'Docker', category: 'DevOps', proficiency: 65, endorsements: 5, lastUsedDate: new Date(Date.now() - 6 * 86400000) },
];

export const projects: Project[] = [
  {
    id: 'proj-1',
    title: 'Eco Tracker',
    description: 'Personal sustainability dashboard tracking daily eco actions.',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&h=300&fit=crop',
    techStack: ['React', 'TypeScript', 'Supabase'],
    category: 'Web',
    likes: 24,
    views: 180,
    createdDate: new Date(),
  },
  {
    id: 'proj-2',
    title: 'AI Study Buddy',
    description: 'Conversational tutor that helps you learn new topics faster.',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&h=300&fit=crop',
    techStack: ['Next.js', 'OpenAI', 'Tailwind'],
    category: 'AI',
    likes: 41,
    views: 320,
    createdDate: new Date(Date.now() - 30 * 86400000),
  },
];

export const certificates: Certificate[] = [
  {
    id: 'cert-1',
    name: 'AI Foundations',
    issuer: 'NexusCraft Academy',
    issueDate: new Date(Date.now() - 60 * 86400000),
    verificationId: 'EL-AI-FOUND-001',
    url: '#',
  },
];

export const activityFeed: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'achievement',
    title: 'Welcome to NexusCraft',
    description: 'You created your learner profile.',
    timestamp: new Date(),
  },
];

export const connections: Connection[] = [
  {
    id: 'conn-1',
    name: 'Sarah Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    title: 'Sustainability Engineer',
    skills: ['React', 'Climate Data'],
    mutualCount: 4,
    isFollowing: true,
  },
  {
    id: 'conn-2',
    name: 'Michael Park',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    title: 'Product Manager',
    skills: ['Strategy', 'Research'],
    mutualCount: 2,
    isFollowing: false,
    isSuggested: true,
  },
];

export const analyticsData: AnalyticsData = {
  xpHistory: [
    { date: 'Week 1', xp: 200 },
    { date: 'Week 2', xp: 540 },
    { date: 'Week 3', xp: 980 },
    { date: 'Week 4', xp: 1450 },
  ],
  studyTimeByDay: [
    { day: 'Monday', minutes: 45 },
    { day: 'Tuesday', minutes: 60 },
    { day: 'Wednesday', minutes: 30 },
    { day: 'Thursday', minutes: 75 },
    { day: 'Friday', minutes: 50 },
    { day: 'Saturday', minutes: 90 },
    { day: 'Sunday', minutes: 40 },
  ],
  skillProgress: [
    { skill: 'TypeScript', progress: 85 },
    { skill: 'React', progress: 88 },
    { skill: 'Node.js', progress: 75 },
  ],
  performanceScore: 76,
};

export const aiInsights: AIInsight[] = [
  {
    id: 'insight-1',
    type: 'recommendation',
    title: 'Try a new track this week',
    description: 'Based on your progress, Sustainable Tech Foundations is a great next step.',
    icon: '🌱',
  },
  {
    id: 'insight-2',
    type: 'achievement',
    title: 'Consistency pays off',
    description: 'Daily learning improves retention by ~40%. Keep it up!',
    icon: '🔥',
  },
];
