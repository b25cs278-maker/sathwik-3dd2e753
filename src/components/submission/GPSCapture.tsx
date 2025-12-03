import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

interface GPSCaptureProps {
  onLocationCapture: (lat: number, lng: number, accuracy: number) => void;
  requiredLocation?: { lat: number; lng: number; radiusM: number };
  currentLocation?: { lat: number; lng: number; accuracy: number } | null;
}

export function GPSCapture({ onLocationCapture, requiredLocation, currentLocation }: GPSCaptureProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationCapture(
          position.coords.latitude,
          position.coords.longitude,
          position.coords.accuracy
        );
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const isWithinRange = currentLocation && requiredLocation
    ? calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        requiredLocation.lat,
        requiredLocation.lng
      ) <= requiredLocation.radiusM
    : null;

  return (
    <Card variant="flat" className="border-2 border-dashed border-border">
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4">
          <div className={`p-4 rounded-full ${currentLocation ? 'bg-eco-leaf/10' : 'bg-muted'}`}>
            <MapPin className={`h-8 w-8 ${currentLocation ? 'text-eco-leaf' : 'text-muted-foreground'}`} />
          </div>

          {currentLocation ? (
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-eco-leaf" />
                <span className="font-medium text-foreground">Location Captured</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
              </p>
              <Badge variant={currentLocation.accuracy < 50 ? "success" : "warning"}>
                Accuracy: ±{Math.round(currentLocation.accuracy)}m
              </Badge>
              
              {requiredLocation && (
                <div className="mt-3">
                  {isWithinRange ? (
                    <Badge variant="success">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Within required area
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Outside required area ({Math.round(calculateDistance(
                        currentLocation.lat,
                        currentLocation.lng,
                        requiredLocation.lat,
                        requiredLocation.lng
                      ))}m away)
                    </Badge>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-2">
              <p className="font-medium text-foreground">Capture Your Location</p>
              <p className="text-sm text-muted-foreground">
                We need your GPS location to verify task completion
              </p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <Button
            variant={currentLocation ? "outline" : "default"}
            onClick={captureLocation}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Navigation className="h-4 w-4 mr-2" />
            )}
            {currentLocation ? "Update Location" : "Get My Location"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
