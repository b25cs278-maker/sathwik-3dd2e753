import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus, Edit, Trash2, Search, Video, ExternalLink, FileText, Upload, GripVertical
} from "lucide-react";
import { toast } from "sonner";

interface VideoModule {
  id: string;
  title: string;
  description: string | null;
  youtube_url: string;
  resource_pdf_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export function VideoModuleManagement() {
  const { user } = useAuth();
  const [modules, setModules] = useState<VideoModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<VideoModule | null>(null);
  const [processing, setProcessing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    youtube_url: "",
    resource_pdf_url: "",
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const { data, error } = await supabase
        .from("video_modules")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setModules(data || []);
    } catch (error) {
      console.error("Error fetching modules:", error);
      toast.error("Failed to load video modules");
    } finally {
      setLoading(false);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error("File size must be under 20MB");
      return;
    }

    setUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { error: uploadError } = await supabase.storage
        .from("module-resources")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("module-resources")
        .getPublicUrl(fileName);

      setFormData((prev) => ({ ...prev, resource_pdf_url: urlData.publicUrl }));
      toast.success("PDF uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload PDF");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("Module title is required");
      return;
    }
    if (!formData.youtube_url.trim()) {
      toast.error("YouTube URL is required");
      return;
    }

    setProcessing(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description || null,
        youtube_url: formData.youtube_url,
        resource_pdf_url: formData.resource_pdf_url || null,
        display_order: formData.display_order,
        is_active: formData.is_active,
      };

      if (editingModule) {
        const { error } = await supabase
          .from("video_modules")
          .update(payload)
          .eq("id", editingModule.id);
        if (error) throw error;
        toast.success("Module updated");
      } else {
        const { error } = await supabase
          .from("video_modules")
          .insert({ ...payload, created_by: user!.id });
        if (error) throw error;
        toast.success("Module created");
      }

      setDialogOpen(false);
      resetForm();
      fetchModules();
    } catch (error) {
      console.error("Error saving module:", error);
      toast.error("Failed to save module");
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this video module?")) return;
    try {
      const { error } = await supabase.from("video_modules").delete().eq("id", id);
      if (error) throw error;
      toast.success("Module deleted");
      fetchModules();
    } catch (error) {
      console.error("Error deleting module:", error);
      toast.error("Failed to delete module");
    }
  };

  const handleToggleActive = async (mod: VideoModule) => {
    try {
      const { error } = await supabase
        .from("video_modules")
        .update({ is_active: !mod.is_active })
        .eq("id", mod.id);
      if (error) throw error;
      toast.success(mod.is_active ? "Module deactivated" : "Module activated");
      fetchModules();
    } catch (error) {
      console.error("Error toggling module:", error);
      toast.error("Failed to update module");
    }
  };

  const openEditDialog = (mod: VideoModule) => {
    setEditingModule(mod);
    setFormData({
      title: mod.title,
      description: mod.description || "",
      youtube_url: mod.youtube_url,
      resource_pdf_url: mod.resource_pdf_url || "",
      display_order: mod.display_order,
      is_active: mod.is_active,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingModule(null);
    setFormData({
      title: "",
      description: "",
      youtube_url: "",
      resource_pdf_url: "",
      display_order: modules.length,
      is_active: true,
    });
  };

  const getYoutubeThumbnail = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/);
    return match ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : null;
  };

  const filteredModules = modules.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Video Modules</h2>
        <p className="text-muted-foreground">Manage video learning modules with YouTube links and resource PDFs</p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Module
        </Button>
      </div>

      {filteredModules.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModules.map((mod) => {
            const thumb = getYoutubeThumbnail(mod.youtube_url);
            return (
              <Card key={mod.id} variant="eco" className={!mod.is_active ? "opacity-60" : ""}>
                {thumb && (
                  <div className="relative aspect-video overflow-hidden rounded-t-xl">
                    <img src={thumb} alt={mod.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="bg-white/90 rounded-full p-3">
                        <Video className="h-6 w-6 text-destructive" />
                      </div>
                    </div>
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{mod.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          <GripVertical className="h-3 w-3 mr-1" /> #{mod.display_order + 1}
                        </Badge>
                        {mod.resource_pdf_url && (
                          <Badge variant="secondary" className="text-xs">
                            <FileText className="h-3 w-3 mr-1" /> PDF
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(mod)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(mod.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {mod.description || "No description"}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <a href={mod.youtube_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" /> Preview
                    </a>
                    <Switch checked={mod.is_active} onCheckedChange={() => handleToggleActive(mod)} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card variant="eco">
          <CardContent className="py-12 text-center">
            <Video className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No video modules yet. Add your first module.</p>
          </CardContent>
        </Card>
      )}

      {/* Module Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingModule ? "Edit Module" : "Create Module"}</DialogTitle>
            <DialogDescription>Configure video module details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Introduction to AI"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Brief description of the module content..."
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">YouTube URL *</label>
              <Input
                value={formData.youtube_url}
                onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
              />
              {formData.youtube_url && getYoutubeThumbnail(formData.youtube_url) && (
                <div className="mt-2 rounded-lg overflow-hidden border border-border">
                  <img
                    src={getYoutubeThumbnail(formData.youtube_url)!}
                    alt="Video thumbnail"
                    className="w-full h-32 object-cover"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Resource PDF</label>
              {formData.resource_pdf_url ? (
                <div className="flex items-center gap-2 p-3 border border-border rounded-lg bg-muted/30">
                  <FileText className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-sm truncate flex-1">PDF uploaded</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFormData({ ...formData, resource_pdf_url: "" })}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={handlePdfUpload}
                    disabled={uploading}
                    className="cursor-pointer"
                  />
                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Display Order</label>
                <Input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  min={0}
                />
              </div>
              <div className="flex items-end pb-1">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium">Active</label>
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(v) => setFormData({ ...formData, is_active: v })}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={processing || uploading}>
              {processing ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
