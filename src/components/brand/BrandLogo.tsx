import React from 'react';
import { useApp } from '../../context/AppContext';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  animated?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showTagline = false,
  animated = false,
}) => {
  const { currentLanguage, activeBrand } = useApp();

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Radiant Wave Icon */}
      <div
        className={`relative ${iconSizes[size]} rounded-2xl flex items-center justify-center overflow-hidden shadow-lg shadow-orange-600/30 flex-shrink-0 bg-gradient-to-tr from-orange-600 via-rose-500 to-purple-600 ${
          animated ? 'animate-pulse' : ''
        }`}
      >
        {/* Abstract Soundwave / Kinetic Ripple Crest */}
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/5 h-3/5 text-white transform -rotate-12"
        >
          <path
            d="M6 18C6 14 9 9 18 9C27 9 30 14 30 18C30 22 27 27 18 27C9 27 6 22 6 18Z"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M11 18C11 15 14 13 18 13C22 13 25 15 25 18C25 21 22 23 18 23C14 23 11 21 11 18Z"
            fill="currentColor"
          />
          <circle cx="18" cy="18" r="2.5" fill="#FFD166" />
        </svg>

        {/* Ambient subtle gloss */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/25 pointer-events-none" />
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black tracking-tight text-white ${textSizes[size]} ${
              currentLanguage === 'hi' ? 'font-hindi font-extrabold' : 'font-sans'
            }`}
          >
            {currentLanguage === 'hi' ? activeBrand.nameHindi : activeBrand.name}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 self-center animate-ping" />
        </div>
        {showTagline && (
          <span className="text-[10px] text-zinc-400 font-medium tracking-wide">
            {currentLanguage === 'hi' ? activeBrand.taglineHindi : activeBrand.tagline}
          </span>
        )}
      </div>
    </div>
  );
};
