import { Link } from 'react-router-dom';
import { ProfileLayout } from '@/components/profile/ProfileLayout';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { SkillCard } from '@/components/profile/SkillCard';
import { ProjectCard } from '@/components/profile/ProjectCard';
import { AIChatPanel } from '@/components/profile/AIChatPanel';
import { skills, projects, activityFeed, aiInsights } from '@/data/profileMockData';
import { Award, Code, TrendingUp } from 'lucide-react';
import { useProfileUser } from '@/hooks/useProfileUser';

export default function Profile() {
  const { profile } = useProfileUser();
  const topSkills = skills.slice(0, 6);
  const featuredProjects = projects.slice(0, 3);
  const recentActivity = activityFeed.slice(0, 5);

  return (
    <ProfileLayout>
      <div className="max-w-7xl mx-auto">
        <ProfileHeader profile={profile} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatTile icon={<TrendingUp className="h-5 w-5 text-primary" />} value={profile.totalXp.toLocaleString()} label="Total XP" delta="+12%" />
              <StatTile icon={<Award className="h-5 w-5 text-primary" />} value={skills.length} label="Skills" delta="+2" />
              <StatTile icon={<Code className="h-5 w-5 text-primary" />} value={projects.length} label="Projects" delta="+1" />
            </div>

            <Section title="Top Skills" link="/profile/skills">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {topSkills.map((s) => <SkillCard key={s.id} skill={s} />)}
              </div>
            </Section>

            <Section title="Featured Projects" link="/profile/projects">
              <div className="grid gap-4">
                {featuredProjects.map((p) => <ProjectCard key={p.id} project={p} />)}
              </div>
            </Section>

            <Section title="Recent Activity" link="/profile/activity">
              <div className="bg-card border border-border rounded-lg divide-y divide-border">
                {recentActivity.map((a) => (
                  <div key={a.id} className="p-4 hover:bg-muted/20 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="text-2xl">🎯</div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{a.title}</h3>
                        {a.description && <p className="text-sm text-muted-foreground mt-1">{a.description}</p>}
                        <p className="text-xs text-muted-foreground mt-2">{a.timestamp.toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </div>

          <div className="lg:col-span-1">
            <AIChatPanel insights={aiInsights} />
          </div>
        </div>
      </div>
    </ProfileLayout>
  );
}

function StatTile({ icon, value, label, delta }: { icon: React.ReactNode; value: React.ReactNode; label: string; delta: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        {icon}
        <span className="text-xs text-green-500 font-medium">{delta}</span>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function Section({ title, link, children }: { title: string; link: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <Link to={link} className="text-sm text-primary hover:text-primary/80">View All →</Link>
      </div>
      {children}
    </section>
  );
}
