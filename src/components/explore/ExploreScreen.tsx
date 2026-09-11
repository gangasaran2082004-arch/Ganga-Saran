import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ContentCategory } from '../../types';
import { ContentCard } from '../feed/ContentCard';
import { CREATORS } from '../../data/mockData';
import { Compass, Sparkles, Flame, CheckCircle2, UserPlus, UserCheck } from 'lucide-react';

const CATEGORY_CHIPS: { id: ContentCategory; labelHi: string; labelEn: string; emoji: string; color: string }[] = [
  { id: 'comedy', labelHi: 'कॉमेडी', labelEn: 'Comedy', emoji: '😂', color: 'from-amber-500 to-orange-600' },
  { id: 'movies', labelHi: 'फिल्में', labelEn: 'Movies', emoji: '🎬', color: 'from-rose-500 to-red-600' },
  { id: 'music', labelHi: 'म्यूजिक', labelEn: 'Music', emoji: '🎵', color: 'from-purple-500 to-indigo-600' },
  { id: 'web_series', labelHi: 'वेब सीरीज़', labelEn: 'Web Series', emoji: '🍿', color: 'from-blue-500 to-cyan-600' },
  { id: 'memes', labelHi: 'मीम्स', labelEn: 'Memes', emoji: '🤣', color: 'from-emerald-500 to-teal-600' },
  { id: 'shorts', labelHi: 'शॉर्ट्स', labelEn: 'Shorts', emoji: '📱', color: 'from-pink-500 to-rose-600' },
  { id: 'gaming', labelHi: 'गेमिंग', labelEn: 'Gaming', emoji: '🎮', color: 'from-violet-500 to-purple-600' },
  { id: 'celebrity', labelHi: 'सेलेब्स', labelEn: 'Celebrities', emoji: '⭐', color: 'from-yellow-500 to-amber-600' },
  { id: 'romance', labelHi: 'रोमांस', labelEn: 'Romance', emoji: '❤️', color: 'from-rose-400 to-pink-600' },
  { id: 'horror', labelHi: 'हॉरर', labelEn: 'Horror', emoji: '👻', color: 'from-zinc-600 to-zinc-900' },
  { id: 'stories', labelHi: 'कहानियाँ', labelEn: 'Stories', emoji: '📚', color: 'from-amber-600 to-yellow-700' },
  { id: 'facts', labelHi: 'फैक्ट्स', labelEn: 'Facts', emoji: '🧠', color: 'from-teal-500 to-emerald-600' },
  { id: 'sports', labelHi: 'क्रिकेट व स्पोर्ट्स', labelEn: 'Sports', emoji: '🏏', color: 'from-blue-600 to-indigo-700' },
  { id: 'trending', labelHi: 'ट्रेंडिंग', labelEn: 'Trending', emoji: '🔥', color: 'from-orange-500 to-red-600' },
];

export const ExploreScreen: React.FC = () => {
  const { contents, user, toggleFollowCreator, currentLanguage, t } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory | 'all'>('all');

  const filteredContents = selectedCategory === 'all'
    ? contents
    : contents.filter(c => c.category === selectedCategory);

  const creatorsList = Object.values(CREATORS);

  return (
    <div className="w-full pb-24 space-y-6">
      {/* Category Pills Header */}
      <div className="px-4 pt-2">
        <div className="flex items-center gap-1.5 mb-3">
          <Compass className="w-4 h-4 text-orange-400" />
          <h2 className="text-base font-black text-white font-hindi">
            {t('exploreCategories')}
          </h2>
        </div>

        {/* Categories Horizontal Grid */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700'
            }`}
          >
            All Content
          </button>
          {CATEGORY_CHIPS.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap border transition-all ${
                  isSelected
                    ? `bg-gradient-to-r ${cat.color} text-white border-transparent shadow-md`
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{currentLanguage === 'hi' ? cat.labelHi : cat.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Creator Spotlight Section */}
      <section className="space-y-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-black text-white font-hindi">
              {t('creatorSpotlight')}
            </h2>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {creatorsList.map(creator => {
            const isFollowing = user.followedCreatorIds.includes(creator.id);
            return (
              <div
                key={creator.id}
                className="w-44 p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col items-center text-center space-y-2 flex-shrink-0"
              >
                <div className="relative">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-orange-500/50"
                  />
                  {creator.verified && (
                    <CheckCircle2 className="w-4 h-4 text-sky-400 bg-black rounded-full absolute bottom-0 right-0" />
                  )}
                </div>

                <div className="w-full">
                  <h4 className="text-xs font-bold text-white truncate font-hindi">
                    {creator.name}
                  </h4>
                  <p className="text-[10px] text-zinc-400 truncate">{creator.location}</p>
                  <p className="text-[10px] text-orange-400 font-semibold mt-0.5">
                    {(creator.followersCount / 1000000).toFixed(1)}M followers
                  </p>
                </div>

                <button
                  onClick={() => toggleFollowCreator(creator.id)}
                  className={`w-full py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isFollowing
                      ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  {isFollowing ? t('following') : t('follow')}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Content Feed for Selected Category */}
      <section className="space-y-3 px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-white font-hindi">
            {selectedCategory === 'all'
              ? 'Discover Trending Entertainment'
              : `${selectedCategory.toUpperCase()} Selection`}
          </h2>
          <span className="text-xs text-zinc-500 font-medium">
            {filteredContents.length} videos
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredContents.map(item => (
            <ContentCard key={`exp_${item.id}`} content={item} layout="portrait" />
          ))}
        </div>
      </section>
    </div>
  );
};
