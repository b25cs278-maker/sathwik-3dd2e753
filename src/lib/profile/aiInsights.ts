import type { AIInsight, UserProfile, Skill } from '@/types/profile';

export function generatePersonalizedInsights(
  profile: UserProfile,
  skills: Skill[]
): AIInsight[] {
  const insights: AIInsight[] = [];
  const skillNames = skills.map((s) => s.name.toLowerCase());

  if (!skillNames.includes('kubernetes') && skillNames.includes('docker')) {
    insights.push({
      id: 'gap-1',
      type: 'gap_analysis',
      title: 'Learn Kubernetes Next',
      description: "You've mastered Docker. Kubernetes is the natural next step.",
      icon: '🐳',
    });
  }

  const avgProficiency =
    skills.reduce((acc, s) => acc + s.proficiency, 0) / (skills.length || 1);
  if (avgProficiency > 80) {
    insights.push({
      id: 'career-1',
      type: 'career_path',
      title: 'Senior Path Available',
      description: `Average proficiency ${Math.round(avgProficiency)}% — you're ready for senior challenges.`,
      icon: '📈',
    });
  }

  if (profile.level > 10) {
    insights.push({
      id: 'rec-1',
      type: 'recommendation',
      title: 'Advanced Topics Unlocked',
      description: 'Consider exploring system design and architecture.',
      icon: '🏗️',
    });
  }

  if (profile.streak > 20) {
    insights.push({
      id: 'ach-1',
      type: 'achievement',
      title: `${profile.streak}-Day Streak! 🔥`,
      description: "You're crushing it! Keep the momentum going.",
      icon: '🔥',
    });
  }

  return insights;
}

export function calculatePerformanceScore(
  profile: UserProfile,
  skills: Skill[],
  projectCount: number
): number {
  let score = 50;
  score += Math.min((profile.totalXp / 50000) * 20, 20);
  const avg = skills.reduce((a, s) => a + s.proficiency, 0) / (skills.length || 1);
  score += (avg / 100) * 15;
  score += Math.min((profile.streak / 100) * 10, 10);
  score += Math.min(projectCount * 0.5, 5);
  return Math.round(score);
}
