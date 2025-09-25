import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SafetyLogo from '../SafetyLogo';
import AlertCard, { Alert } from '../AlertCard';
import { MapPin, Shield, Phone, Users } from 'lucide-react';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [zones, setZones] = useState([]);
  const [inDangerZone, setInDangerZone] = useState(false);

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
    const distance = R * c;

    return distance <= (zone.radius || 200);
  };

  // Update danger zone state
  useEffect(() => {
    if (userLocation && zones.length > 0) {
      const inside = zones.some((zone) => isInsideZone(userLocation, zone));
      setInDangerZone(inside);
    } else {
      setInDangerZone(false);
    }
  }, [userLocation, zones]);

  const quickActions = [
    {
      id: 'emergency',
      title: 'Emergency SOS',
      description: 'Press for immediate help',
      icon: Shield,
      color: 'bg-emergency',
      textColor: 'text-emergency-foreground',
      onClick: () => onNavigate('sos')
    },
    {
      id: 'contacts',
      title: 'Emergency Contacts',
      description: 'Call trusted contacts',
      icon: Phone,
      color: 'bg-safe',
      textColor: 'text-warning-foreground',
      onClick: () => onNavigate('contacts')
    },
    {
      id: 'location',
      title: 'Share Location',
      description: 'Send location to contacts',
      icon: MapPin,
      color: 'bg-safe',
      textColor: 'text-safe-foreground',
      onClick: () => onNavigate('location')
    },
    {
      id: 'community',
      title: 'Community Alerts',
      description: 'View local safety updates',
      icon: Users,
      color: 'bg-safe',
      textColor: 'text-primary-foreground',
      onClick: () => onNavigate('alerts')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <SafetyLogo size="xl" className="text-emergency mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Sudarshan Chakra</h1>
        <p className="text-muted-foreground">Your safety companion</p>
      </div>

      {/* Live Safety Updates */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Live Safety Updates</h2>
        {inDangerZone && (
          <AlertCard
            alert={{
              id: 'danger',
              type: 'warning',
              title: 'Potential Danger Zone',
              message:
                'You are approaching an area with high reported accidents. Please be vigilant.',
              location: 'Current Area',
              time: 'Just now',
              actionRequired: true
            }}
          />
        )}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.id}
                className="p-4 cursor-pointer hover:shadow-elevated transition-shadow"
                onClick={action.onClick}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div
                    className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center`}
                  >
                    <Icon className={`w-6 h-6 ${action.textColor}`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm mb-1">{action.title}</h3>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Status */}
      <Card className="p-4 bg-safe/10 border-safe/20">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-safe rounded-full animate-pulse"></div>
          <div>
            <p className="font-medium text-safe">System Status: <span className='text-green-600'>Active</span></p>
            <p className="text-sm text-muted-foreground">All safety features are operational</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HomeScreen;
