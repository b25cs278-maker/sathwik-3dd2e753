import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  User, MapPin, Globe, Linkedin, Github, Briefcase, 
  GraduationCap, Award, Eye, EyeOff, Save, Plus, X
} from "lucide-react";
import { toast } from "sonner";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  cover_image_url?: string;
  headline?: string;
  bio?: string;
  location?: string;
  website?: string;
  linkedin_url?: string;
  github_url?: string;
  skills: string[];
  experience: { title: string; company: string; duration: string }[];
  education: { degree: string; school: string; year: string }[];
  is_visible: boolean;
  profile_views: number;
  points: number;
}

export function NetworkProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfile({
        ...data,
        skills: (data.skills as string[]) || [],
        experience: (data.experience as { title: string; company: string; duration: string }[]) || [],
        education: (data.education as { degree: string; school: string; year: string }[]) || []
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !profile) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          headline: profile.headline,
          bio: profile.bio,
          location: profile.location,
          website: profile.website,
          linkedin_url: profile.linkedin_url,
          github_url: profile.github_url,
          skills: profile.skills,
          experience: profile.experience,
          education: profile.education,
          is_visible: profile.is_visible
        })
        .eq('id', user.id);

      if (error) throw error;
      toast.success("Profile updated!");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (!newSkill.trim() || !profile) return;
    if (profile.skills.includes(newSkill.trim())) {
      toast.error("Skill already added");
      return;
    }
    setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] });
    setNewSkill("");
  };

  const removeSkill = (skill: string) => {
    if (!profile) return;
    setProfile({ ...profile, skills: profile.skills.filter(s => s !== skill) });
  };

  const addExperience = () => {
    if (!profile) return;
    setProfile({
      ...profile,
      experience: [...profile.experience, { title: "", company: "", duration: "" }]
    });
  };

  const updateExperience = (index: number, field: string, value: string) => {
    if (!profile) return;
    const updated = [...profile.experience];
    (updated[index] as any)[field] = value;
    setProfile({ ...profile, experience: updated });
  };

  const removeExperience = (index: number) => {
    if (!profile) return;
    setProfile({
      ...profile,
      experience: profile.experience.filter((_, i) => i !== index)
    });
  };

  const addEducation = () => {
    if (!profile) return;
    setProfile({
      ...profile,
      education: [...profile.education, { degree: "", school: "", year: "" }]
    });
  };

  const updateEducation = (index: number, field: string, value: string) => {
    if (!profile) return;
    const updated = [...profile.education];
    (updated[index] as any)[field] = value;
    setProfile({ ...profile, education: updated });
  };

  const removeEducation = (index: number) => {
    if (!profile) return;
    setProfile({
      ...profile,
      education: profile.education.filter((_, i) => i !== index)
    });
  };

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card variant="eco" className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/30 to-eco-sky/30" />
        <CardContent className="p-6 -mt-16">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback className="text-2xl">{profile.name?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 pt-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{profile.name}</h2>
                  <p className="text-muted-foreground">{profile.headline || 'Add a headline'}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {profile.profile_views} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    {profile.points} points
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card variant="eco">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Full Name</Label>
              <Input
                value={profile.name || ''}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Headline</Label>
              <Input
                value={profile.headline || ''}
                onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                placeholder="e.g. Environmental Science Student"
              />
            </div>
          </div>
          <div>
            <Label>Bio</Label>
            <Textarea
              value={profile.bio || ''}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Tell others about yourself..."
              rows={3}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <Input
                value={profile.location || ''}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                placeholder="City, Country"
              />
            </div>
            <div>
              <Label className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Website
              </Label>
              <Input
                value={profile.website || ''}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Label>
              <Input
                value={profile.linkedin_url || ''}
                onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                placeholder="LinkedIn profile URL"
              />
            </div>
            <div>
              <Label className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                GitHub
              </Label>
              <Input
                value={profile.github_url || ''}
                onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                placeholder="GitHub profile URL"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card variant="eco">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Skills
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, i) => (
              <Badge key={i} variant="secondary" className="pl-3 pr-1 py-1">
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="ml-2 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill"
              onKeyDown={(e) => e.key === 'Enter' && addSkill()}
            />
            <Button onClick={addSkill}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Experience */}
      <Card variant="eco">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Experience
            </span>
            <Button variant="ghost" size="sm" onClick={addExperience}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.experience.map((exp, i) => (
            <div key={i} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Experience {i + 1}</span>
                <Button variant="ghost" size="icon" onClick={() => removeExperience(i)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                <Input
                  value={exp.title}
                  onChange={(e) => updateExperience(i, 'title', e.target.value)}
                  placeholder="Job Title"
                />
                <Input
                  value={exp.company}
                  onChange={(e) => updateExperience(i, 'company', e.target.value)}
                  placeholder="Company"
                />
                <Input
                  value={exp.duration}
                  onChange={(e) => updateExperience(i, 'duration', e.target.value)}
                  placeholder="Duration"
                />
              </div>
            </div>
          ))}
          {profile.experience.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No experience added</p>
          )}
        </CardContent>
      </Card>

      {/* Education */}
      <Card variant="eco">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Education
            </span>
            <Button variant="ghost" size="sm" onClick={addEducation}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.education.map((edu, i) => (
            <div key={i} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Education {i + 1}</span>
                <Button variant="ghost" size="icon" onClick={() => removeEducation(i)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                <Input
                  value={edu.degree}
                  onChange={(e) => updateEducation(i, 'degree', e.target.value)}
                  placeholder="Degree"
                />
                <Input
                  value={edu.school}
                  onChange={(e) => updateEducation(i, 'school', e.target.value)}
                  placeholder="School"
                />
                <Input
                  value={edu.year}
                  onChange={(e) => updateEducation(i, 'year', e.target.value)}
                  placeholder="Year"
                />
              </div>
            </div>
          ))}
          {profile.education.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No education added</p>
          )}
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card variant="eco">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {profile.is_visible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
            Privacy Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Profile Visibility</p>
              <p className="text-sm text-muted-foreground">
                {profile.is_visible 
                  ? "Your profile is visible to other users"
                  : "Your profile is hidden from other users"
                }
              </p>
            </div>
            <Switch
              checked={profile.is_visible}
              onCheckedChange={(checked) => setProfile({ ...profile, is_visible: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </div>
  );
}
