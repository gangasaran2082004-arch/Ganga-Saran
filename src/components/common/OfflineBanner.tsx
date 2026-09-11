import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { WifiOff, Wifi, DownloadCloud, RefreshCw, X, Sparkles } from 'lucide-react';

interface OfflineBannerProps {
  onOpenOfflineVault: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ onOpenOfflineVault }) => {
  const {
    isOnline,
    isSimulatedOffline,
    toggleSimulatedOffline,
    currentLanguage,
    cachedContents,
  } = useApp();

  const [dismissed, setDismissed] = useState(false);
  const [showRestoredToast, setShowRestoredToast] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // Monitor transition from offline to online
  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
      setDismissed(false);
    } else if (wasOffline && isOnline) {
      setShowRestoredToast(true);
      const timer = setTimeout(() => {
        setShowRestoredToast(false);
        setWasOffline(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      if (isSimulatedOffline) {
        toggleSimulatedOffline();
      }
    }, 1000);
  };

  // When back online
  if (showRestoredToast && isOnline) {
    return (
      <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm px-4 py-2.5 rounded-2xl bg-emerald-600/95 text-white border border-emerald-400 shadow-2xl backdrop-blur-md flex items-center justify-between animate-in fade-in slide-in-from-top-3">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-full bg-white/20">
            <Wifi className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold font-hindi">
              {currentLanguage === 'hi' ? 'इंटरनेट फिर से कनेक्ट हो गया! 🟢' : 'Back Online! 🟢'}
            </p>
            <p className="text-[10px] text-emerald-100">
              {currentLanguage === 'hi' ? 'ताज़ा वीडियो और ट्रेंड्स लोड हो रहे हैं' : 'Live stream & feed synced'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowRestoredToast(false)}
          className="p-1 text-white/80 hover:text-white"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // If online or user dismissed the persistent banner
  if (isOnline || dismissed) return null;

  return (
    <div className="sticky top-0 z-40 w-full px-3 py-2 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white shadow-xl animate-in slide-in-from-top-2 select-none">
      <div className="flex items-center justify-between gap-2 max-w-lg mx-auto">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-xl bg-black/20 text-white flex-shrink-0 animate-pulse">
            <WifiOff className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black uppercase tracking-wider font-hindi">
                {currentLanguage === 'hi' ? 'ऑफलाइन मोड' : 'Offline Mode'}
              </span>
              {isSimulatedOffline && (
                <span className="px-1.5 py-0.2 rounded bg-black/40 text-[9px] font-bold">
                  Simulated
                </span>
              )}
            </div>
            <p className="text-[11px] text-orange-100 truncate font-hindi">
              {currentLanguage === 'hi'
                ? `कैश किए गए ${cachedContents.length} वीडियो उपलब्ध हैं`
                : `${cachedContents.length} cached videos ready to play`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={onOpenOfflineVault}
            className="px-2.5 py-1 rounded-xl bg-white text-orange-600 text-[11px] font-black shadow hover:bg-orange-50 active:scale-95 transition-all flex items-center gap-1"
          >
            <DownloadCloud className="w-3 h-3" />
            <span>{currentLanguage === 'hi' ? 'ऑफलाइन वीडियो' : 'Cached Feed'}</span>
          </button>

          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="p-1 rounded-lg bg-black/20 hover:bg-black/30 text-white"
            title="Retry Connection"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-white/70 hover:text-white"
            title="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
