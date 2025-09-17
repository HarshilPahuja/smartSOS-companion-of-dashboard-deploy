import React from 'react';

interface SafetyLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SafetyLogo: React.FC<SafetyLogoProps> = ({ className = "", size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full fill-current"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="chakraGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
          </radialGradient>
        </defs>
        {/* Sudarshan Chakra - 8-pointed star */}
        <g transform="translate(50,50)">
          {/* Center circle */}
          <circle r="8" fill="url(#chakraGradient)" />
          
          {/* 8 spokes/points */}
          {Array.from({ length: 8 }, (_, i) => (
            <g key={i} transform={`rotate(${i * 45})`}>
              <path
                d="M 0,-40 L 4,-12 L 0,-8 L -4,-12 Z"
                fill="url(#chakraGradient)"
              />
              <path
                d="M 0,-12 L 6,-25 L 0,-22 L -6,-25 Z"
                fill="url(#chakraGradient)"
                opacity="0.7"
              />
            </g>
          ))}
          
          {/* Outer ring details */}
          {Array.from({ length: 16 }, (_, i) => (
            <circle
              key={i}
              r="2"
              cx="0"
              cy="-35"
              fill="currentColor"
              opacity="0.6"
              transform={`rotate(${i * 22.5})`}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};

export default SafetyLogo;