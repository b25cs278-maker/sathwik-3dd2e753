import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CollapsibleCard, 
  CollapsibleCardHeader, 
  CollapsibleCardContent 
} from "@/components/ui/collapsible-card";
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
  Settings, Lock, RefreshCw, FileText, Save, Globe, Zap, Shield
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

      <div className="space-y-6">
        {/* General Settings - Collapsible */}
        <CollapsibleCard defaultOpen>
          <CollapsibleCardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">General Settings</h3>
                <p className="text-sm text-muted-foreground">App name and language preferences</p>
              </div>
            </div>
          </CollapsibleCardHeader>
          <CollapsibleCardContent>
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-sm font-medium mb-2 block">App Name</label>
                <Input
                  value={settings.appName}
                  onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Default Language</label>
                <Select 
                  value={settings.defaultLanguage} 
                  onValueChange={(v) => setSettings({ ...settings, defaultLanguage: v })}
                >
                  <SelectTrigger onClick={(e) => e.stopPropagation()}>
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
            </div>
          </CollapsibleCardContent>
        </CollapsibleCard>

        {/* Feature Toggles - Collapsible */}
        <CollapsibleCard>
          <CollapsibleCardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-eco-sky/10">
                <Zap className="h-5 w-5 text-eco-sky" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Feature Toggles</h3>
                <p className="text-sm text-muted-foreground">Control platform features and behaviors</p>
              </div>
            </div>
          </CollapsibleCardHeader>
          <CollapsibleCardContent>
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">Require Location</p>
                  <p className="text-sm text-muted-foreground">GPS required for task submissions</p>
                </div>
                <Switch
                  checked={settings.requireLocation}
                  onCheckedChange={(v) => setSettings({ ...settings, requireLocation: v })}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">Offline Mode</p>
                  <p className="text-sm text-muted-foreground">Allow offline task drafts</p>
                </div>
                <Switch
                  checked={settings.offlineMode}
                  onCheckedChange={(v) => setSettings({ ...settings, offlineMode: v })}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">Auto-Approve High Scores</p>
                  <p className="text-sm text-muted-foreground">Auto-approve AI score above threshold</p>
                </div>
                <Switch
                  checked={settings.autoApprove}
                  onCheckedChange={(v) => setSettings({ ...settings, autoApprove: v })}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {settings.autoApprove && (
                <div className="ml-4 pl-4 border-l-2 border-primary/20">
                  <label className="text-sm font-medium mb-2 block">Minimum AI Score for Auto-Approve</label>
                  <Input
                    type="number"
                    value={settings.minSubmissionScore}
                    onChange={(e) => setSettings({ ...settings, minSubmissionScore: parseInt(e.target.value) || 70 })}
                    onClick={(e) => e.stopPropagation()}
                    min={50}
                    max={100}
                  />
                </div>
              )}
            </div>
          </CollapsibleCardContent>
        </CollapsibleCard>

        {/* Security Settings - Collapsible */}
        <CollapsibleCard>
          <CollapsibleCardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-eco-sun/10">
                <Shield className="h-5 w-5 text-eco-sun" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Security & Privacy</h3>
                <p className="text-sm text-muted-foreground">Access controls and data protection</p>
              </div>
            </div>
          </CollapsibleCardHeader>
          <CollapsibleCardContent>
            <div className="space-y-4 pt-2">
              <p className="text-sm text-muted-foreground">
                Security settings are managed through the Access & Security panel.
                Configure user permissions, audit logs, and data protection settings there.
              </p>
            </div>
          </CollapsibleCardContent>
        </CollapsibleCard>

        {/* Policies - Collapsible */}
        <CollapsibleCard>
          <CollapsibleCardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Policies & Terms</h3>
                <p className="text-sm text-muted-foreground">Legal documents and user agreements</p>
              </div>
            </div>
          </CollapsibleCardHeader>
          <CollapsibleCardContent>
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-sm font-medium mb-2 block">Terms of Service</label>
                <Textarea
                  value={settings.termsOfService}
                  onChange={(e) => setSettings({ ...settings, termsOfService: e.target.value })}
                  onClick={(e) => e.stopPropagation()}
                  rows={3}
                  placeholder="Enter your terms of service..."
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Privacy Policy</label>
                <Textarea
                  value={settings.privacyPolicy}
                  onChange={(e) => setSettings({ ...settings, privacyPolicy: e.target.value })}
                  onClick={(e) => e.stopPropagation()}
                  rows={3}
                  placeholder="Enter your privacy policy..."
                />
              </div>
            </div>
          </CollapsibleCardContent>
        </CollapsibleCard>
      </div>
    </div>
  );
}