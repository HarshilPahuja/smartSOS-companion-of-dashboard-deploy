import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Phone, MessageCircle } from "lucide-react";

interface EmergencyButtonProps {
  className?: string;
  onSosSent?: () => void;
}

const EmergencyButton: React.FC<EmergencyButtonProps> = ({ className = "", onSosSent }) => {
  const [isPressed, setIsPressed] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();

  const handleEmergencyPress = () => {
    if (isPressed) return; // prevent multiple triggers
    setIsPressed(true);
    setCountdown(3);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setIsPressed(false);

          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              const dangerZone = {
                lat: latitude.toString(),
                lang: longitude.toString(),
                radius: 1,
                message: "Help."
              };

            fetch("http://localhost:4001/api/add-demo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dangerZone),
              })
                .then((res) => res.json())
                .then((data) => {
                  toast({
                    title: "Emergency Alert Sent!",
                    description: `Location: ${latitude}, ${longitude}`,
                    variant: "destructive",
                  });
                  if (onSosSent) onSosSent();
                })
                .catch((err) => {
                  console.error(err);
                  toast({
                    title: "Failed to send alert",
                    description: "Please try again.",
                    variant: "destructive",
                  });
                });
            },
            (error) => {
              toast({
                title: "Location Access Denied",
                description: "Please enable GPS to send alert.",
                variant: "destructive",
              });
            }
          );

          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCancel = () => {
    setIsPressed(false);
    setCountdown(0);
    toast({
      title: "Emergency Cancelled",
      description: "Emergency alert has been cancelled.",
      variant: "default",
    });
  };

  // ===== Motion Detection =====
useEffect(() => {
  const SHAKE_THRESHOLD = 25; // adjust sensitivity
  let lastShakeTime = 0;
  const COOLDOWN = 5000; // 5 seconds

  let lastTime = 0;
  let lastX: number | null = null;
  let lastY: number | null = null;
  let lastZ: number | null = null;

  const handleMotion = (event: DeviceMotionEvent) => {
    const acc = event.accelerationIncludingGravity;
    if (!acc) return;

    const { x, y, z } = acc;
    const currentTime = Date.now();

    if (lastX !== null && lastY !== null && lastZ !== null) {
      const deltaTime = currentTime - lastTime;
      if (deltaTime > 150) { // sample every 150ms
        const deltaX = Math.abs(lastX - x!);
        const deltaY = Math.abs(lastY - y!);
        const deltaZ = Math.abs(lastZ - z!);

        // ✅ Replace old detection with cooldown logic
        if (deltaX + deltaY + deltaZ > SHAKE_THRESHOLD) {
          if (currentTime - lastShakeTime > COOLDOWN) {
            handleEmergencyPress(); // trigger SOS
            lastShakeTime = currentTime;
          }
        }

        lastTime = currentTime;
        lastX = x!;
        lastY = y!;
        lastZ = z!;
      }
    } else {
      lastX = x!;
      lastY = y!;
      lastZ = z!;
      lastTime = currentTime;
    }
  };

  // request permission if needed (iOS)
  const requestMotionPermission = async () => {
    if (typeof (DeviceMotionEvent as any)?.requestPermission === "function") {
      const response = await (DeviceMotionEvent as any).requestPermission();
      if (response !== "granted") return;
    }
    window.addEventListener("devicemotion", handleMotion);
  };

  requestMotionPermission();

  return () => {
    window.removeEventListener("devicemotion", handleMotion);
  };
}, []);


  // ===== UI =====
  if (isPressed && countdown > 0) {
    return (
      <div className={`flex flex-col items-center space-y-6 ${className}`}>
        <div className="relative">
          <div className="w-48 h-48 bg-gradient-emergency rounded-full flex items-center justify-center shadow-emergency emergency-pulse">
            <div className="text-white text-center">
              <div className="text-4xl font-bold mb-2">{countdown}</div>
              <div className="text-lg">Sending Alert...</div>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="lg"
          onClick={handleCancel}
          className="px-8"
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center space-y-6 ${className}`}>
      <button
        onClick={handleEmergencyPress}
        className="w-48 h-48 bg-gradient-emergency rounded-full flex items-center justify-center shadow-emergency hover:scale-105 active:scale-95 transition-all duration-200 border-4 border-white/20"
      >
        <div className="text-white text-center">
          <div className="text-3xl font-bold mb-2">SOS</div>
          <div className="text-sm opacity-90">Emergency</div>
        </div>
      </button>

      <div className="flex space-x-4">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Phone className="w-4 h-4" />
          Call
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          Message
        </Button>
      </div>
    </div>
  );
};

export default EmergencyButton;
