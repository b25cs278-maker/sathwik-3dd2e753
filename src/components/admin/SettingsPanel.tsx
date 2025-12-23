import { useState } from "react";
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
  Settings, Globe, Lock, Wifi, RefreshCw, FileText, Save
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

export function SettingsPanel() {
  const [settings, setSettings] = useState<AppSettings>({
    appName: "EcoLearn",
    defaultLanguage: "en",
    requireLocation: true,
    offlineMode: true,
    autoApprove: false,
    minSubmissionScore: 70,
    termsOfService: "Users must agree to complete tasks honestly and submit genuine proof.",
    privacyPolicy: "We collect minimal data required for app functionality."
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Settings saved successfully');
    setSaving(false);
  };

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
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Privacy Policy</label>
              <Textarea
                value={settings.privacyPolicy}
                onChange={(e) => setSettings({ ...settings, privacyPolicy: e.target.value })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
