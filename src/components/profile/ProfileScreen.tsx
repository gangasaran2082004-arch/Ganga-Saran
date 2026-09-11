import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ContentCard } from '../feed/ContentCard';
import { SUPPORTED_LANGUAGES } from '../../localization/languages';
import { BRAND_CONCEPTS } from '../../data/brandConcepts';
import { DownloadAppModal } from '../common/DownloadAppModal';
import {
  User,
  Settings,
  Heart,
  Bookmark,
  History,
  Video,
  Shield,
  Moon,
  Sun,
  Zap,
  Globe,
  Award,
  Sparkles,
  Sliders,
  CheckCircle2,
  X,
  Download,
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const {
    user,
    contents,
    currentLanguage,
    setLanguage,
    t,
    settings,
    updateSettings,
    brandConcepts,
    activeBrand,
    setActiveBrand,
    setIsAdminOpen,
    resetOnboarding,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'history' | 'saved' | 'liked' | 'uploads'>('saved');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  // Filter content lists
  const savedList = contents.filter(c => user.savedContentIds.includes(c.id));
  const likedList = contents.filter(c => user.likedContentIds.includes(c.id));
  const historyList = contents.filter(c => user.watchHistory.some(w => w.contentId === c.id));
  const uploadsList = user.userUploads;

  return (
    <div className="w-full pb-24 space-y-6">
      {/* Top Profile Header */}
      <div className="px-4 pt-3">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-base font-black text-white font-hindi">
            {t('myProfile')}
          </h1>
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-orange-500 shadow-md"
              />
              {user.isTarangPlus && (
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-amber-400 text-black text-[9px] font-black uppercase tracking-wider shadow">
                  GOLD
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-white truncate font-hindi">
                  {user.name}
                </h2>
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
              </div>
              <p className="text-xs text-zinc-400">{user.handle}</p>
              <p className="text-[11px] text-zinc-300 mt-1 line-clamp-1">{user.bio}</p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 text-center">
            <div>
              <p className="text-sm font-black text-white">{user.followingCount}</p>
              <p className="text-[10px] text-zinc-400">Following</p>
            </div>
            <div>
              <p className="text-sm font-black text-white">{user.followersCount}</p>
              <p className="text-[10px] text-zinc-400">Followers</p>
            </div>
            <div>
              <p className="text-sm font-black text-rose-400">{user.totalLikes}</p>
              <p className="text-[10px] text-zinc-400">Likes</p>
            </div>
          </div>
        </div>

        {/* Download / Install App Banner */}
        <div className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-orange-500/15 via-amber-500/15 to-orange-500/15 border border-orange-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Download className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <p className="text-xs font-bold text-white font-hindi">
                {currentLanguage === 'hi' ? 'तरंग ऐप फोन में डाउनलोड करें' : 'Download Tarang App'}
              </p>
              <p className="text-[10px] text-zinc-400 font-hindi">
                {currentLanguage === 'hi' ? 'बिना इंटरनेट ऑफलाइन वीडियो देखने के लिए' : 'Install APK / PWA for zero-lag access'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowDownloadModal(true)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black text-xs font-black shadow-md hover:brightness-110 active:scale-95 transition-all font-hindi"
          >
            {currentLanguage === 'hi' ? 'इंस्टॉल करें' : 'Install'}
          </button>
        </div>
      </div>

      {/* Sub-Tabs: History, Saved, Liked, Uploads */}
      <div className="px-4">
        <div className="flex border-b border-zinc-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 pb-2.5 flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'saved'
                ? 'text-orange-400 border-b-2 border-orange-400 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{t('saved')} ({savedList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('liked')}
            className={`flex-1 pb-2.5 flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'liked'
                ? 'text-rose-400 border-b-2 border-rose-400 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Liked ({likedList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 pb-2.5 flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'history'
                ? 'text-sky-400 border-b-2 border-sky-400 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History</span>
          </button>

          <button
            onClick={() => setActiveTab('uploads')}
            className={`flex-1 pb-2.5 flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'uploads'
                ? 'text-purple-400 border-b-2 border-purple-400 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Uploads</span>
          </button>
        </div>
      </div>

      {/* Tab Content Feed */}
      <div className="px-4">
        {activeTab === 'saved' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedList.map(item => (
              <ContentCard key={`sv_${item.id}`} content={item} layout="portrait" />
            ))}
          </div>
        )}

        {activeTab === 'liked' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {likedList.map(item => (
              <ContentCard key={`lk_${item.id}`} content={item} layout="portrait" />
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {historyList.map(item => (
              <ContentCard key={`hs_${item.id}`} content={item} layout="portrait" showProgress={true} />
            ))}
          </div>
        )}

        {activeTab === 'uploads' && (
          uploadsList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {uploadsList.map(item => (
                <ContentCard key={`up_${item.id}`} content={item} layout="portrait" />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 space-y-2">
              <Video className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-xs text-zinc-400">You haven't uploaded any videos yet</p>
              <p className="text-[11px] text-zinc-500">Tap the (+) Create button to share your comedy or shorts</p>
            </div>
          )
        )}
      </div>

      {/* SETTINGS MODAL */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-bold text-white font-hindi">
                  {t('settings')} & Preferences
                </h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto no-scrollbar space-y-4 text-xs">
              {/* Brand Concept Selector */}
              <div className="space-y-2 p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Select Brand Concept (Phase 1)</span>
                  <span className="text-[10px] text-orange-400">5 Unique Names</span>
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {BRAND_CONCEPTS.map(b => (
                    <button
                      key={b.id}
                      onClick={() => setActiveBrand(b)}
                      className={`p-2 rounded-xl text-left flex items-center justify-between transition-all ${
                        activeBrand.id === b.id
                          ? 'bg-orange-500/20 border border-orange-500 text-white font-bold'
                          : 'bg-zinc-800/60 text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      <div>
                        <span className="font-bold">{b.name} ({b.nameHindi})</span>
                        <span className="block text-[10px] text-zinc-400">{b.tagline}</span>
                      </div>
                      {activeBrand.id === b.id && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Selection */}
              <div className="space-y-1.5">
                <label className="font-bold text-zinc-300">App Language (12 Indian Languages)</label>
                <select
                  value={currentLanguage}
                  onChange={e => setLanguage(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-hindi"
                >
                  {SUPPORTED_LANGUAGES.map(l => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.nativeName} ({l.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Data Saver Mode */}
              <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">{t('dataSaver')}</p>
                  <p className="text-[10px] text-zinc-400">Save data on 4G & budget phones</p>
                </div>
                <button
                  onClick={() => updateSettings({ dataSaverMode: !settings.dataSaverMode })}
                  className={`w-11 h-6 rounded-full transition-all relative ${
                    settings.dataSaverMode ? 'bg-orange-500' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.dataSaverMode ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Subtitles Auto-Enable */}
              <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Subtitles & Captions</p>
                  <p className="text-[10px] text-zinc-400">Show Hindi / English subtitles by default</p>
                </div>
                <button
                  onClick={() => updateSettings({ subtitlesEnabled: !settings.subtitlesEnabled })}
                  className={`w-11 h-6 rounded-full transition-all relative ${
                    settings.subtitlesEnabled ? 'bg-orange-500' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.subtitlesEnabled ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Offline Entertainment Vault & Connectivity */}
              <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white">Offline Entertainment Vault</span>
                    <span className="px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 text-[10px] font-bold">
                      {useApp().cachedContents.length} Cached
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      useApp().setIsOfflineVaultOpen(true);
                      setShowSettingsModal(false);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-orange-500 text-white font-bold text-[11px] hover:bg-orange-600"
                  >
                    Open Vault
                  </button>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-zinc-800/80">
                  <p className="text-[11px] text-zinc-400">Simulate Offline Mode (Testing)</p>
                  <button
                    onClick={() => useApp().toggleSimulatedOffline()}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                      useApp().isSimulatedOffline
                        ? 'bg-amber-500 text-black'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {useApp().isSimulatedOffline ? 'Offline Active' : 'Go Offline'}
                  </button>
                </div>
              </div>

              {/* Re-run Onboarding Test */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    resetOnboarding();
                    setShowSettingsModal(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white text-xs font-semibold"
                >
                  🔄 Reset & Replay Onboarding Flow
                </button>
              </div>

              {/* Admin Moderation Panel launcher */}
              <div className="pt-1">
                <button
                  onClick={() => {
                    setIsAdminOpen(true);
                    setShowSettingsModal(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-bold hover:bg-rose-500/30"
                >
                  🛡️ Launch Admin & Moderation Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Download App Modal */}
      {showDownloadModal && (
        <DownloadAppModal onClose={() => setShowDownloadModal(false)} />
      )}
    </div>
  );
};
