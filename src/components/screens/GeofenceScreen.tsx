import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, AlertTriangle, Shield, Navigation } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Map from '../Map';

interface GeofenceScreenProps {
  onNavigate: (screen: string) => void;
}

const GeofenceScreen: React.FC<GeofenceScreenProps> = ({ onNavigate }) => {
  const { toast } = useToast();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [zones, setZones] = useState([]);

  // Watch user location
  useEffect(() => {
    if (navigator.geolocation) {
      const watcher = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (err) => console.error('Geolocation error:', err),
        { enableHighAccuracy: true, maximumAge: 1000 }
      );

      return () => navigator.geolocation.clearWatch(watcher);
    }
  }, []);

  // Fetch zones from backend
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const res = await fetch('http://localhost:4001/api/danger-zones');
        const data = await res.json();
        const validZones = data.filter(
          (zone) =>
            zone.lat !== undefined &&
            zone.lang !== undefined &&
            !isNaN(zone.lat) &&
            !isNaN(zone.lang)
        );
        setZones(validZones);
      } catch (err) {
        console.error('Error fetching zones:', err);
      }
    };

    fetchZones();
    const interval = setInterval(fetchZones, 5000);
    return () => clearInterval(interval);
  }, []);

  // Helper: check if user is inside a zone
  const isInsideZone = (userLoc: { lat: number; lng: number }, zone: any) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371000; // meters
    const dLat = toRad(zone.lat - userLoc.lat);
    const dLng = toRad(zone.lang - userLoc.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(userLoc.lat)) *
        Math.cos(toRad(zone.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // in meters

    return distance <= (zone.radius || 200);
  };

  const inDangerZone = userLocation
    ? zones.some((zone) => isInsideZone(userLocation, zone))
    : false;

  const handleReportIssue = () => {
    toast({
      title: 'Issue Reported',
      description: 'Thank you for reporting this safety concern.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-foreground mb-2">Maps</h1>
        <p className="text-muted-foreground">Live safety monitoring with danger zones</p>
      </div>

      {/* Safety Map */}
      <Map />

      {/* Danger Alert */}
      {inDangerZone && (
        <Card className="p-6 bg-warning/10 border-warning/20">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-32 h-32 bg-warning/20 rounded-full flex items-center justify-center mx-auto danger-glow">
                <AlertTriangle className="w-16 h-16 text-warning" />
              </div>
              <div className="absolute -top-2 -right-2">
                <div className="w-8 h-8 bg-emergency rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-emergency-foreground" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-warning mb-2">Potential Danger Zone</h2>
              <p className="text-muted-foreground mb-4">
                You are approaching an area inside a danger zone. Please be vigilant.
              </p>
            </div>

            <div className="space-y-2">
              <Button
                variant="mustard"
                className="w-full"
                onClick={() => onNavigate('alerts')}
              >
                I understand the risks
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Nearby Safety Zones */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Nearby Safety Zones</h3>

        <div className="space-y-3">
          {/** Example safety zones, can also be dynamic */}
          <Card className="p-4 bg-safe/10 border-safe/20">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-safe" />
              <div className="flex-1">
                <h4 className="font-medium text-foreground">Safe Zone Alpha</h4>
                <p className="text-sm text-muted-foreground">Emergency services nearby • 0.8 km away</p>
              </div>
              <Button size="sm" variant="outline">
                <Navigation className="w-4 h-4 mr-2" />
                Navigate
              </Button>
            </div>
          </Card>

          <Card className="p-4 bg-safe/10 border-safe/20">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-safe" />
              <div className="flex-1">
                <h4 className="font-medium text-foreground">Community Center</h4>
                <p className="text-sm text-muted-foreground">Well-lit public area • 1.2 km away</p>
              </div>
              <Button size="sm" variant="outline">
                <Navigation className="w-4 h-4 mr-2" />
                Navigate
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Location Sharing */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-primary" />
            <div>
              <h4 className="font-medium text-foreground">Location Sharing</h4>
              <p className="text-sm text-muted-foreground">Share your location with trusted contacts</p>
            </div>
          </div>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            Enable
          </Button>
        </div>
      </Card>

      {/* Report Issue */}
      <Card className="p-4 border-dashed border-2">
        <div className="text-center space-y-3">
          <h4 className="font-medium text-foreground">Report a Safety Issue</h4>
          <p className="text-sm text-muted-foreground">Help keep the community safe by reporting hazards</p>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleReportIssue}
          >
            Report an Issue
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default GeofenceScreen;
