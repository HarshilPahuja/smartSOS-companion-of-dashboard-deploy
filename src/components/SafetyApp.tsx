import React, { useState } from 'react';
import BottomNavigation from './BottomNavigation';
import HomeScreen from './screens/HomeScreen';
import SOSScreen from './screens/SOSScreen';
import AlertsScreen from './screens/AlertsScreen';
import GeofenceScreen from './screens/GeofenceScreen';
import { Card } from './ui/card';
import { Headphones, Map } from 'lucide-react';

const SafetyApp: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState('home');

  const handleScreenChange = (screen: string) => {
    setActiveScreen(screen);
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <HomeScreen onNavigate={handleScreenChange} />;
      case 'alerts':
        return <AlertsScreen onNavigate={handleScreenChange} />;
      case 'sos':
        return <SOSScreen onNavigate={handleScreenChange} />;
      case 'maps':
        return <GeofenceScreen onNavigate={handleScreenChange} />;
      case 'support':
        return (
          <div className="space-y-6">
            <div className="text-center py-6">
              <Headphones className="w-16 h-16 text-primary mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">Support</h1>
              <p className="text-muted-foreground">Get help when you need it</p>
            </div>
            <Card className="p-6 text-center">
              <h3 className="font-medium mb-2">24/7 Emergency Helpline</h3>
              <p className="text-2xl font-bold text-emergency mb-4">1-800-HELP-NOW</p>
              <p className="text-sm text-muted-foreground">
                Our support team is available around the clock for any safety concerns.
              </p>
            </Card>
          </div>
        );
      default:
        return <HomeScreen onNavigate={handleScreenChange} />;
    }
  };

  return (
    <div className="dark min-h-screen bg-background">
      {/* Main Content */}
      <div className="max-w-lg mx-auto bg-background min-h-screen pb-20">
        <div className="p-4">
          {renderScreen()}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab={activeScreen} 
        onTabChange={handleScreenChange} 
      />
    </div>
  );
};

export default SafetyApp;