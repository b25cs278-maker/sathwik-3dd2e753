// User Profile Types
export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  coverImage: string;
  bio: string;
  tagline: string;
  level: number;
  xp: number;
  streak: number;
  totalXp: number;
  joinDate: Date;
  socialLinks: Record<string, string>;
  education: Education[];
  experience: Experience[];
  privacy: PrivacySettings;
  theme: 'light' | 'dark' | 'auto';
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private';
  activityVisibility: 'everyone' | 'connections' | 'private';
  connectionRequests: 'everyone' | 'connections' | 'private';
}

export interface Skill {
  id: string;
  name: string;
  category: 'Languages' | 'Frontend' | 'Backend' | 'AI/ML' | 'Data' | 'DevOps' | 'Design';
  proficiency: number;
  endorsements: number;
  lastUsedDate: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  category: 'Web' | 'AI' | 'Mobile' | 'Data' | 'Other';
  githubUrl?: string;
  liveUrl?: string;
  likes: number;
  views: number;
  createdDate: Date;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: Date;
  expirationDate?: Date;
  verificationId: string;
  url: string;
}

export type ActivityType =
  | 'course_completion'
  | 'badge_unlock'
  | 'project_upload'
  | 'comment'
  | 'connection'
  | 'achievement'
  | 'skill_endorsed';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  relatedId?: string;
}

export interface Connection {
  id: string;
  name: string;
  avatar: string;
  title: string;
  skills: string[];
  mutualCount: number;
  isFollowing: boolean;
  isSuggested?: boolean;
}

export interface AnalyticsData {
  xpHistory: { date: string; xp: number }[];
  studyTimeByDay: { day: string; minutes: number }[];
  skillProgress: { skill: string; progress: number }[];
  performanceScore: number;
}

export interface AIInsight {
  id: string;
  type: 'recommendation' | 'achievement' | 'gap_analysis' | 'career_path' | 'learning_plan';
  title: string;
  description: string;
  icon: string;
  actionUrl?: string;
}
