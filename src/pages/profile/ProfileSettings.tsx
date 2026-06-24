import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileLayout } from '@/components/profile/ProfileLayout';
import { Lock, Bell, Eye, Trash2, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileUser } from '@/hooks/useProfileUser';

export default function ProfileSettings() {
  const { signOut } = useAuth();
  const { email } = useProfileUser();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    profileVisibility: 'public',
    activityVisibility: 'connections',
  });
  const toggle = (k: keyof typeof settings) => setSettings((p) => ({ ...p, [k]: !p[k as keyof typeof settings] }));

  return (
    <ProfileLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <Section title="Account" icon={<Lock className="h-5 w-5" />}>
          <Field label="Email Address">
            <input type="email" defaultValue={email || ''} disabled className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground" />
          </Field>
          <Field label="Password">
            <button onClick={() => navigate('/forgot-password')} className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 text-sm font-medium">
              Reset Password
            </button>
          </Field>
        </Section>

        <Section title="Privacy" icon={<Eye className="h-5 w-5" />}>
          <Field label="Profile Visibility">
            <select value={settings.profileVisibility} onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })} className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground">
              <option value="public">Public</option>
              <option value="connections">Connections Only</option>
              <option value="private">Private</option>
            </select>
          </Field>
          <Field label="Activity Visibility">
            <select value={settings.activityVisibility} onChange={(e) => setSettings({ ...settings, activityVisibility: e.target.value })} className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground">
              <option value="everyone">Everyone</option>
              <option value="connections">Connections Only</option>
              <option value="private">Private</option>
            </select>
          </Field>
        </Section>

        <Section title="Notifications" icon={<Bell className="h-5 w-5" />}>
          <Toggle label="Email Notifications" sub="Receive emails about your activity" on={settings.emailNotifications} onChange={() => toggle('emailNotifications')} />
          <Toggle label="Push Notifications" sub="Receive notifications on your device" on={settings.pushNotifications} onChange={() => toggle('pushNotifications')} />
          <Toggle label="Weekly Digest" sub="Summary of your weekly progress" on={settings.weeklyDigest} onChange={() => toggle('weeklyDigest')} />
        </Section>

        <section className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-destructive mb-4 flex items-center gap-2">
            <Trash2 className="h-5 w-5" /> Danger Zone
          </h2>
          <p className="text-sm text-foreground font-medium mb-2">Delete Account</p>
          <p className="text-xs text-muted-foreground mb-3">Permanently delete your account and all data.</p>
          <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 text-sm font-medium">Delete Account</button>
        </section>

        <div className="flex justify-end">
          <button
            onClick={async () => { await signOut(); navigate('/'); }}
            className="flex items-center gap-2 px-6 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 font-medium"
          >
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </div>
    </ProfileLayout>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="bg-card border border-border rounded-lg p-6 mb-6">
      <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">{icon} {title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, sub, on, onChange }: { label: string; sub: string; on: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
      <button onClick={onChange} className={`relative h-6 w-11 rounded-full transition-colors ${on ? 'bg-primary' : 'bg-muted'}`} aria-pressed={on}>
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${on ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}
