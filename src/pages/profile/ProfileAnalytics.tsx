import { ProfileLayout } from '@/components/profile/ProfileLayout';
import { ProfileComingSoon } from '@/components/profile/ProfileComingSoon';
import { useProfileUser } from '@/hooks/useProfileUser';
import { TrendingUp, Award } from 'lucide-react';

export default function ProfileAnalytics() {
  const { profile, raw } = useProfileUser();
  const skillsCount = Array.isArray(raw?.skills) ? raw.skills.length : 0;

  return (
    <ProfileLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Learning Analytics</h1>
          <p className="text-muted-foreground">Track progress and insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Metric icon={<TrendingUp className="h-5 w-5 text-primary" />} value={profile.totalXp.toLocaleString()} label="Learning Credits" />
          <Metric icon={<Award className="h-5 w-5 text-primary" />} value={skillsCount} label="Profile Skills" />
        </div>

        <ProfileComingSoon message="Detailed analytics will appear here after enough real learning activity is collected." />
      </div>
    </ProfileLayout>
  );
}

function Metric({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-2">
        {icon}
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
