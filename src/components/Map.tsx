import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ className = '' }) => {
  const [zones, setZones] = useState([]);
  const [center, setCenter] = useState(null); // null until geolocation succeeds

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Geolocation failed', error);
        }
      );
    } else {
      console.error('Geolocation not supported');
    }
  }, []);

  // Fetch zones from backend
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const res = await fetch("https://smartsos-kyfz.onrender.com/api/danger-zones");
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
    const interval = setInterval(fetchZones, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, []);

  // Do not render map until we have a center
  if (!center) {
    return <div className="text-center text-gray-500">Fetching your location...</div>;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Leaflet Map */}
      <div className="w-full rounded-lg shadow-lg overflow-hidden h-96 sm:h-[60vh]">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Red circles for all zones */}
          {zones.map((zone) =>
            zone.lat !== undefined && zone.lang !== undefined ? (
              <Circle
                key={zone.id}
                center={[Number(zone.lat), Number(zone.lang)]}
                radius={zone.radius || 200}
                pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.3 }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-sm">{zone.name}</h3>
                    <p className="text-xs text-gray-600">{zone.message}</p>
                  </div>
                </Popup>
              </Circle>
            ) : null
          )}
        </MapContainer>
      </div>

      {/* Status Card */}
      <Card className="p-3 bg-primary/5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Tracking Zones around your current location
          </span>
        </div>
      </Card>
    </div>
  );
};

export default Map;
