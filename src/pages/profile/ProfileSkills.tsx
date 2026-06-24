import { useState } from 'react';
import { ProfileLayout } from '@/components/profile/ProfileLayout';
import { SkillCard } from '@/components/profile/SkillCard';
import { skills } from '@/data/profileMockData';
import { Plus, Search } from 'lucide-react';

export default function ProfileSkills() {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState<string | null>(null);
  const categories = Array.from(new Set(skills.map((s) => s.category)));
  const filtered = skills.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) && (!cat || s.category === cat)
  );

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
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 font-medium">
            <Plus className="h-5 w-5" /> Add Skill
          </button>
        </div>

        <div className="flex gap-2 mb-8 flex-wrap">
          <button
            onClick={() => setCat(null)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${cat === null ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'}`}
          >
            All Skills
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${cat === c ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => <SkillCard key={s.id} skill={s} />)}
        </div>

        <section className="mt-12 bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Recommended Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {['Kubernetes', 'GraphQL', 'Rust', 'Scala'].map((s) => (
              <div key={s} className="p-3 bg-muted/30 border border-border rounded-lg flex items-center justify-between">
                <span className="font-medium text-foreground">{s}</span>
                <button className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded">Add</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </ProfileLayout>
  );
}
