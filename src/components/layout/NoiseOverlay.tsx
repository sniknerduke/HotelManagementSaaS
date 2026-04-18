import React from 'react';

export const NoiseOverlay: React.FC = () => {
  return (
    <svg
      className="fixed inset-0 pointer-events-none z-50 opacity-[0.02]"
      style={{ mixBlendMode: 'multiply' }}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  );
};
