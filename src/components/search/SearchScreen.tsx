import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Mic, X, Flame, Clock, Filter, ArrowLeft } from 'lucide-react';
import { ContentCard } from '../feed/ContentCard';
import { ContentCategory, LanguageCode } from '../../types';
import { SUPPORTED_LANGUAGES } from '../../localization/languages';

interface SearchScreenProps {
  onClose: () => void;
}

const TRENDING_SEARCHES = [
  'Zakir Khan comedy',
  'साउथ एक्शन मूवीज',
  'Chandigarh Punjabi Beats',
  'Desi middle class memes',
  'Kesariya acoustic version',
  'IPL final over last 6 balls',
  'कैलाश मंदिर रहस्य',
];

export const SearchScreen: React.FC<SearchScreenProps> = ({ onClose }) => {
  const {
    contents,
    currentLanguage,
    t,
    searchQuery,
    setSearchQuery,
    searchCategoryFilter,
    setSearchCategoryFilter,
    searchLanguageFilter,
    setSearchLanguageFilter,
  } = useApp();

  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Desi Comedy',
    'Zakir Khan',
  ]);

  // Voice search interactive simulation
  const handleVoiceSearch = () => {
    setIsListeningVoice(true);
    setTimeout(() => {
      setSearchQuery('Zakir Khan comedy');
      setIsListeningVoice(false);
    }, 1800);
  };

  const handleSelectSearch = (query: string) => {
    setSearchQuery(query);
    if (!recentSearches.includes(query)) {
      setRecentSearches([query, ...recentSearches.slice(0, 4)]);
    }
  };

  const clearQuery = () => {
    setSearchQuery('');
  };

  // Filtered search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() && searchCategoryFilter === 'all' && searchLanguageFilter === 'all') {
      return [];
    }

    const q = searchQuery.toLowerCase().trim();

    return contents.filter(c => {
      // Category match
      if (searchCategoryFilter !== 'all' && c.category !== searchCategoryFilter) {
        return false;
      }
      // Language match
      if (searchLanguageFilter !== 'all' && c.language !== searchLanguageFilter) {
        return false;
      }

      if (!q) return true;

      const inTitle = c.title.toLowerCase().includes(q) || c.titleHindi.toLowerCase().includes(q);
      const inDesc = c.description.toLowerCase().includes(q) || c.descriptionHindi.toLowerCase().includes(q);
      const inCreator = c.creator.name.toLowerCase().includes(q) || c.creator.handle.toLowerCase().includes(q);
      const inTags = c.tags?.some(tag => tag.toLowerCase().includes(q));
      const inAudio = c.audioTrackName?.toLowerCase().includes(q);

      return inTitle || inDesc || inCreator || inTags || inAudio;
    });
  }, [contents, searchQuery, searchCategoryFilter, searchLanguageFilter]);

  return (
    <div className="fixed inset-0 z-50 bg-[#08090D] text-white flex flex-col p-4 overflow-hidden animate-in fade-in">
      {/* Top Search Input Bar */}
      <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-zinc-800 text-zinc-300"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 relative flex items-center">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            autoFocus
            className="w-full pl-9 pr-16 py-2.5 rounded-full bg-zinc-900 border border-zinc-700 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500 font-hindi"
          />

          {searchQuery && (
            <button
              onClick={clearQuery}
              className="absolute right-9 p-1 text-zinc-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Voice Search Button */}
          <button
            onClick={handleVoiceSearch}
            className={`absolute right-2 p-1.5 rounded-full transition-all ${
              isListeningVoice
                ? 'bg-rose-500 text-white animate-pulse'
                : 'text-orange-400 hover:bg-zinc-800'
            }`}
            title="Voice Search"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Voice Listening indicator banner */}
      {isListeningVoice && (
        <div className="p-3 my-2 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="font-hindi font-bold">सुन रहे हैं... बोलिए (Listening...)</span>
          </div>
          <span className="text-[10px] text-zinc-400">Hindi / English audio</span>
        </div>
      )}

      {/* Filter Chips: Category & Language */}
      <div className="flex gap-2 py-2.5 overflow-x-auto no-scrollbar border-b border-zinc-800/80">
        <select
          value={searchCategoryFilter}
          onChange={e => setSearchCategoryFilter(e.target.value as ContentCategory | 'all')}
          className="px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="comedy">Comedy 😂</option>
          <option value="music">Music 🎵</option>
          <option value="movies">Movies 🎬</option>
          <option value="web_series">Web Series 🍿</option>
          <option value="memes">Memes 🤣</option>
          <option value="facts">Facts 🧠</option>
        </select>

        <select
          value={searchLanguageFilter}
          onChange={e => setSearchLanguageFilter(e.target.value as LanguageCode | 'all')}
          className="px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 focus:outline-none"
        >
          <option value="all">All Languages</option>
          {SUPPORTED_LANGUAGES.map(l => (
            <option key={l.code} value={l.code}>
              {l.nativeName} ({l.name})
            </option>
          ))}
        </select>
      </div>

      {/* Search Body: Results vs Trends */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-3 space-y-5">
        {searchQuery.trim() || searchCategoryFilter !== 'all' || searchLanguageFilter !== 'all' ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-zinc-400">
                Found {searchResults.length} results
              </span>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-16">
                {searchResults.map(item => (
                  <ContentCard key={`sr_${item.id}`} content={item} layout="portrait" />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 space-y-2">
                <p className="text-sm font-bold text-zinc-400 font-hindi">
                  {t('noResults')}
                </p>
                <p className="text-xs text-zinc-600">
                  Try searching for 'Zakir', 'Comedy', 'Cricket' or 'Punjabi'
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Recent Searches</span>
                  </div>
                  <button
                    onClick={() => setRecentSearches([])}
                    className="text-[11px] text-zinc-500 hover:text-zinc-300"
                  >
                    Clear
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSearch(s)}
                      className="px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:border-zinc-600"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Searches */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-semibold">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                <span>Trending Right Now in India</span>
              </div>

              <div className="space-y-1.5">
                {TRENDING_SEARCHES.map((term, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectSearch(term)}
                    className="w-full p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:bg-zinc-800 flex items-center justify-between text-xs text-left transition-all"
                  >
                    <span className="text-zinc-200 font-hindi">{term}</span>
                    <span className="text-[10px] text-orange-400 font-semibold">
                      🔥 Trending #{idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
