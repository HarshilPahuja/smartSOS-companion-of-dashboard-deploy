import React, { useState } from 'react';
import BottomNavigation from './BottomNavigation';
import HomeScreen from './screens/HomeScreen';
import SOSScreen from './screens/SOSScreen';
import AlertsScreen from './screens/AlertsScreen';
import GeofenceScreen from './screens/GeofenceScreen';
import { Card } from './ui/card';

import Fire from './assets/fireb.svg';
import Earthquake from './assets/earthquakeb.svg';
import Avalanche from './assets/avalancheb.svg';
import Accident from './assets/Accidentb.svg';
import Flood from './assets/floodb.svg';
import Other from './assets/+b.svg';


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
        return <SupportScreen />;
      default:
        return <HomeScreen onNavigate={handleScreenChange} />;
    }
  };

  const SupportScreen = () => {
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const issueTemplates = {
      fire: "I am reporting a fire emergency. Please help. \nAdditional info: ",
      earthquake: "I am reporting earthquake activity. Please help. \nAdditional info: ",
      avalanche: "I am reporting an avalanche. Please help. \nAdditional info: ",
      accident: "I am reporting an accident. Please help. \nAdditional info: ",
      flood: "I am reporting flooding. Please help. \nAdditional info: ",
      other: "I am reporting an emergency situation. Please help. \nAdditional info: "
    };
    
  const issueIcons: Record<string, JSX.Element> = {
    fire: <img src={Fire} alt="fire" className="w-8 h-8 text-black fill-current"  />,
    earthquake: <img src={Earthquake} alt="earthquake" className="w-8 h-8 text-black fill-current" />,
    avalanche: <img src={Avalanche} alt="avalanche" className="w-8 h-8 text-black fill-current" />,
    accident: <img src={Accident} alt="accident" className="w-8 h-8 text-black fill-current" />,
    flood: <img src={Flood} alt="flood" className="w-8 h-8 text-black fill-current" />,
    other: <img src={Other} alt="other" className="w-8 h-8 text-black fill-current" />,
  };

    const handleIssueSelect = (issueType: keyof typeof issueTemplates) => {
      setDescription(issueTemplates[issueType]);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    };

    const handleSubmit = () => {
      if (!description) {
        alert("Please enter a description before submitting!");
        return;
      }

      setSubmitting(true);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          const reportObj = {
            lat: latitude.toString(),
            lang: longitude.toString(),
            dsc: description,
            img: image
          };

          console.log("Report data to send:", reportObj);

          fetch('http://localhost:4001/api/reports', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reportObj)
          })
            .then((res) => {
              if (res.ok) {
                alert("Report submitted successfully!");
                setDescription('');
                setImage(null);
              } else {
                alert("Failed to submit report.");
              }
            })
            .catch((err) => {
              console.error(err);
              alert("Error submitting report.");
            })
            .finally(() => setSubmitting(false));
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to get your location.");
          setSubmitting(false);
        }
      );
    };

    return (
      <div className="space-y-6">
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Report an issue</h1>
        </div>

        <Card className="p-6 bg-card/50 border border-white/10">
          {/* Issue Type Buttons */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {Object.keys(issueTemplates).map((key) => (
              <button
                key={key}
                onClick={() => handleIssueSelect(key as keyof typeof issueTemplates)}
                className="flex flex-col items-center space-y-2 hover:scale-105 transition-transform"
              >
                <div className="w-16 h-16 bg-mustard rounded-full flex items-center justify-center">
                  {issueIcons[key]}
                </div>
                <span className="text-sm text-foreground">{key}</span>
              </button>
            ))}
          </div>

          {/* Upload Image Button */}
          <label className="w-full bg-emergency text-emergency-foreground hover:bg-emergency/90 py-4 rounded-xl mb-4 font-medium flex items-center justify-center space-x-2 cursor-pointer">
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <span>Upload an image</span>
          </label>

          {/* Show preview */}
          {image && (
            <img src={image} alt="preview" className="w-full rounded-xl mb-4 object-cover max-h-60" />
          )}

          {/* Description Textarea */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description..."
            className="w-full bg-background/50 border border-white/10 rounded-xl p-4 mb-4 text-foreground placeholder:text-muted-foreground resize-none h-32"
          />

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-emergency text-emergency-foreground hover:bg-emergency/90 py-4 rounded-xl font-medium mb-4"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </Card>
      </div>
    );
  };

  return (
    <div className="dark min-h-screen bg-background">
      {/* Main Content */}
      <div className="max-w-lg mx-auto bg-background min-h-screen pb-20">
        <div className="p-4">{renderScreen()}</div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeScreen} onTabChange={handleScreenChange} />
    </div>
  );
};

export default SafetyApp;
