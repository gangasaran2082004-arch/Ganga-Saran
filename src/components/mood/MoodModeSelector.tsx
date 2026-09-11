import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOOD_OPTIONS } from '../../data/moods';
import { MoodType } from '../../types';
import { Sparkles, X, ChevronRight } from 'lucide-react';

export const MoodModeSelector: React.FC = () => {
  const { activeMood, setActiveMood, currentLanguage, t } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeMoodObj = MOOD_OPTIONS.find(m => m.id === activeMood);

  return (
    <div className="w-full my-3 px-4">
      {/* Mood Mode Banner / Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <div className="p-1 rounded-lg bg-orange-500/20 text-orange-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            {t('moodModeTitle')}
          </span>
          <span className="text-[10px] text-zinc-400 font-normal hidden sm:inline">
            • {t('moodModeSubtitle')}
          </span>
        </div>

        {activeMood ? (
          <button
            onClick={() => setActiveMood(null)}
            className="flex items-center gap-1 text-[11px] text-orange-400 hover:text-orange-300 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 active:scale-95 transition-all"
          >
            <span>{t('resetMood')}</span>
            <X className="w-3 h-3" />
          </button>
        ) : (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white"
          >
            <span>{t('viewAll')}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Horizontal Scrollable Mood Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {MOOD_OPTIONS.map(mood => {
          const isSelected = activeMood === mood.id;
          return (
            <button
              key={mood.id}
              onClick={() => {
                if (isSelected) {
                  setActiveMood(null);
                } else {
                  setActiveMood(mood.id);
                }
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-2xl whitespace-nowrap border text-xs font-semibold transition-all flex-shrink-0 active:scale-95 ${
                isSelected
                  ? `bg-gradient-to-r ${mood.gradient} text-white border-transparent shadow-lg shadow-orange-500/20 scale-105`
                  : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'
              }`}
            >
              <span className="text-base">{mood.emoji}</span>
              <span>
                {currentLanguage === 'hi' ? mood.labelHi : mood.labelEn}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Mood Ambient Bar */}
      {activeMood && activeMoodObj && (
        <div
          className={`mt-2.5 p-3 rounded-2xl bg-gradient-to-r ${activeMoodObj.gradient} text-white flex items-center justify-between shadow-lg shadow-black/40 animate-in fade-in slide-in-from-top-2`}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{activeMoodObj.emoji}</span>
            <div>
              <p className="text-xs font-bold leading-tight">
                {currentLanguage === 'hi' ? activeMoodObj.labelHi : activeMoodObj.labelEn}
              </p>
              <p className="text-[11px] opacity-90 leading-tight">
                {currentLanguage === 'hi' ? activeMoodObj.taglineHi : activeMoodObj.taglineEn}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveMood(null)}
            className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white active:scale-95 transition-all"
            aria-label="Clear mood"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Modal Dialog for All Moods */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-400" />
                <h3 className="text-base font-bold text-white font-hindi">
                  {t('moodModeTitle')}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full bg-white/10 text-zinc-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              {t('moodModeSubtitle')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto no-scrollbar p-1">
              {MOOD_OPTIONS.map(mood => {
                const isSelected = activeMood === mood.id;
                return (
                  <button
                    key={mood.id}
                    onClick={() => {
                      setActiveMood(mood.id);
                      setIsModalOpen(false);
                    }}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      isSelected
                        ? `bg-gradient-to-r ${mood.gradient} text-white border-transparent shadow-md`
                        : 'bg-zinc-800/80 border-zinc-700 hover:border-zinc-500 text-zinc-200'
                    }`}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold leading-tight font-hindi">
                        {currentLanguage === 'hi' ? mood.labelHi : mood.labelEn}
                      </p>
                      <p className="text-[10px] opacity-80 mt-0.5 line-clamp-2">
                        {currentLanguage === 'hi' ? mood.taglineHi : mood.taglineEn}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
