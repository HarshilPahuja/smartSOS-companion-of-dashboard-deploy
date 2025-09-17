import React from 'react';
import { Home, AlertTriangle, Map, Headphones } from 'lucide-react';
import SafetyLogo from './SafetyLogo';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
    { id: 'sos', label: 'SOS', icon: null }, // Special SOS button
    { id: 'maps', label: 'Maps', icon: Map },
    { id: 'support', label: 'Support', icon: Headphones },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-border shadow-elevated">
      <div className="flex items-center max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          if (tab.id === 'sos') {
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="flex-1 flex flex-col items-center py-2 relative"
              >
                <div className="w-12 h-12 bg-gradient-emergency rounded-full flex items-center justify-center shadow-emergency -mt-6 border-4 border-black">
                  <SafetyLogo size="sm" className="text-white" />
                </div>
                <span className="text-xs mt-1 text-emergency font-medium">SOS</span>
              </button>
            );
          }
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center py-3 transition-colors ${
                isActive 
                  ? 'text-emergency' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {Icon && <Icon className="w-5 h-5 mb-1" />}
              <span className="text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;