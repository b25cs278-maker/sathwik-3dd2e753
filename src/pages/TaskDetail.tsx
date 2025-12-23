import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  MapPin, Clock, Star, Camera, Upload, X, 
  CheckCircle2, AlertTriangle, Loader2, ArrowLeft
} from "lucide-react";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  points: number;
  location_required: boolean;
  location_lat: number | null;
  location_lng: number | null;
  location_radius_m: number | null;
  estimated_time: string | null;
  image_url: string | null;
  instructions: any;
  requirements: any;
}

interface Photo {
  file: File;
  preview: string;
}

export default function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [notes, setNotes] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTask();
    }
  }, [id]);

  const fetchTask = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        toast.error('Task not found');
        navigate('/tasks');
        return;
      }
      setTask(data);
    } catch (error) {
      console.error('Error fetching task:', error);
      toast.error('Failed to load task');
      navigate('/tasks');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPhotos: Photo[] = [];
    for (let i = 0; i < files.length && photos.length + newPhotos.length < 5; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        newPhotos.push({
          file,
          preview: URL.createObjectURL(file)
        });
      }
    }
    setPhotos([...photos, ...newPhotos]);
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    URL.revokeObjectURL(newPhotos[index].preview);
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setGettingLocation(false);
        toast.success('Location captured successfully');
      },
      (error) => {
        setGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location permission denied. Please enable location access.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out.');
            break;
          default:
            setLocationError('An error occurred getting your location.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please log in to submit evidence');
      navigate('/login');
      return;
    }

    if (!task) return;

    if (photos.length === 0) {
      toast.error('Please upload at least one photo');
      return;
    }

    if (task.location_required && !location) {
      toast.error('This task requires GPS location');
      return;
    }

    setSubmitting(true);

    try {
      // Upload photos to storage
      const photoUrls: string[] = [];
      for (const photo of photos) {
        const fileName = `${user.id}/${task.id}/${Date.now()}-${photo.file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('my-bucket-green')
          .upload(fileName, photo.file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('my-bucket-green')
          .getPublicUrl(fileName);

        photoUrls.push(urlData.publicUrl);
      }

      // Create submission
      const { data: submission, error: submitError } = await supabase
        .from('task_submissions')
        .insert({
          task_id: task.id,
          user_id: user.id,
          photos: photoUrls,
          location_lat: location?.lat || null,
          location_lng: location?.lng || null,
          metadata: {
            notes,
            submitted_at: new Date().toISOString(),
            user_agent: navigator.userAgent
          }
        })
        .select()
        .single();

      if (submitError) throw submitError;

      // Trigger AI verification
      try {
        await supabase.functions.invoke('verify-photo', {
          body: {
            submission_id: submission.id,
            task_id: task.id,
            photos: photoUrls,
            lat: location?.lat,
            lng: location?.lng,
            task_description: task.description,
            task_category: task.category,
            task_location_lat: task.location_lat,
            task_location_lng: task.location_lng,
            task_location_radius_m: task.location_radius_m
          }
        });
      } catch (verifyError) {
        console.error('AI verification error:', verifyError);
        // Continue even if verification fails - admin can review manually
      }

      toast.success('Evidence submitted successfully! It will be reviewed shortly.');
      navigate('/dashboard');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit evidence. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-12">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (!task) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8 max-w-4xl">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate('/tasks')} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tasks
        </Button>

        {/* Task Header */}
        <Card variant="eco" className="mb-8 overflow-hidden">
          {task.image_url && (
            <div className="aspect-video overflow-hidden bg-muted">
              <img
                src={task.image_url}
                alt={task.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="capitalize">{task.category}</Badge>
                  <Badge variant={task.difficulty === 'easy' ? 'default' : task.difficulty === 'hard' ? 'destructive' : 'secondary'}>
                    {task.difficulty}
                  </Badge>
                </div>
                <h1 className="text-2xl font-display font-bold text-foreground">
                  {task.title}
                </h1>
              </div>
              <div className="flex items-center gap-1 text-2xl font-bold text-eco-sun">
                <Star className="h-6 w-6" />
                <span>{task.points}</span>
              </div>
            </div>

            <p className="text-muted-foreground mb-4">{task.description}</p>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {task.location_required && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>GPS Required</span>
                </div>
              )}
              {task.estimated_time && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{task.estimated_time}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        {task.instructions && task.instructions.length > 0 && (
          <Card variant="eco" className="mb-6">
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2">
                {task.instructions.map((instruction: any, index: number) => (
                  <li key={index} className="text-muted-foreground">
                    {typeof instruction === 'string' ? instruction : instruction.text}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        )}

        {/* Submit Evidence */}
        <Card variant="eco">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Submit Evidence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Photos (up to 5)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                {photos.map((photo, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={photo.preview}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-destructive-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {photos.length < 5 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center gap-2 transition-colors"
                  >
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Add Photo</span>
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                capture="environment"
                onChange={handlePhotoSelect}
                className="hidden"
              />
            </div>

            {/* GPS Location */}
            {task.location_required && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  GPS Location <span className="text-destructive">*</span>
                </label>
                {location ? (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 text-primary">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-sm">
                      Location captured: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                    </span>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={getLocation}
                    disabled={gettingLocation}
                    className="w-full"
                  >
                    {gettingLocation ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Getting Location...
                      </>
                    ) : (
                      <>
                        <MapPin className="h-4 w-4 mr-2" />
                        Capture GPS Location
                      </>
                    )}
                  </Button>
                )}
                {locationError && (
                  <div className="flex items-center gap-2 mt-2 p-3 rounded-lg bg-destructive/10 text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">{locationError}</span>
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Additional Notes (optional)
              </label>
              <Textarea
                placeholder="Add any additional context about your submission..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <Button
              variant="hero"
              size="lg"
              className="w-full"
              onClick={handleSubmit}
              disabled={submitting || photos.length === 0 || (task.location_required && !location)}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Submit Evidence
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Your submission will be reviewed. Points will be awarded upon approval.
            </p>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}