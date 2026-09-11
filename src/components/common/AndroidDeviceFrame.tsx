import React from 'react';
import { useApp } from '../../context/AppContext';
import { Smartphone, Monitor, Wifi, BatteryMedium, Signal } from 'lucide-react';

interface AndroidDeviceFrameProps {
  children: React.ReactNode;
}

export const AndroidDeviceFrame: React.FC<AndroidDeviceFrameProps> = ({ children }) => {
  const { isAndroidFrameMode, setIsAndroidFrameMode } = useApp();

  // Current time for status bar
  const currentTime = '10:48';

  return (
    <div className="min-h-screen w-full bg-[#050608] flex flex-col items-center justify-start relative text-zinc-100 selection:bg-orange-500 selection:text-white">
      {/* Floating View Switcher Pill (Top Right) */}
      <div className="fixed top-2.5 right-3 z-50 flex items-center gap-1.5 p-1 rounded-full bg-zinc-900/90 border border-zinc-700/80 backdrop-blur-md shadow-2xl text-[11px] font-bold select-none">
        <button
          onClick={() => setIsAndroidFrameMode(true)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all ${
            isAndroidFrameMode
              ? 'bg-orange-500 text-white shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
          title="Android Phone Mockup"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Android Shell</span>
        </button>
        <button
          onClick={() => setIsAndroidFrameMode(false)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all ${
            !isAndroidFrameMode
              ? 'bg-orange-500 text-white shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
          title="Full Responsive View"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Full Width</span>
        </button>
      </div>

      {isAndroidFrameMode ? (
        /* Android Phone Frame */
        <div className="my-3 sm:my-6 w-full max-w-[430px] rounded-[44px] p-2 sm:p-2.5 bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 shadow-[0_25px_70px_rgba(0,0,0,0.85)] border-2 border-zinc-700/60 relative">
          {/* Inner Screen Bezel */}
          <div className="w-full rounded-[38px] bg-[#090A0F] overflow-hidden flex flex-col relative h-[92vh] max-h-[890px] border border-zinc-800/80">
            {/* Android Status Bar with Punch-hole Camera */}
            <div className="w-full px-6 py-1.5 flex items-center justify-between text-[11px] font-semibold text-zinc-300 z-30 select-none bg-[#090A0F]/90 backdrop-blur-md">
              <span>{currentTime}</span>

              {/* Punch-hole camera */}
              <div className="w-3.5 h-3.5 rounded-full bg-black border border-zinc-800 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-950" />
              </div>

              <div className="flex items-center gap-1.5 text-zinc-300">
                <Signal className="w-3 h-3" />
                <span className="text-[10px] font-bold">5G</span>
                <Wifi className="w-3 h-3" />
                <div className="flex items-center gap-0.5">
                  <span className="text-[10px]">92%</span>
                  <BatteryMedium className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Application Inside Android Phone */}
            <div className="flex-1 w-full overflow-y-auto no-scrollbar relative flex flex-col">
              {children}
            </div>

            {/* Android Bottom Gesture Pill Bar */}
            <div className="w-full py-1.5 bg-[#090A0F]/95 flex items-center justify-center z-40 select-none pointer-events-none">
              <div className="w-32 h-1 bg-zinc-600/80 rounded-full" />
            </div>
          </div>
        </div>
      ) : (
        /* Full Width Responsive View */
        <div className="w-full max-w-2xl min-h-screen bg-[#090A0F] flex flex-col shadow-2xl relative">
          {children}
        </div>
      )}
    </div>
  );
};
