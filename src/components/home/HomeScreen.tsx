import React from 'react';
import { useApp } from '../../context/AppContext';
import { MoodModeSelector } from '../mood/MoodModeSelector';
import { ContentCard } from '../feed/ContentCard';
import { DesiVibeStudio } from '../unique/DesiVibeStudio';
import { Flame, Sparkles, Tv, Laugh, Music, Smile, Compass, ChevronRight, Zap } from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    filteredFeed,
    contents,
    user,
    t,
    currentLanguage,
    setActiveTab,
    setIsQuickFunOpen,
    settings,
  } = useApp();

  // Filter sections from data
  const continueWatchingItems = contents.filter(c =>
    user.watchHistory.some(w => w.contentId === c.id)
  );

  const trendingItems = contents.filter(c => c.trendingRank && c.trendingRank > 0);
  const comedyItems = contents.filter(c => c.category === 'comedy');
  const musicItems = contents.filter(c => c.category === 'music' || c.category === 'romance');
  const shortItems = contents.filter(c => c.mediaType === 'short');
  const memesItems = contents.filter(c => c.category === 'memes');
  const webSeriesItems = contents.filter(c => c.category === 'web_series' || c.category === 'movies');

  return (
    <div className="w-full pb-24 space-y-6">
      {/* Mood Mode Signature Feature */}
      <MoodModeSelector />

      {/* Unique Desi Vibe Studio & Soundboard */}
      <DesiVibeStudio />

      {/* Data Saver Mode Active Notification (for low-end Android / 4G) */}
      {settings.dataSaverMode && (
        <div className="mx-4 p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
            <span>{t('slowNetworkNotice')}</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20">
            Active
          </span>
        </div>
      )}

      {/* Continue Watching (if user has watch progress) */}
      {continueWatchingItems.length > 0 && (
        <section className="space-y-2.5">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-1.5">
              <Tv className="w-4 h-4 text-orange-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-hindi">
                {t('continueWatching')}
              </h2>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-1">
            {continueWatchingItems.map(item => (
              <ContentCard
                key={`cw_${item.id}`}
                content={item}
                layout="horizontal_carousel"
                showProgress={true}
              />
            ))}
          </div>
        </section>
      )}

      {/* Trending Now Horizontal Carousel */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-rose-500" />
            <h2 className="text-sm font-black text-white font-hindi">
              {t('trendingNow')}
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('trending')}
            className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-0.5"
          >
            <span>{t('viewAll')}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-1">
          {trendingItems.map(item => (
            <ContentCard
              key={`tr_${item.id}`}
              content={item}
              layout="horizontal_carousel"
            />
          ))}
        </div>
      </section>

      {/* Quick 5-Min Entertainment Banner */}
      <div className="px-4">
        <div
          onClick={() => setIsQuickFunOpen(true)}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-purple-500/20 border border-orange-500/30 flex items-center justify-between cursor-pointer hover:border-orange-500/50 active:scale-[0.99] transition-all shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-black font-black">
              <Zap className="w-5 h-5 fill-black" />
            </div>
            <div>
              <h3 className="text-xs font-black text-white font-hindi">
                {t('quickFunTitle')}
              </h3>
              <p className="text-[11px] text-zinc-400">
                {currentLanguage === 'hi'
                  ? 'बॉलीवुड क्विज, मीम एक्सप्रेस और स्पिन व्हील'
                  : 'Bollywood trivia, meme express & mood spin roulette'}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-400 bg-amber-500/20 px-2.5 py-1 rounded-xl">
            Play →
          </span>
        </div>
      </div>

      {/* Recommended For You Section (Personalized) */}
      <section className="space-y-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <div>
              <h2 className="text-sm font-black text-white font-hindi">
                {t('recommendedForYou')}
              </h2>
              <p className="text-[10px] text-zinc-400">
                {t('whyRecommended')}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredFeed.slice(0, 4).map(item => (
            <ContentCard key={`rec_${item.id}`} content={item} layout="portrait" />
          ))}
        </div>
      </section>

      {/* Short Videos Spotlight Carousel */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">📱</span>
            <h2 className="text-sm font-black text-white font-hindi">
              {t('shortVideosTitle')}
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('shorts')}
            className="text-[11px] text-orange-400 font-semibold hover:underline flex items-center gap-0.5"
          >
            <span>Full Screen Shorts →</span>
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-1">
          {shortItems.map(item => (
            <ContentCard
              key={`sh_${item.id}`}
              content={item}
              layout="horizontal_carousel"
            />
          ))}
        </div>
      </section>

      {/* Comedy Zone Section */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-1.5">
            <Laugh className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-black text-white font-hindi">
              {t('comedyZone')}
            </h2>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-1">
          {comedyItems.map(item => (
            <ContentCard
              key={`com_${item.id}`}
              content={item}
              layout="horizontal_carousel"
            />
          ))}
        </div>
      </section>

      {/* Music & Melodies Section */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-1.5">
            <Music className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-black text-white font-hindi">
              {t('musicAndBeats')}
            </h2>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-1">
          {musicItems.map(item => (
            <ContentCard
              key={`mus_${item.id}`}
              content={item}
              layout="horizontal_carousel"
            />
          ))}
        </div>
      </section>

      {/* Desi Memes & Fun Section */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-1.5">
            <Smile className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-black text-white font-hindi">
              {t('memesZone')}
            </h2>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-1">
          {memesItems.map(item => (
            <ContentCard
              key={`mem_${item.id}`}
              content={item}
              layout="horizontal_carousel"
            />
          ))}
        </div>
      </section>

      {/* Web Series & Blockbusters */}
      <section className="space-y-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Tv className="w-4 h-4 text-sky-400" />
            <h2 className="text-sm font-black text-white font-hindi">
              {t('webSeriesTitle')}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {webSeriesItems.map(item => (
            <ContentCard key={`ws_${item.id}`} content={item} layout="portrait" />
          ))}
        </div>
      </section>
    </div>
  );
};
