import { useState } from 'react';
import { ProfileLayout } from '@/components/profile/ProfileLayout';
import { ProfileComingSoon } from '@/components/profile/ProfileComingSoon';
import { useProfileUser } from '@/hooks/useProfileUser';
import { Search } from 'lucide-react';

export default function ProfileSkills() {
  const [search, setSearch] = useState('');
  const { raw } = useProfileUser();
  const skills = Array.isArray(raw?.skills) ? raw.skills.filter(Boolean) : [];
  const filtered = skills.filter((skill: string) => skill.toLowerCase().includes(search.toLowerCase()));

  return (
    <ProfileLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Skills</h1>
          <p className="text-muted-foreground">Manage your skills and proficiency levels</p>
        </div>

        <div className="flex gap-4 mb-8 flex-wrap">
          <div className="flex-1 relative min-w-[200px]">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {filtered.length ? (
          <div className="flex flex-wrap gap-3 rounded-lg border border-border bg-card p-6">
            {filtered.map((skill: string) => (
              <span key={skill} className="rounded-lg bg-primary/10 px-4 py-2 font-medium text-primary">{skill}</span>
            ))}
          </div>
        ) : <ProfileComingSoon message="Skills will appear here after you add them to your profile." />}
      </div>
    </ProfileLayout>
  );
}
