import { ThumbsUp } from 'lucide-react';
import type { Skill } from '@/types/profile';

export function SkillCard({ skill }: { skill: Skill }) {
  const lastUsedDaysAgo = Math.floor(
    (Date.now() - skill.lastUsedDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground">{skill.name}</h3>
          <p className="text-xs text-muted-foreground">{skill.category}</p>
        </div>
        <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded">
          <ThumbsUp className="h-3 w-3 text-primary" />
          <span className="text-sm font-medium text-primary">{skill.endorsements}</span>
        </div>
      </div>
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-muted-foreground">Proficiency</span>
          <span className="text-sm font-medium text-foreground">{skill.proficiency}%</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all" style={{ width: `${skill.proficiency}%` }} />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Used {lastUsedDaysAgo} days ago</p>
    </div>
  );
}
