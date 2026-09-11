import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../brand/BrandLogo';
import { Search, Bell, Sparkles, Globe, Zap, DownloadCloud, WifiOff, Download } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../localization/languages';

interface TopHeaderProps {
  onOpenNotifications: () => void;
  onOpenSearch: () => void;
  onOpenProfile: () => void;
  onOpenOfflineVault?: () => void;
  onOpenDownloadModal?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onOpenNotifications,
  onOpenSearch,
  onOpenProfile,
  onOpenOfflineVault,
  onOpenDownloadModal,
}) => {
  const {
    currentLanguage,
    setLanguage,
    t,
    user,
    unreadNotificationCount,
    setIsQuickFunOpen,
    activeMood,
    isOnline,
    cachedContents,
    setIsOfflineVaultOpen,
  } = useApp();

  const [showLangMenu, setShowLangMenu] = useState(false);

  // Dynamic time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('greetingMorning');
    if (hour < 17) return t('greetingAfternoon');
    return t('greetingEvening');
  };

  const activeLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage);

  return (
    <header className="sticky top-0 z-30 w-full px-4 py-3 glass-nav transition-all">
      <div className="flex items-center justify-between gap-2">
        {/* Left: Brand Logo & Dynamic Greeting */}
        <div className="flex items-center gap-2.5">
          <BrandLogo size="sm" />
          <div className="hidden sm:flex flex-col">
            <span className="text-[11px] text-zinc-400 font-medium">
              {getGreeting()}, <strong className="text-white">{user.name.split(' ')[0]}</strong>
            </span>
            {activeMood && (
              <span className="text-[9px] text-orange-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping" />
                {t('moodActiveBanner')}
              </span>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Download & Install App Pill */}
          {onOpenDownloadModal && (
            <button
              onClick={onOpenDownloadModal}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-black text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-sm"
              title="Download & Install App on Phone"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="text-[11px] font-extrabold font-hindi">
                {currentLanguage === 'hi' ? 'डाउनलोड' : 'Install'}
              </span>
            </button>
          )}

          {/* Offline Downloads / Status Pill */}
          <button
            onClick={() => {
              if (onOpenOfflineVault) onOpenOfflineVault();
              else setIsOfflineVaultOpen(true);
            }}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-full border text-xs font-semibold active:scale-95 transition-all ${
              !isOnline
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse'
                : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white'
            }`}
            title={!isOnline ? 'Offline Mode Active' : 'Offline Cached Videos'}
          >
            {!isOnline ? (
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <DownloadCloud className="w-3.5 h-3.5 text-orange-400" />
            )}
            <span className="hidden sm:inline text-[11px] font-bold">
              {!isOnline ? 'Offline' : cachedContents.length}
            </span>
          </button>

          {/* Quick Fun Pill (5 min entertainment) */}
          <button
            onClick={() => setIsQuickFunOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold hover:brightness-110 active:scale-95 transition-all"
            title="Quick Fun - 5 Min Bites"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-bold">5 Min</span>
          </button>

          {/* Language Switcher Quick Pill */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-[11px] font-bold font-hindi">
                {activeLangObj?.nativeName || 'हिंदी'}
              </span>
            </button>

            {/* Language Dropdown Modal / Popup */}
            {showLangMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowLangMenu(false)}
                />
                <div className="absolute right-0 mt-2 z-50 w-48 rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl p-2 space-y-1 animate-in fade-in zoom-in-95 max-h-64 overflow-y-auto no-scrollbar">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Select Language
                  </div>
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                        currentLanguage === lang.code
                          ? 'bg-orange-500 text-white font-bold'
                          : 'text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span>{lang.flag}</span>
                        <span className="font-hindi">{lang.nativeName}</span>
                      </span>
                      <span className="text-[10px] opacity-75">{lang.code.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="relative w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-extrabold text-white flex items-center justify-center border-2 border-[#090A0F]">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* User Profile Avatar with Gold Badge */}
          <button
            onClick={onOpenProfile}
            className="relative w-8 h-8 rounded-full overflow-hidden border border-orange-500/50 active:scale-95 transition-all"
            aria-label="Profile"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {user.isTarangPlus && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-amber-400 border border-black" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
