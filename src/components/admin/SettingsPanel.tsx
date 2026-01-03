import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Settings, Lock, RefreshCw, FileText, Save
} from "lucide-react";
import { toast } from "sonner";

interface AppSettings {
  appName: string;
  defaultLanguage: string;
  requireLocation: boolean;
  offlineMode: boolean;
  autoApprove: boolean;
  minSubmissionScore: number;
  termsOfService: string;
  privacyPolicy: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  appName: "EcoLearn",
  defaultLanguage: "en",
  requireLocation: true,
  offlineMode: true,
  autoApprove: false,
  minSubmissionScore: 70,
  termsOfService: "",
  privacyPolicy: ""
};

export function SettingsPanel() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('key, value')
        .in('key', ['general', 'features', 'policies']);

      if (error) throw error;

      if (data && data.length > 0) {
        const settingsMap: Record<string, any> = {};
        data.forEach(item => {
          settingsMap[item.key] = item.value;
        });

        setSettings({
          appName: settingsMap.general?.appName || DEFAULT_SETTINGS.appName,
          defaultLanguage: settingsMap.general?.defaultLanguage || DEFAULT_SETTINGS.defaultLanguage,
          requireLocation: settingsMap.features?.requireLocation ?? DEFAULT_SETTINGS.requireLocation,
          offlineMode: settingsMap.features?.offlineMode ?? DEFAULT_SETTINGS.offlineMode,
          autoApprove: settingsMap.features?.autoApprove ?? DEFAULT_SETTINGS.autoApprove,
          minSubmissionScore: settingsMap.features?.minSubmissionScore || DEFAULT_SETTINGS.minSubmissionScore,
          termsOfService: settingsMap.policies?.termsOfService || DEFAULT_SETTINGS.termsOfService,
          privacyPolicy: settingsMap.policies?.privacyPolicy || DEFAULT_SETTINGS.privacyPolicy
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const settingsToSave = [
        {
          key: 'general',
          value: {
            appName: settings.appName,
            defaultLanguage: settings.defaultLanguage
          },
          updated_at: new Date().toISOString(),
          updated_by: user?.id
        },
        {
          key: 'features',
          value: {
            requireLocation: settings.requireLocation,
            offlineMode: settings.offlineMode,
            autoApprove: settings.autoApprove,
            minSubmissionScore: settings.minSubmissionScore
          },
          updated_at: new Date().toISOString(),
          updated_by: user?.id
        },
        {
          key: 'policies',
          value: {
            termsOfService: settings.termsOfService,
            privacyPolicy: settings.privacyPolicy
          },
          updated_at: new Date().toISOString(),
          updated_by: user?.id
        }
      ];

      for (const setting of settingsToSave) {
        const { error } = await supabase
          .from('app_settings')
          .upsert(setting, { onConflict: 'key' });

        if (error) throw error;
      }

      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">System Settings</h2>
          <p className="text-muted-foreground">Configure application behavior and policies</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card variant="eco">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">App Name</label>
              <Input
                value={settings.appName}
                onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Default Language</label>
              <Select 
                value={settings.defaultLanguage} 
                onValueChange={(v) => setSettings({ ...settings, defaultLanguage: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Feature Toggles */}
        <Card variant="eco">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Feature Toggles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Require Location</p>
                <p className="text-sm text-muted-foreground">GPS required for task submissions</p>
              </div>
              <Switch
                checked={settings.requireLocation}
                onCheckedChange={(v) => setSettings({ ...settings, requireLocation: v })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Offline Mode</p>
                <p className="text-sm text-muted-foreground">Allow offline task drafts</p>
              </div>
              <Switch
                checked={settings.offlineMode}
                onCheckedChange={(v) => setSettings({ ...settings, offlineMode: v })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-Approve High Scores</p>
                <p className="text-sm text-muted-foreground">Auto-approve AI score above threshold</p>
              </div>
              <Switch
                checked={settings.autoApprove}
                onCheckedChange={(v) => setSettings({ ...settings, autoApprove: v })}
              />
            </div>

            {settings.autoApprove && (
              <div>
                <label className="text-sm font-medium mb-2 block">Minimum AI Score for Auto-Approve</label>
                <Input
                  type="number"
                  value={settings.minSubmissionScore}
                  onChange={(e) => setSettings({ ...settings, minSubmissionScore: parseInt(e.target.value) || 70 })}
                  min={50}
                  max={100}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Policies */}
        <Card variant="eco" className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Policies & Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Terms of Service</label>
              <Textarea
                value={settings.termsOfService}
                onChange={(e) => setSettings({ ...settings, termsOfService: e.target.value })}
                rows={3}
                placeholder="Enter your terms of service..."
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Privacy Policy</label>
              <Textarea
                value={settings.privacyPolicy}
                onChange={(e) => setSettings({ ...settings, privacyPolicy: e.target.value })}
                rows={3}
                placeholder="Enter your privacy policy..."
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}