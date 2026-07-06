
import React from 'react';
import { CaricatureStyle } from '../types';
import { STYLE_CONFIGS } from '../constants';

interface StyleToggleProps {
  selectedStyle: CaricatureStyle;
  onSelect: (style: CaricatureStyle) => void;
}

const StyleToggle: React.FC<StyleToggleProps> = ({ selectedStyle, onSelect }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full max-w-4xl mx-auto px-4">
      {Object.values(STYLE_CONFIGS).map((style) => (
        <button
          key={style.id}
          onClick={() => onSelect(style.id)}
          className={`flex-1 p-6 rounded-2xl transition-all duration-300 text-left glass ${
            selectedStyle === style.id
              ? 'ring-4 ring-blue-400/50 bg-white/20 shadow-2xl scale-105'
              : 'hover:bg-white/10 opacity-70 hover:opacity-100'
          }`}
        >
          <div className="text-4xl mb-3">{style.icon}</div>
          <h3 className="text-xl font-bold text-white mb-2 font-display">{style.name}</h3>
          <p className="text-blue-100 text-sm leading-relaxed">{style.description}</p>
        </button>
      ))}
    </div>
  );
};

export default StyleToggle;
