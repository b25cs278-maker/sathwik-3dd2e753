import { Link, useParams } from 'react-router-dom';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { SkillCard } from '@/components/profile/SkillCard';
import { ProjectCard } from '@/components/profile/ProjectCard';
import { skills, projects, currentUser } from '@/data/profileMockData';
import { Share2, QrCode } from 'lucide-react';

export default function ProfilePublic() {
  const { username } = useParams();
  // Currently shows demo profile for any username — replace with Supabase lookup later
  const profile = { ...currentUser, username: username || currentUser.username, displayName: username || currentUser.displayName };
  const topSkills = skills.slice(0, 4);
  const featured = projects.slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link to="/" className="font-bold text-foreground">NexusCraft</Link>
          <div className="flex gap-2">
            <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg" aria-label="Share">
              <Share2 className="h-5 w-5" />
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg" aria-label="QR">
              <QrCode className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-12">
        <ProfileHeader profile={profile} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">About</h2>
              <div className="bg-card border border-border rounded-lg p-6">
                <p className="text-foreground leading-relaxed">{profile.bio}</p>
              </div>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">Top Skills</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {topSkills.map((s) => <SkillCard key={s.id} skill={s} />)}
              </div>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">Featured Work</h2>
              <div className="space-y-4">
                {featured.map((p) => <ProjectCard key={p.id} project={p} />)}
              </div>
            </section>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-20 space-y-4">
              <button className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 font-medium">Follow</button>
              <button className="w-full px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 font-medium">Send Message</button>
              <div className="pt-4 border-t border-border space-y-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Member Since</p>
                  <p className="font-medium text-foreground">{profile.joinDate.toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
