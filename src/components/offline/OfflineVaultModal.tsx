import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ContentCard } from '../feed/ContentCard';
import {
  WifiOff,
  Wifi,
  DownloadCloud,
  Trash2,
  HardDrive,
  X,
  Play,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Film,
  Zap,
} from 'lucide-react';

interface OfflineVaultModalProps {
  onClose: () => void;
}

export const OfflineVaultModal: React.FC<OfflineVaultModalProps> = ({ onClose }) => {
  const {
    cachedContents,
    clearAllCachedContent,
    removeCachedContent,
    isOnline,
    isSimulatedOffline,
    toggleSimulatedOffline,
    currentLanguage,
    setActivePlayingContent,
    setIsQuickFunOpen,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'videos' | 'quickfun'>('videos');

  // Approximate storage calculation
  const storageMb = (cachedContents.length * 4.2).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-white font-hindi">
                  {currentLanguage === 'hi' ? 'ऑफलाइन वॉल्ट (कैश)' : 'Offline Entertainment Vault'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  Zero Data
                </span>
              </div>
              <p className="text-[10px] text-zinc-400">
                {currentLanguage === 'hi'
                  ? 'बिना इंटरनेट के कभी भी, कहीं भी देखें'
                  : 'Play videos, shorts & quizzes 100% without internet'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Connectivity Status & Simulator Toggle Bar */}
        <div className="px-4 py-2.5 bg-zinc-900/60 border-b border-zinc-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Network Connected
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <WifiOff className="w-3.5 h-3.5" />
                Offline Mode Active
              </span>
            )}
          </div>

          {/* Simulate Offline Button for easy testing */}
          <button
            onClick={toggleSimulatedOffline}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1 ${
              isSimulatedOffline
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white'
            }`}
          >
            {isSimulatedOffline ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
            <span>{isSimulatedOffline ? 'Simulating Offline' : 'Test Offline Mode'}</span>
          </button>
        </div>

        {/* Storage Stats Bar */}
        <div className="px-4 py-2 bg-zinc-900/40 border-b border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-orange-400" />
            <span>Storage: <strong className="text-white">{storageMb} MB</strong> ({cachedContents.length} items)</span>
          </div>

          {cachedContents.length > 0 && (
            <button
              onClick={clearAllCachedContent}
              className="text-[11px] text-rose-400 hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear Cache</span>
            </button>
          )}
        </div>

        {/* Sub-tabs */}
        <div className="flex border-b border-zinc-800 text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('videos')}
            className={`flex-1 py-2.5 text-center transition-all flex items-center justify-center gap-1.5 ${
              activeSubTab === 'videos'
                ? 'text-orange-400 border-b-2 border-orange-400 bg-orange-500/10'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Cached Videos ({cachedContents.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('quickfun')}
            className={`flex-1 py-2.5 text-center transition-all flex items-center justify-center gap-1.5 ${
              activeSubTab === 'quickfun'
                ? 'text-orange-400 border-b-2 border-orange-400 bg-orange-500/10'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Offline Quizzes & Games</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 flex-1 overflow-y-auto no-scrollbar">
          {activeSubTab === 'videos' ? (
            cachedContents.length > 0 ? (
              <div className="space-y-3">
                {cachedContents.map((item) => (
                  <div
                    key={`cached_${item.id}`}
                    className="p-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center gap-3 group hover:border-orange-500/40 transition-all"
                  >
                    <div
                      onClick={() => {
                        setActivePlayingContent(item);
                        onClose();
                      }}
                      className="relative w-24 h-16 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer"
                    >
                      <img
                        src={item.posterUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-7 h-7 rounded-full bg-orange-500/90 text-white flex items-center justify-center shadow">
                          <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-1 right-1 px-1 rounded bg-black/80 text-[9px] font-bold text-white">
                        {item.duration}
                      </span>
                    </div>

                    <div
                      onClick={() => {
                        setActivePlayingContent(item);
                        onClose();
                      }}
                      className="flex-1 min-w-0 cursor-pointer"
                    >
                      <h4 className="text-xs font-bold text-white truncate font-hindi">
                        {currentLanguage === 'hi' ? item.titleHindi : item.title}
                      </h4>
                      <p className="text-[11px] text-zinc-400">{item.creator.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Ready Offline
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeCachedContent(item.id)}
                      className="p-2 rounded-xl text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Remove from offline cache"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 space-y-3">
                <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                  <DownloadCloud className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white font-hindi">
                    {currentLanguage === 'hi' ? 'कोई ऑफलाइन वीडियो सेव नहीं है' : 'No Cached Videos Yet'}
                  </h4>
                  <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                    {currentLanguage === 'hi'
                      ? 'वीडियो कार्ड पर दिए गए डाउनलोड आइकन पर टैप करें और कभी भी बिना डेटा खर्च किए देखें।'
                      : 'Tap the download icon on any video or reel to save it for offline playback.'}
                  </p>
                </div>
              </div>
            )
          ) : (
            /* Quick Fun Quizzes & Games (Work 100% offline) */
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-gradient-to-tr from-purple-900/40 to-pink-900/30 border border-purple-500/30 space-y-2">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
                  <HelpCircle className="w-4 h-4 text-purple-400" />
                  <span>Bollywood & Desi Trivia (100% Offline)</span>
                </div>
                <p className="text-[11px] text-zinc-300">
                  All quiz questions, facts, and the "Spin the Vibe" wheel are pre-cached and ready to play anywhere.
                </p>
                <button
                  onClick={() => {
                    setIsQuickFunOpen(true);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-purple-500 text-white text-xs font-bold shadow hover:bg-purple-600 transition-all flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Play Offline Trivia Now</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
