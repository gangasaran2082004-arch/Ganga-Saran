import { useState, useEffect, useCallback } from 'react';

export function useOnlineStatus() {
  const [isBrowserOnline, setIsBrowserOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [wasOffline, setWasOffline] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsBrowserOnline(true);
    };

    const handleOffline = () => {
      setIsBrowserOnline(false);
      setWasOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleSimulatedOffline = useCallback(() => {
    setIsSimulatedOffline((prev) => {
      const next = !prev;
      if (next) {
        setWasOffline(true);
      }
      return next;
    });
  }, []);

  // Effective online status: false if real browser is offline OR user toggled simulated offline
  const isEffectiveOnline = isBrowserOnline && !isSimulatedOffline;

  return {
    isOnline: isEffectiveOnline,
    isBrowserOnline,
    isSimulatedOffline,
    wasOffline,
    toggleSimulatedOffline,
  };
}
