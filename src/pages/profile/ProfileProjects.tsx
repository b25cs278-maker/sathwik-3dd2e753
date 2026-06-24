import { useState } from 'react';
import { ProfileLayout } from '@/components/profile/ProfileLayout';
import { ProjectCard } from '@/components/profile/ProjectCard';
import { projects } from '@/data/profileMockData';
import { Plus, Search, Grid3x3, List } from 'lucide-react';

export default function ProfileProjects() {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];
  const filtered = projects.filter(
    (p) => p.title.toLowerCase().includes(search.toLowerCase()) && (!cat || cat === 'All' || p.category === cat)
  );

  return (
    <ProfileLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Projects</h1>
          <p className="text-muted-foreground">Your portfolio of work</p>
        </div>

        <div className="flex gap-4 mb-8 flex-wrap items-center">
          <div className="flex-1 relative min-w-[200px]">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            {(['grid', 'list'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setView(m)}
                className={`p-2 rounded-lg transition-colors ${view === m ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'}`}
                aria-label={m}
              >
                {m === 'grid' ? <Grid3x3 className="h-5 w-5" /> : <List className="h-5 w-5" />}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 font-medium">
            <Plus className="h-5 w-5" /> New Project
          </button>
        </div>

        <div className="flex gap-2 mb-8 flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c === 'All' ? null : c)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${cat === (c === 'All' ? null : c) ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filtered.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>

        {!filtered.length && <div className="text-center py-12 text-muted-foreground">No projects found</div>}
      </div>
    </ProfileLayout>
  );
}
