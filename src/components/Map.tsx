import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertTriangle, Shield, MapPin } from 'lucide-react';

interface MapProps {
  className?: string;
}

const Map: React.FC<MapProps> = ({ className = '' }) => {
  // Sample locations for demo
  const locations = [
    { name: 'High Accident Zone', type: 'danger', top: '25%', left: '30%' },
    { name: 'Construction Area', type: 'warning', top: '60%', left: '70%' },
    { name: 'Police Station', type: 'safe', top: '40%', left: '50%' },
    { name: 'Hospital', type: 'safe', top: '70%', left: '25%' },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Map Legend */}
      <div className="flex justify-center space-x-4 text-xs">
        <div className="flex items-center space-x-1">
          <AlertTriangle className="w-4 h-4 text-emergency" />
          <span>Danger Zones</span>
        </div>
        <div className="flex items-center space-x-1">
          <Shield className="w-4 h-4 text-safe" />
          <span>Safe Zones</span>
        </div>
      </div>
      
      {/* Map Container */}
      <div className="relative">
        <div className="w-full h-96 bg-gradient-to-br from-muted/30 to-muted/60 rounded-lg shadow-lg relative overflow-hidden">
          {/* Mock street layout */}
          <div className="absolute inset-4">
            {/* Horizontal streets */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-muted-foreground/20"></div>
            <div className="absolute top-20 left-0 right-0 h-1 bg-muted-foreground/20"></div>
            <div className="absolute bottom-20 left-0 right-0 h-1 bg-muted-foreground/20"></div>
            <div className="absolute bottom-8 left-0 right-0 h-1 bg-muted-foreground/20"></div>
            
            {/* Vertical streets */}
            <div className="absolute top-0 bottom-0 left-8 w-1 bg-muted-foreground/20"></div>
            <div className="absolute top-0 bottom-0 left-20 w-1 bg-muted-foreground/20"></div>
            <div className="absolute top-0 bottom-0 right-20 w-1 bg-muted-foreground/20"></div>
            <div className="absolute top-0 bottom-0 right-8 w-1 bg-muted-foreground/20"></div>
          </div>
          
          {/* Location markers */}
          {locations.map((location, index) => (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ top: location.top, left: location.left }}
            >
              {/* Zone circle */}
              <div className={`absolute inset-0 rounded-full animate-pulse ${
                location.type === 'danger' ? 'w-16 h-16 bg-emergency/20 border-2 border-emergency/40' :
                location.type === 'warning' ? 'w-12 h-12 bg-warning/20 border-2 border-warning/40' :
                'w-12 h-12 bg-safe/20 border-2 border-safe/40'
              }`}></div>
              
              {/* Marker icon */}
              <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                location.type === 'danger' ? 'bg-emergency text-emergency-foreground' :
                location.type === 'warning' ? 'bg-warning text-warning-foreground' :
                'bg-safe text-safe-foreground'
              }`}>
                {location.type === 'safe' ? (
                  <Shield className="w-4 h-4" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
              </div>
              
              {/* Tooltip */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-background border rounded-lg px-2 py-1 text-xs whitespace-nowrap shadow-lg">
                  {location.name}
                </div>
              </div>
            </div>
          ))}
          
          {/* Current location indicator */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-4 h-4 bg-primary/30 rounded-full animate-ping"></div>
              <MapPin className="absolute -top-2 -left-2 w-8 h-8 text-primary" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Status */}
      <Card className="p-3 bg-primary/5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Current Location: Purvanchal</span>
          <div className="flex items-center space-x-1 text-safe">
            <div className="w-2 h-2 bg-safe rounded-full animate-pulse"></div>
            <span>Tracking Active</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Map;