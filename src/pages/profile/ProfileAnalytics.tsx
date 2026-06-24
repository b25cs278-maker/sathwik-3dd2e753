import { ProfileLayout } from '@/components/profile/ProfileLayout';
import { analyticsData, aiInsights } from '@/data/profileMockData';
import { TrendingUp, Calendar, Target, Zap } from 'lucide-react';

export default function ProfileAnalytics() {
  const latest = analyticsData.xpHistory[analyticsData.xpHistory.length - 1];
  const totalMinutes = analyticsData.studyTimeByDay.reduce((acc, d) => acc + d.minutes, 0);

  return (
    <ProfileLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Learning Analytics</h1>
          <p className="text-muted-foreground">Track progress and insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Metric icon={<TrendingUp className="h-5 w-5 text-primary" />} value={latest.xp.toLocaleString()} label="Total XP" delta="+8900" />
          <Metric icon={<Calendar className="h-5 w-5 text-primary" />} value={totalMinutes} label="Weekly Study (min)" delta="+45m" />
          <Metric icon={<Target className="h-5 w-5 text-primary" />} value={`${analyticsData.performanceScore}%`} label="Performance" delta="+5%" />
          <Metric icon={<Zap className="h-5 w-5 text-primary" />} value={28} label="Day Streak" delta="+3d" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Panel title="XP Progress">
            {analyticsData.xpHistory.map((p) => (
              <Row key={p.date} label={p.date} value={p.xp.toLocaleString()} pct={(p.xp / latest.xp) * 100} />
            ))}
          </Panel>
          <Panel title="Weekly Study Time">
            {analyticsData.studyTimeByDay.map((d) => (
              <Row key={d.day} label={d.day} value={`${d.minutes}m`} pct={Math.min((d.minutes / 200) * 100, 100)} />
            ))}
          </Panel>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4">Skill Development</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analyticsData.skillProgress.map((s) => (
              <div key={s.skill}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{s.skill}</span>
                  <span className="text-sm text-primary font-bold">{s.progress}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${s.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">AI Insights & Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiInsights.map((i) => (
              <div key={i.id} className="p-4 bg-muted/30 border border-border rounded-lg hover:border-primary/30 transition-colors">
                <div className="flex gap-3">
                  <div className="text-2xl flex-shrink-0">{i.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-1">{i.title}</h3>
                    <p className="text-sm text-muted-foreground">{i.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProfileLayout>
  );
}

function Metric({ icon, value, label, delta }: { icon: React.ReactNode; value: React.ReactNode; label: string; delta: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-2">
        {icon}
        <span className="text-xs text-green-500 font-medium">{delta}</span>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-lg font-bold text-foreground mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Row({ label, value, pct }: { label: string; value: string; pct: number }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-medium text-foreground">{value}</span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
