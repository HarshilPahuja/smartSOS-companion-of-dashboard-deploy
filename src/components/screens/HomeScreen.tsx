import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SafetyLogo from '../SafetyLogo';
import AlertCard, { Alert } from '../AlertCard';
import { MapPin, Shield, Phone, Users } from 'lucide-react';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const recentAlerts: Alert[] = [
    {
      id: '1',
      type: 'warning',
      title: 'Potential Danger Zone',
      message: 'You are approaching an area with high reported accidents. Please be vigilant.',
      location: 'Purvanchal',
      time: '2 min ago',
      actionRequired: true
    }
  ];

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
      color: 'bg-warning',
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
      color: 'bg-primary',
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
        {recentAlerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
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
                  <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center`}>
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
            <p className="font-medium text-safe">System Status: Active</p>
            <p className="text-sm text-muted-foreground">All safety features are operational</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HomeScreen;