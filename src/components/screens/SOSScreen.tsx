import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import EmergencyButton from '../EmergencyButton';
import { MapPin, Clock, Phone } from 'lucide-react';

interface SOSScreenProps {
  onNavigate: (screen: string) => void;
}

const SOSScreen: React.FC<SOSScreenProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-1" />
            <span>Purvanchal</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-1" />
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
        <h1 className="text-xl font-semibold text-foreground mb-2">Are you in an emergency?</h1>
        <p className="text-muted-foreground text-sm">Press the button below and help will reach you soon</p>
      </div>

      {/* Emergency Button */}
      <div className="flex justify-center py-8">
        <EmergencyButton />
      </div>

      {/* Emergency Instructions */}
      <Card className="p-4 bg-muted/50">
        <h3 className="font-medium mb-3 text-foreground">Emergency Response Process:</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-emergency text-emergency-foreground rounded-full flex items-center justify-center text-xs font-bold">1</div>
            <span>Your location will be shared with emergency services</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-emergency text-emergency-foreground rounded-full flex items-center justify-center text-xs font-bold">2</div>
            <span>Emergency contacts will be notified automatically</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-emergency text-emergency-foreground rounded-full flex items-center justify-center text-xs font-bold">3</div>
            <span>First responders will be dispatched to your location</span>
          </div>
        </div>
      </Card>

      {/* Emergency Contacts */}
      <Card className="p-4">
        <h3 className="font-medium mb-3 text-foreground">First Responders are enroute to you</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">Emergency Contact</p>
                <p className="text-sm text-muted-foreground">Primary responder</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" className="bg-emergency hover:bg-emergency/90">
                Call
              </Button>
              <Button size="sm" variant="outline">
                Message
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Back to Safety */}
      <div className="text-center">
        <Button 
          variant="outline" 
          onClick={() => onNavigate('home')}
          className="px-8"
        >
          Back to Safety Dashboard
        </Button>
      </div>
    </div>
  );
};

export default SOSScreen;