import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AlertCard, { Alert } from '../AlertCard';
import { RefreshCw, Filter, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AlertsScreenProps {
  onNavigate: (screen: string) => void;
}

const AlertsScreen: React.FC<AlertsScreenProps> = ({ onNavigate }) => {
  const { toast } = useToast();

  const alerts: Alert[] = [
    {
      id: '1',
      type: 'warning',
      title: 'Potential Danger Zone',
      message: 'You are approaching an area with high reported accidents. Please be vigilant.',
      location: 'Purvanchal',
      time: '2 min ago',
      actionRequired: true
    },
    {
      id: '2',
      title: 'Geofence Entry',
      type: 'warning',
      message: 'You have entered a monitored safety zone. Emergency services have been notified.',
      location: 'Safety Zone Alpha',
      time: '10:30 AM',
    },
    {
      id: '3',
      title: 'SOS Activated',
      type: 'danger',
      message: 'Emergency alert has been sent to your contacts and local authorities.',
      time: '12:30 PM',
    },
    {
      id: '4',
      title: 'Emergency Contact Activated',
      type: 'info',
      message: 'Your emergency contact has been notified of your current location.',
      time: '12:30 PM',
    }
  ];

  const handleAlertAction = (alertId: string) => {
    toast({
      title: "Alert Acknowledged",
      description: "You have acknowledged the safety warning.",
      variant:"destructive"
    });
  };

  const handleRefresh = () => {
    toast({
      title: "Alerts Updated",
      description: "Latest safety alerts have been loaded.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alerts</h1>
          <p className="text-muted-foreground">Recent safety notifications</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Active Alerts Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center bg-emergency/10 border-emergency/20">
          <div className="text-2xl font-bold text-emergency mb-1">2</div>
          <div className="text-sm text-emergency">Critical</div>
        </Card>
        <Card className="p-4 text-center bg-warning/10 border-warning/20">
          <div className="text-2xl font-bold text-warning mb-1">1</div>
          <div className="text-sm text-warning">Warning</div>
        </Card>
        <Card className="p-4 text-center bg-safe/10 border-safe/20">
          <div className="text-2xl font-bold text-safe mb-1">1</div>
          <div className="text-sm text-safe">Info</div>
        </Card>
      </div>

      {/* Notification Settings */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex items-center space-x-3">
          <Bell className="w-5 h-5 text-primary" />
          <div className="flex-1">
            <h3 className="font-medium text-foreground">Alert Notifications</h3>
            <p className="text-sm text-muted-foreground">
              You'll receive real-time safety alerts based on your location
            </p>
          </div>
          <Button size="sm" variant="outline">
            Settings
          </Button>
        </div>
      </Card>

      {/* Alert List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Recent Alerts</h2>
        {alerts.map((alert) => (
          <AlertCard 
            key={alert.id} 
            alert={alert} 
            onAction={handleAlertAction}
          />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" className="px-8">
          Load More Alerts
        </Button>
      </div>
    </div>
  );
};

export default AlertsScreen;