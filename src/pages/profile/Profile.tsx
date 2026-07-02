import { Link } from 'react-router-dom';
import { ProfileLayout } from '@/components/profile/ProfileLayout';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileComingSoon } from '@/components/profile/ProfileComingSoon';
import { Award, Code, TrendingUp } from 'lucide-react';
import { useProfileUser } from '@/hooks/useProfileUser';

export default function Profile() {
  const { profile, raw } = useProfileUser();
  const skills = Array.isArray(raw?.skills) ? raw.skills.filter(Boolean) : [];
  const projectsCount = 0;

  return (
    <ProfileLayout>
      <div className="max-w-7xl mx-auto">
        <ProfileHeader profile={profile} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatTile icon={<TrendingUp className="h-5 w-5 text-primary" />} value={profile.totalXp.toLocaleString()} label="Learning Credits" />
              <StatTile icon={<Award className="h-5 w-5 text-primary" />} value={skills.length} label="Skills" />
              <StatTile icon={<Code className="h-5 w-5 text-primary" />} value={projectsCount} label="Projects" />
            </div>

            <Section title="Top Skills" link="/profile/skills">
              {skills.length ? (
                <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-card p-4">
                  {skills.slice(0, 8).map((skill) => (
                    <span key={skill} className="rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary">{skill}</span>
                  ))}
                </div>
              ) : <ProfileComingSoon message="Skills will show here after you add them to your profile." />}
            </Section>

            <Section title="Featured Projects" link="/profile/projects">
              <ProfileComingSoon message="Your real projects will show here when project uploads are available." />
            </Section>

            <Section title="Recent Activity" link="/profile/activity">
              <ProfileComingSoon message="Learning activity will appear here after you complete lessons, quizzes, or tasks." />
            </Section>
          </div>

          <div className="lg:col-span-1">
            <ProfileComingSoon title="AI profile assistant coming soon" message="Personal profile insights will appear here after enough real learning data is collected." />
          </div>
        </div>
      </div>
    </ProfileLayout>
  );
}

function StatTile({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        {icon}
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
