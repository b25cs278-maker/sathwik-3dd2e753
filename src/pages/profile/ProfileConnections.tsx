import { useState } from 'react';
import { ProfileLayout } from '@/components/profile/ProfileLayout';
import { connections } from '@/data/profileMockData';
import { Search, UserPlus, Users } from 'lucide-react';

export default function ProfileConnections() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'all' | 'following' | 'suggested'>('all');
  const following = connections.filter((c) => c.isFollowing);
  const suggested = connections.filter((c) => c.isSuggested);
  const base = tab === 'following' ? following : tab === 'suggested' ? suggested : connections;
  const filtered = base.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <ProfileLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Connections</h1>
          <p className="text-muted-foreground">Build your network</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <Stat label="Total Connections" value={connections.length} accent={false} />
          <Stat label="Following" value={following.length} accent />
          <Stat label="Suggested" value={suggested.length} accent />
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search connections..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex gap-2 mb-8 border-b border-border">
          {(['all', 'following', 'suggested'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 font-medium transition-colors border-b-2 capitalize ${tab === t ? 'text-primary border-primary' : 'text-muted-foreground border-transparent hover:text-foreground'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {filtered.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c) => (
              <div key={c.id} className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                <div className="text-center mb-4">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden mx-auto mb-3 border-2 border-primary/20 bg-muted">
                    <img src={c.avatar} alt={c.name} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <h3 className="font-semibold text-foreground">{c.name}</h3>
                  <p className="text-sm text-muted-foreground">{c.title}</p>
                </div>
                <div className="flex items-center justify-center gap-1 mb-4 px-3 py-2 bg-muted/50 rounded-lg">
                  <Users className="h-4 w-4 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{c.mutualCount}</span> mutual
                  </p>
                </div>
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {c.skills.map((s) => (
                      <span key={s} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">{s}</span>
                    ))}
                  </div>
                </div>
                <button className={`w-full py-2 rounded-lg font-medium transition-colors ${c.isFollowing ? 'bg-muted text-foreground hover:bg-muted/80' : 'bg-primary text-primary-foreground hover:opacity-90'}`}>
                  {c.isFollowing ? 'Following' : c.isSuggested ? 'Connect' : 'Follow'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground">No connections found</p>
          </div>
        )}
      </div>
    </ProfileLayout>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent: boolean }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className={`text-2xl font-bold ${accent ? 'text-primary' : 'text-foreground'}`}>{value}</p>
    </div>
  );
}
