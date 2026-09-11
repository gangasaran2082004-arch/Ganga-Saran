import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ContentCategory, LanguageCode } from '../../types';
import { SUPPORTED_LANGUAGES } from '../../localization/languages';
import {
  X,
  UploadCloud,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Users,
  Video,
  Eye,
} from 'lucide-react';

interface CreatorStudioModalProps {
  onClose: () => void;
}

export const CreatorStudioModal: React.FC<CreatorStudioModalProps> = ({ onClose }) => {
  const {
    user,
    publishCreatorContent,
    currentLanguage,
    t,
    setActiveTab,
  } = useApp();

  const [activeTab, setActiveTabLocal] = useState<'upload' | 'analytics'>('upload');

  // Form states
  const [title, setTitle] = useState('');
  const [titleHindi, setTitleHindi] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ContentCategory>('comedy');
  const [language, setLanguage] = useState<LanguageCode>('hi');
  const [videoType, setVideoType] = useState<'short' | 'video'>('short');
  const [tags, setTags] = useState('#DesiFun #Tarang #Comedy');
  const [isSimulatingSafety, setIsSimulatingSafety] = useState(false);
  const [safetyVerified, setSafetyVerified] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRunSafetyCheck = () => {
    setIsSimulatingSafety(true);
    setTimeout(() => {
      setIsSimulatingSafety(false);
      setSafetyVerified(true);
    }, 1200);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    publishCreatorContent({
      title,
      titleHindi: titleHindi || title,
      description,
      descriptionHindi: description,
      category,
      language,
      duration: videoType === 'short' ? '0:45' : '12:30',
      durationSeconds: videoType === 'short' ? 45 : 750,
      mediaType: videoType,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
      tags: tags.split(' '),
      audioTrackName: `${user.name} Original Sound`,
      aspectRatio: videoType === 'short' ? '9:16' : '16:9',
      hasSubtitles: true,
      moods: ['hasna', 'trending'],
    });

    setIsSuccess(true);
    setTimeout(() => {
      onClose();
      setActiveTab('home');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="p-4 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white font-hindi">
                {t('creatorStudio')}
              </h2>
              <p className="text-[10px] text-zinc-400">
                Upload & monetize your videos across 12 Indian languages
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

        {/* Studio Tabs: Upload vs Analytics */}
        <div className="flex border-b border-zinc-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTabLocal('upload')}
            className={`flex-1 py-3 text-center transition-all ${
              activeTab === 'upload'
                ? 'text-orange-400 border-b-2 border-orange-400 bg-orange-500/10 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {t('uploadContent')}
          </button>
          <button
            onClick={() => setActiveTabLocal('analytics')}
            className={`flex-1 py-3 text-center transition-all ${
              activeTab === 'analytics'
                ? 'text-orange-400 border-b-2 border-orange-400 bg-orange-500/10 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {t('analytics')} & Earnings
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 flex-1 overflow-y-auto no-scrollbar">
          {activeTab === 'upload' ? (
            isSuccess ? (
              <div className="py-12 text-center space-y-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-white font-hindi">
                  Video Published Successfully! 🎉
                </h3>
                <p className="text-xs text-zinc-400">
                  Your video is now live on Tarang and ready for discovery.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePublish} className="space-y-4">
                {/* File Dropzone */}
                <div className="border-2 border-dashed border-zinc-700 hover:border-orange-500/50 rounded-2xl p-6 text-center cursor-pointer bg-zinc-900/40 hover:bg-zinc-900/80 transition-all">
                  <UploadCloud className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-white">
                    Select video or drag & drop MP4 / MOV
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Up to 4K 60fps • Supports vertical (9:16) and landscape (16:9)
                  </p>
                </div>

                {/* Video Format Choice */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVideoType('short')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 ${
                      videoType === 'short'
                        ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <span>📱 9:16 Short (Reel)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoType('video')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 ${
                      videoType === 'video'
                        ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <span>🎬 16:9 Video Episode</span>
                  </button>
                </div>

                {/* Title (English) */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">
                    Video Title (English / Hinglish) *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. My Funniest College Roommate Story"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Title (Hindi) */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">
                    शीर्षक (हिंदी में) - Dual Language Discovery
                  </label>
                  <input
                    type="text"
                    value={titleHindi}
                    onChange={e => setTitleHindi(e.target.value)}
                    placeholder="जैसे: कॉलेज हॉस्टल का सबसे मजेदार किस्सा"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-orange-500 font-hindi"
                  />
                </div>

                {/* Category & Language Selection */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-300">Category</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value as ContentCategory)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none"
                    >
                      <option value="comedy">Comedy 😂</option>
                      <option value="music">Music 🎵</option>
                      <option value="movies">Movies 🎬</option>
                      <option value="memes">Memes 🤣</option>
                      <option value="facts">Facts 🧠</option>
                      <option value="gaming">Gaming 🎮</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-300">Audio Language</label>
                    <select
                      value={language}
                      onChange={e => setLanguage(e.target.value as LanguageCode)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none"
                    >
                      {SUPPORTED_LANGUAGES.map(l => (
                        <option key={l.code} value={l.code}>
                          {l.nativeName} ({l.name})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">Description & Notes</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Tell your viewers what this video is about..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-orange-500 font-hindi"
                  />
                </div>

                {/* AI Safety Pre-check Simulation */}
                <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="font-semibold">AI Safety & Copyright Pre-check</span>
                    </div>
                    {!safetyVerified && (
                      <button
                        type="button"
                        onClick={handleRunSafetyCheck}
                        disabled={isSimulatingSafety}
                        className="px-2.5 py-1 rounded-lg bg-orange-500/20 text-orange-400 text-[10px] font-bold hover:bg-orange-500/30"
                      >
                        {isSimulatingSafety ? 'Checking...' : 'Run Check'}
                      </button>
                    )}
                  </div>
                  {safetyVerified && (
                    <div className="flex items-center gap-2 text-emerald-400 text-xs animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approved: Clean audio, no copyright strikes detected.</span>
                    </div>
                  )}
                </div>

                {/* Publish CTA */}
                <button
                  type="submit"
                  disabled={!title.trim()}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold text-xs shadow-lg shadow-orange-500/30 hover:brightness-110 active:scale-95 disabled:opacity-40 transition-all"
                >
                  🚀 Publish Video To Tarang Feed
                </button>
              </form>
            )
          ) : (
            /* Analytics Dashboard */
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
                  <div className="flex items-center gap-1 text-zinc-400 text-xs">
                    <Eye className="w-3.5 h-3.5 text-orange-400" />
                    <span>Total Views</span>
                  </div>
                  <p className="text-lg font-black text-white">142,800</p>
                  <p className="text-[10px] text-emerald-400 font-bold">+24% this week</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
                  <div className="flex items-center gap-1 text-zinc-400 text-xs">
                    <Users className="w-3.5 h-3.5 text-sky-400" />
                    <span>Followers</span>
                  </div>
                  <p className="text-lg font-black text-white">{user.followersCount}</p>
                  <p className="text-[10px] text-emerald-400 font-bold">+52 new today</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
                  <div className="flex items-center gap-1 text-zinc-400 text-xs">
                    <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                    <span>Engagement</span>
                  </div>
                  <p className="text-lg font-black text-white">8.4%</p>
                  <p className="text-[10px] text-zinc-500">Above average</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
                  <div className="flex items-center gap-1 text-zinc-400 text-xs">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Creator Rewards</span>
                  </div>
                  <p className="text-lg font-black text-emerald-400">₹{user.walletBalance}</p>
                  <p className="text-[10px] text-zinc-500">UPI Instant payout ready</p>
                </div>
              </div>

              {/* Creator Benefits Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/20 via-purple-500/20 to-pink-500/20 border border-orange-500/30 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-orange-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Tarang Creator Accelerator Fund 2026</span>
                </div>
                <p className="text-zinc-300 text-[11px] leading-relaxed">
                  Earn up to ₹50,000 every month for high-retention regional language shorts in Hindi, Punjabi, Marathi, Telugu, Tamil, and Bengali.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
