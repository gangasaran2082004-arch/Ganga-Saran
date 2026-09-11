import React from 'react';
import { useApp } from '../../context/AppContext';
import { ContentItem } from '../../types';
import { Play, Heart, Bookmark, Eye, CheckCircle2, Clock, DownloadCloud, Check } from 'lucide-react';

interface ContentCardProps {
  content: ContentItem;
  layout?: 'landscape' | 'portrait' | 'horizontal_carousel';
  showProgress?: boolean;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  content,
  layout = 'portrait',
  showProgress = false,
}) => {
  const {
    currentLanguage,
    setActivePlayingContent,
    toggleLikeContent,
    toggleSaveContent,
    user,
    isContentCached,
    cacheContentForOffline,
    removeCachedContent,
  } = useApp();

  const isLiked = user.likedContentIds.includes(content.id);
  const isSaved = user.savedContentIds.includes(content.id);
  const isCached = isContentCached(content.id);

  // View count formatter
  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(0)}K`;
    return views.toString();
  };

  const title = currentLanguage === 'hi' ? content.titleHindi : content.title;

  if (layout === 'horizontal_carousel') {
    return (
      <div
        className="w-44 flex-shrink-0 group relative rounded-2xl overflow-hidden bg-zinc-900/90 border border-zinc-800/80 shadow-md transition-all duration-300 hover:border-zinc-700 hover:scale-[1.02] cursor-pointer select-none"
        onClick={() => setActivePlayingContent(content)}
      >
        {/* Poster Image */}
        <div className="relative aspect-[9/14] w-full overflow-hidden bg-zinc-950">
          <img
            src={content.posterUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F] via-black/20 to-transparent" />

          {/* Duration Badge */}
          <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1">
            <Clock className="w-2.5 h-2.5 text-orange-400" />
            {content.duration}
          </span>

          {/* Language Pill */}
          <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-orange-600/80 backdrop-blur-md text-[9px] font-extrabold uppercase text-white tracking-wider">
            {content.language.toUpperCase()}
          </span>

          {/* Play Icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-orange-500/90 text-white flex items-center justify-center shadow-lg shadow-orange-500/50 scale-90 group-hover:scale-100 transition-transform">
              <Play className="w-5 h-5 fill-white ml-0.5" />
            </div>
          </div>

          {/* Continue Watching Bar */}
          {showProgress && content.watchProgress && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
              <div
                className="h-full bg-orange-500 rounded-r-full"
                style={{ width: `${content.watchProgress}%` }}
              />
            </div>
          )}
        </div>

        {/* Card Details */}
        <div className="p-2.5 space-y-1">
          <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight font-hindi group-hover:text-orange-400 transition-colors">
            {title}
          </h4>

          <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-0.5">
            <span className="flex items-center gap-1 truncate max-w-[90px]">
              {content.creator.name}
              {content.creator.verified && (
                <CheckCircle2 className="w-2.5 h-2.5 text-sky-400 flex-shrink-0" />
              )}
            </span>
            <span className="flex items-center gap-0.5 font-medium">
              <Eye className="w-2.5 h-2.5" />
              {formatViews(content.views)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Standard portrait card
  return (
    <div
      className="group relative rounded-2xl overflow-hidden bg-zinc-900/80 border border-zinc-800 shadow-sm transition-all duration-300 hover:border-zinc-700 hover:shadow-lg hover:shadow-orange-500/5 cursor-pointer flex flex-col justify-between"
      onClick={() => setActivePlayingContent(content)}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
        <img
          src={content.posterUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-[10px] font-bold text-white">
          {content.duration}
        </span>

        <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[9px] font-bold uppercase text-white">
          {content.category}
        </span>

        {/* Play Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>
      </div>

      <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mb-1">
            <span className="text-orange-400 font-semibold uppercase tracking-wider">
              {content.language.toUpperCase()}
            </span>
            <span>•</span>
            <span>{content.publishedAt}</span>
          </div>

          <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-2 font-hindi group-hover:text-orange-400 transition-colors leading-snug">
            {title}
          </h3>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5 truncate max-w-[120px]">
            <img
              src={content.creator.avatar}
              alt={content.creator.name}
              className="w-4 h-4 rounded-full object-cover"
            />
            <span className="text-[11px] truncate">{content.creator.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={e => {
                e.stopPropagation();
                if (isCached) {
                  removeCachedContent(content.id);
                } else {
                  cacheContentForOffline(content);
                }
              }}
              className={`p-1 rounded-full hover:bg-white/10 active:scale-95 transition-all ${
                isCached ? 'text-emerald-400' : 'text-zinc-400 hover:text-white'
              }`}
              title={isCached ? 'Downloaded for offline' : 'Download for offline playback'}
            >
              {isCached ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <DownloadCloud className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                toggleLikeContent(content.id);
              }}
              className={`p-1 rounded-full hover:bg-white/10 active:scale-95 transition-all ${
                isLiked ? 'text-rose-500' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                toggleSaveContent(content.id);
              }}
              className={`p-1 rounded-full hover:bg-white/10 active:scale-95 transition-all ${
                isSaved ? 'text-amber-400' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
