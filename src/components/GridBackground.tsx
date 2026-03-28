import React from 'react';
import {AbsoluteFill} from 'remotion';

export const GridBackground: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `
          linear-gradient(rgba(160, 185, 255, 0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(160, 185, 255, 0.035) 1px, transparent 1px)
        `,
        backgroundSize: '72px 72px',
        maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.7), rgba(0,0,0,0.12))',
        opacity: 0.55,
      }}
    />
  );
};