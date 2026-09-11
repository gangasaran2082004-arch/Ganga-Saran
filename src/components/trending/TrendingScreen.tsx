import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ContentCard } from '../feed/ContentCard';
import { Flame, Trophy, Play, Eye, Heart } from 'lucide-react';

export const TrendingScreen: React.FC = () => {
  const { contents, t, currentLanguage, setActivePlayingContent } = useApp();
  const [filterTab, setFilterTab] = useState<'all' | 'shorts' | 'comedy' | 'music'>('all');

  const filteredTrending = contents.filter(c => {
    if (filterTab === 'shorts') return c.mediaType === 'short';
    if (filterTab === 'comedy') return c.category === 'comedy';
    if (filterTab === 'music') return c.category === 'music' || c.category === 'romance';
    return true;
  }).sort((a, b) => b.views - a.views);

  const topVideo = filteredTrending[0];

  return (
    <div className="w-full pb-24 space-y-6">
      {/* Header */}
      <div className="px-4 pt-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-gradient-to-tr from-rose-500 to-orange-500 text-white">
            <Flame className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h1 className="text-base font-black text-white font-hindi">
              {t('trendingNow')}
            </h1>
            <p className="text-[11px] text-zinc-400">
              Top viral entertainment hits across India today
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', labelHi: 'सभी ट्रेंड्स', labelEn: 'All India' },
            { id: 'shorts', labelHi: 'शॉर्ट्स 📱', labelEn: 'Viral Shorts' },
            { id: 'comedy', labelHi: 'कॉमेडी 😂', labelEn: 'Top Comedy' },
            { id: 'music', labelHi: 'म्यूजिक 🎵', labelEn: 'Hit Songs' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterTab === tab.id
                  ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/20'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700'
              }`}
            >
              {currentLanguage === 'hi' ? tab.labelHi : tab.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Hero #1 Trending Spotlight Card */}
      {topVideo && (
        <div className="px-4">
          <div
            onClick={() => setActivePlayingContent(topVideo)}
            className="group relative rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-xl cursor-pointer"
          >
            <div className="relative aspect-video w-full overflow-hidden">
              <img
                src={topVideo.posterUrl}
                alt={topVideo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              {/* Gold #1 Badge */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black text-xs font-black flex items-center gap-1 shadow-lg">
                <Trophy className="w-3.5 h-3.5 fill-black" />
                <span>#1 TRENDING IN INDIA</span>
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/40 group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-white ml-0.5" />
                </div>
              </div>
            </div>

            <div className="p-4 space-y-1.5">
              <h3 className="text-sm sm:text-base font-bold text-white font-hindi group-hover:text-orange-400 transition-colors">
                {currentLanguage === 'hi' ? topVideo.titleHindi : topVideo.title}
              </h3>
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>{topVideo.creator.name}</span>
                <span className="flex items-center gap-1 text-orange-400 font-bold">
                  <Eye className="w-3.5 h-3.5" />
                  {(topVideo.views / 1000000).toFixed(1)}M views
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ranked List */}
      <section className="space-y-3 px-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Ranked Viral Videos
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredTrending.slice(1).map((item, index) => (
            <div key={item.id} className="relative">
              {/* Rank indicator badge */}
              <div className="absolute top-2 left-2 z-10 w-6 h-6 rounded-full bg-black/80 backdrop-blur-md text-white border border-white/20 text-xs font-black flex items-center justify-center">
                #{index + 2}
              </div>
              <ContentCard content={item} layout="portrait" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
