import { useEffect, useState } from 'react';
import { ProfileLayout } from '@/components/profile/ProfileLayout';
import { Save, Check, AlertCircle } from 'lucide-react';
import { useProfileUser } from '@/hooks/useProfileUser';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function ProfileEdit() {
  const { profile, userId, loading } = useProfileUser();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    displayName: '',
    tagline: '',
    bio: '',
    avatar: '',
    coverImage: '',
  });

  useEffect(() => {
    if (!loading) {
      setFormData({
        displayName: profile.displayName,
        tagline: profile.tagline,
        bio: profile.bio,
        avatar: profile.avatar,
        coverImage: profile.coverImage,
      });
    }
  }, [loading, profile]);

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    setError(null);
    const { error: err } = await supabase
      .from('profiles')
      .update({
        name: formData.displayName,
        avatar_url: formData.avatar,
      } as any)
      .eq('id', userId);
    setSaving(false);
    if (err) {
      setError(err.message);
      toast.error('Failed to save profile');
    } else {
      setSaved(true);
      toast.success('Profile updated');
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <ProfileLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Edit Profile</h1>
          <p className="text-muted-foreground">Update your profile information</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive mb-6">
            <AlertCircle className="h-5 w-5" /> {error}
          </div>
        )}

        <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Cover Image URL</h2>
            <input
              type="url"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {formData.coverImage && (
              <div className="relative h-32 mt-4 rounded-lg overflow-hidden bg-muted">
                <img src={formData.coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Profile Picture URL</h2>
            <div className="flex items-end gap-6">
              <div className="relative h-24 w-24 rounded-lg overflow-hidden border-2 border-border bg-muted">
                {formData.avatar && (
                  <img src={formData.avatar} alt="Avatar" className="absolute inset-0 w-full h-full object-cover" />
                )}
              </div>
              <input
                type="url"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="flex-1 px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Basic Information</h2>
            <div className="space-y-4">
              <Field label="Full Name">
                <input type="text" value={formData.displayName} onChange={(e) => setFormData({ ...formData, displayName: e.target.value })} className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </Field>
              <Field label="Tagline">
                <input type="text" value={formData.tagline} onChange={(e) => setFormData({ ...formData, tagline: e.target.value })} className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </Field>
              <Field label="Bio">
                <textarea rows={5} maxLength={500} value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                <p className="text-xs text-muted-foreground mt-2">{formData.bio.length}/500 characters</p>
              </Field>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button type="button" className="px-6 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors font-medium">Cancel</button>
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50">
              {saved ? <><Check className="h-5 w-5" /> Saved!</> : saving ? 'Saving...' : <><Save className="h-5 w-5" /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </ProfileLayout>
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
