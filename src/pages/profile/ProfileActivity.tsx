import { useState } from 'react';
import { ProfileLayout } from '@/components/profile/ProfileLayout';
import { activityFeed } from '@/data/profileMockData';
import { Filter } from 'lucide-react';

const activityTypes = [
  { value: 'all', label: 'All Activity' },
  { value: 'course_completion', label: 'Courses' },
  { value: 'badge_unlock', label: 'Badges' },
  { value: 'project_upload', label: 'Projects' },
  { value: 'skill_endorsed', label: 'Skills' },
  { value: 'achievement', label: 'Achievements' },
];

const icon = (t: string) =>
  ({ achievement: '🏆', project_upload: '🚀', skill_endorsed: '👍', course_completion: '✅', badge_unlock: '🎖️', connection: '🤝' } as Record<string, string>)[t] || '📌';

export default function ProfileActivity() {
  const [type, setType] = useState('all');
  const items = type === 'all' ? activityFeed : activityFeed.filter((a) => a.type === type);

  return (
    <ProfileLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Activity</h1>
          <p className="text-muted-foreground">Your learning journey and achievements</p>
        </div>

        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          <Filter className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <div className="flex gap-2">
            {activityTypes.map((t) => (
              <button
                key={t.value}
                onClick={() => setType(t.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${type === t.value ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {items.length ? items.map((a, i) => (
            <div key={a.id} className="relative">
              {i < items.length - 1 && <div className="absolute left-6 top-16 h-12 w-0.5 bg-border" />}
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center flex-shrink-0 text-xl">{icon(a.type)}</div>
                <div className="flex-1 bg-card border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{a.title}</h3>
                      {a.description && <p className="text-sm text-muted-foreground mt-1">{a.description}</p>}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-muted-foreground">{a.timestamp.toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-12 text-muted-foreground">No activity found</div>
          )}
        </div>
      </div>
    </ProfileLayout>
  );
}
