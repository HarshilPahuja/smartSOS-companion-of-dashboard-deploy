import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, MapPin, Shield } from 'lucide-react';

export interface Alert {
  id: string;
  type: 'danger' | 'warning' | 'info';
  title: string;
  message: string;
  location?: string;
  time: string;
  actionRequired?: boolean;
}

interface AlertCardProps {
  alert: Alert;
  onAction?: (alertId: string) => void;
}

const AlertCard: React.FC<AlertCardProps> = ({ alert, onAction }) => {
  const getAlertStyles = () => {
    switch (alert.type) {
      case 'danger':
        return {
          containerClass: 'border-l-4 border-l-emergency bg-emergency/5',
          iconClass: 'text-emergency',
          titleClass: 'text-emergency',
          buttonClass: 'bg-mustard text-mustard-foreground hover:bg-mustard/90'
        };
      case 'warning':
        return {
          containerClass: 'border-l-4 border-l-warning bg-warning/5',
          iconClass: 'text-warning',
          titleClass: 'text-warning',
          buttonClass: 'bg-mustard text-mustard-foreground hover:bg-mustard/90'
        };
      default:
        return {
          containerClass: 'border-l-4 border-l-muted bg-muted/20',
          iconClass: 'text-muted-foreground',
          titleClass: 'text-foreground',
          buttonClass: 'bg-primary text-primary-foreground hover:bg-primary/90'
        };
    }
  };

  const { containerClass, iconClass, titleClass, buttonClass } = getAlertStyles();

  const getIcon = () => {
    switch (alert.type) {
      case 'danger':
        return <AlertTriangle className={`w-5 h-5 ${iconClass}`} />;
      case 'warning':
        return <AlertTriangle className={`w-5 h-5 ${iconClass}`} />;
      default:
        return <Shield className={`w-5 h-5 ${iconClass}`} />;
    }
  };

  return (
    <Card className={`p-4 ${containerClass}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold ${titleClass} mb-1`}>
            {alert.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            {alert.message}
          </p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-4">
              {alert.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{alert.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{alert.time}</span>
              </div>
            </div>
          </div>
          
          {alert.actionRequired && (
            <Button
              size="sm"
              className={buttonClass}
              onClick={() => onAction?.(alert.id)}
            >
              I understand the risks
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AlertCard;