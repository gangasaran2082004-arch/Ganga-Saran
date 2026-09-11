import React from 'react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../brand/BrandLogo';

export const SplashScreen: React.FC = () => {
  const { dismissSplash, currentLanguage, activeBrand } = useApp();

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#08090D] p-6 text-white select-none transition-opacity duration-300">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-orange-600/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

      {/* Top subtle badge */}
      <div className="w-full flex justify-between items-center pt-2">
        <span className="text-[11px] font-semibold tracking-wider text-orange-400/80 uppercase px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
          🇮🇳 Made for India
        </span>
        <button
          onClick={dismissSplash}
          className="text-xs text-zinc-400 hover:text-white px-2.5 py-1 rounded-full bg-white/5 border border-white/10 active:scale-95 transition-all"
        >
          Skip
        </button>
      </div>

      {/* Central Animated Hero */}
      <div className="flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in-90 duration-500">
        <div className="relative p-3">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 blur-xl opacity-40 animate-pulse" />
          <BrandLogo size="xl" />
        </div>

        <div className="space-y-1 max-w-xs">
          <h2 className="text-xl font-bold text-white font-hindi">
            {currentLanguage === 'hi' ? activeBrand.taglineHindi : activeBrand.tagline}
          </h2>
          <p className="text-xs text-zinc-400">
            {currentLanguage === 'hi'
              ? 'अल्ट्रा-फास्ट • देसी मनोरंजन • 12 भारतीय भाषाएं'
              : 'Ultra-Fast • Desi Entertainment • 12 Indian Languages'}
          </p>
        </div>
      </div>

      {/* Bottom Loading Progress */}
      <div className="w-full max-w-xs flex flex-col items-center pb-6 space-y-3">
        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-orange-500 via-rose-500 to-purple-600 rounded-full w-full animate-[pulse_1s_ease-in-out_infinite]" />
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>
            {currentLanguage === 'hi'
              ? 'सुपरफास्ट इंजन सक्रिय हो रहा है...'
              : 'Connecting high-speed stream...'}
          </span>
        </div>
      </div>
    </div>
  );
};
