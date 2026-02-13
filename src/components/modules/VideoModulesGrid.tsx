import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Video, ExternalLink, Download, Search, PlayCircle } from "lucide-react";

interface VideoModule {
  id: string;
  title: string;
  description: string | null;
  youtube_url: string;
  resource_pdf_url: string | null;
  display_order: number;
}

export function VideoModulesGrid() {
  const [modules, setModules] = useState<VideoModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const { data, error } = await supabase
        .from("video_modules")
        .select("id, title, description, youtube_url, resource_pdf_url, display_order")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      setModules(data || []);
    } catch (error) {
      console.error("Error fetching modules:", error);
    } finally {
      setLoading(false);
    }
  };

  const getYoutubeThumbnail = (url: string) => {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/
    );
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
        <p className="text-muted-foreground">Watch video lessons and download resources</p>
      </div>

      {modules.length > 3 && (
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {filteredModules.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((mod, idx) => {
            const thumb = getYoutubeThumbnail(mod.youtube_url);
            return (
              <Card
                key={mod.id}
                variant="eco"
                className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={mod.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Video className="h-12 w-12 text-muted-foreground/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/90 rounded-full p-3 shadow-lg">
                      <PlayCircle className="h-8 w-8 text-destructive" />
                    </div>
                  </div>
                  <Badge className="absolute top-3 left-3 bg-background/80 text-foreground backdrop-blur-sm text-xs">
                    Module {idx + 1}
                  </Badge>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-lg leading-snug">{mod.title}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {mod.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">{mod.description}</p>
                  )}

                  <div className="flex flex-col gap-2 pt-1">
                    <Button
                      className="w-full"
                      onClick={() => window.open(mod.youtube_url, "_blank", "noopener,noreferrer")}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Watch Video
                    </Button>
                    {mod.resource_pdf_url && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => window.open(mod.resource_pdf_url!, "_blank", "noopener,noreferrer")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Resource
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card variant="eco">
          <CardContent className="py-16 text-center">
            <Video className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No modules available</h3>
            <p className="text-muted-foreground">
              {searchQuery ? "No modules match your search." : "Video modules will appear here once added by an admin."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
