import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, X, Image as ImageIcon } from "lucide-react";

interface PhotoCaptureProps {
  maxPhotos?: number;
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
}

export function PhotoCapture({ maxPhotos = 3, photos, onPhotosChange }: PhotoCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    const newPhotos: string[] = [];
    const remaining = maxPhotos - photos.length;
    
    Array.from(files).slice(0, remaining).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newPhotos.push(e.target.result as string);
            if (newPhotos.length === Math.min(files.length, remaining)) {
              onPhotosChange([...photos, ...newPhotos]);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removePhoto = (index: number) => {
    onPhotosChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Photo preview grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {photos.map((photo, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
              <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => removePhoto(index)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive/90 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-background/80 text-xs font-medium">
                Photo {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      {photos.length < maxPhotos && (
        <Card
          variant="flat"
          className={`border-2 border-dashed transition-colors ${
            dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <CardContent className="flex flex-col items-center justify-center py-8 gap-4">
            <div className="p-4 rounded-full bg-muted">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">
                Drop photos here or click to upload
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {photos.length}/{maxPhotos} photos • JPG, PNG up to 10MB
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  // Mobile camera capture
                  if (fileInputRef.current) {
                    fileInputRef.current.capture = "environment";
                    fileInputRef.current.click();
                  }
                }}
              >
                <Camera className="h-4 w-4 mr-2" />
                Take Photo
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
