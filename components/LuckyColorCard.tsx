
import React from 'react';
import { ElementType } from '../types';
import { ELEMENT_CONFIG } from '../constants';

interface LuckyColorCardProps {
  element: ElementType;
}

const LuckyColorCard: React.FC<LuckyColorCardProps> = ({ element }) => {
  const config = ELEMENT_CONFIG[element];

  return (
    <div 
      className="relative overflow-hidden rounded-2xl p-6 text-white shadow-lg transition-transform hover:scale-105"
      style={{ backgroundColor: config.color }}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-bold">{element}</h3>
          <span className="text-sm opacity-80 uppercase tracking-widest font-medium">Element</span>
        </div>
        <p className="text-lg font-medium mb-1">{config.palette}</p>
        <p className="text-xs opacity-75">{config.description}</p>
      </div>
      {/* Decorative Background Element */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white opacity-10 blur-xl"></div>
    </div>
  );
};

export default LuckyColorCard;
