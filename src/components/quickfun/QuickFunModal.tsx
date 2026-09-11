import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QUICK_TRIVIA } from '../../data/mockData';
import { X, Zap, Trophy, RefreshCw, Sparkles, Flame, Check, AlertCircle } from 'lucide-react';

export const QuickFunModal: React.FC = () => {
  const { isQuickFunOpen, setIsQuickFunOpen, currentLanguage, t, setActivePlayingContent, contents } = useApp();

  const [activeTab, setActiveTab] = useState<'quiz' | 'spin' | 'memes'>('quiz');

  // Quiz state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Spin wheel state
  const [isSpinning, setIsSpinning] = useState(false);
  const [spunResult, setSpunResult] = useState<string | null>(null);

  if (!isQuickFunOpen) return null;

  const currentQ = QUICK_TRIVIA[currentQIndex];

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (idx === currentQ.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex < QUICK_TRIVIA.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setScore(0);
    setQuizFinished(false);
  };

  // Spin the vibe
  const spinVibes = [
    { labelHi: 'हँसी का फव्वारा (कॉमेडी)', labelEn: 'Laugh Out Loud Comedy', category: 'comedy' },
    { labelHi: 'धमाकेदार पंजाबी बीट', labelEn: 'Bhangra Bass Drop', category: 'music' },
    { labelHi: 'हैरान करने वाला फैक्ट', labelEn: 'Mind-Blowing Fact', category: 'facts' },
    { labelHi: 'साउथ ब्लॉकबस्टर फाइट', labelEn: 'South Mass Climax', category: 'movies' },
    { labelHi: 'रोमांटिक शाम के सुर', labelEn: 'Romantic Melodies', category: 'romance' },
  ];

  const handleSpinTheVibe = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSpunResult(null);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * spinVibes.length);
      const chosen = spinVibes[randomIndex];
      setSpunResult(currentLanguage === 'hi' ? chosen.labelHi : chosen.labelEn);
      setIsSpinning(false);

      // find a matching video
      const matched = contents.find(c => c.category === chosen.category);
      if (matched) {
        setTimeout(() => {
          setActivePlayingContent(matched);
          setIsQuickFunOpen(false);
        }, 1200);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-black">
              <Zap className="w-4 h-4 fill-black" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white font-hindi">
                {t('quickFunTitle')}
              </h2>
              <p className="text-[10px] text-zinc-400">
                {t('quickFunSubtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsQuickFunOpen(false)}
            className="p-1.5 rounded-full bg-white/10 text-zinc-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Fun Mode Switcher Tabs */}
        <div className="flex border-b border-zinc-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 py-2.5 text-center transition-all ${
              activeTab === 'quiz'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/10 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {t('playQuiz')}
          </button>
          <button
            onClick={() => setActiveTab('spin')}
            className={`flex-1 py-2.5 text-center transition-all ${
              activeTab === 'spin'
                ? 'text-orange-400 border-b-2 border-orange-400 bg-orange-500/10 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {t('spinMood')}
          </button>
          <button
            onClick={() => setActiveTab('memes')}
            className={`flex-1 py-2.5 text-center transition-all ${
              activeTab === 'memes'
                ? 'text-rose-400 border-b-2 border-rose-400 bg-rose-500/10 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {t('memeWall')}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 flex-1 overflow-y-auto no-scrollbar">
          {/* TAB 1: Trivia Quiz */}
          {activeTab === 'quiz' && (
            <div className="space-y-4">
              {!quizFinished ? (
                <>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400 font-medium">
                      Question {currentQIndex + 1} of {QUICK_TRIVIA.length}
                    </span>
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5" />
                      Score: {score}
                    </span>
                  </div>

                  {/* Question Box */}
                  <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                    <h3 className="text-sm font-bold text-white leading-relaxed font-hindi">
                      {currentLanguage === 'hi' ? currentQ.questionHi : currentQ.questionEn}
                    </h3>
                  </div>

                  {/* Options */}
                  <div className="space-y-2">
                    {(currentLanguage === 'hi' ? currentQ.optionsHi : currentQ.optionsEn).map(
                      (opt, idx) => {
                        let btnStyle = 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700';
                        if (selectedOption !== null) {
                          if (idx === currentQ.correctIndex) {
                            btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                          } else if (selectedOption === idx) {
                            btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectOption(idx)}
                            className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {selectedOption !== null && idx === currentQ.correctIndex && (
                              <Check className="w-4 h-4 text-emerald-400" />
                            )}
                          </button>
                        );
                      }
                    )}
                  </div>

                  {/* Fun Fact After Answer */}
                  {selectedOption !== null && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 flex items-start gap-2 animate-in fade-in">
                      <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-bold">रोचक तथ्य (Fun Fact):</strong>
                        <span>
                          {currentLanguage === 'hi' ? currentQ.funFactHi : currentQ.funFactEn}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Next CTA */}
                  {selectedOption !== null && (
                    <button
                      onClick={handleNextQuestion}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-xs hover:brightness-110 active:scale-95 transition-all"
                    >
                      {currentQIndex < QUICK_TRIVIA.length - 1 ? 'Next Question →' : 'See Final Score 🏆'}
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center py-6 space-y-4 animate-in fade-in zoom-in-95">
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-hindi">
                      शानदार प्रदर्शन!
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      You scored {score} out of {QUICK_TRIVIA.length} in Bollywood Entertainment Trivia!
                    </p>
                  </div>
                  <button
                    onClick={handleResetQuiz}
                    className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-white hover:bg-white/20 flex items-center gap-1.5 mx-auto"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Play Again
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Spin the Vibe Wheel */}
          {activeTab === 'spin' && (
            <div className="text-center py-4 space-y-5">
              <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                <div
                  className={`w-full h-full rounded-full border-4 border-dashed border-orange-500 flex items-center justify-center p-2 transition-all duration-1000 ${
                    isSpinning ? 'rotate-[720deg] scale-95' : ''
                  }`}
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-orange-500 via-rose-500 to-purple-600 flex items-center justify-center text-white text-3xl shadow-lg">
                    {isSpinning ? '🎰' : '🎯'}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-zinc-400">
                  {currentLanguage === 'hi'
                    ? 'व्हील घुमाएं और 10 सेकंड में आपके लिए बेस्ट वीडियो प्ले होगा'
                    : 'Spin the wheel and get an instant curated entertainment drop in 10 seconds!'}
                </p>
              </div>

              {spunResult && (
                <div className="p-3 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs font-bold animate-in fade-in">
                  🎉 Selected: {spunResult}
                  <span className="block text-[10px] text-zinc-400 mt-0.5">
                    Playing video automatically...
                  </span>
                </div>
              )}

              <button
                onClick={handleSpinTheVibe}
                disabled={isSpinning}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold text-xs shadow-lg shadow-orange-500/30 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
              >
                {isSpinning ? 'Spinning The Vibe...' : '🎲 Spin The Entertainment Wheel'}
              </button>
            </div>
          )}

          {/* TAB 3: Desi Meme Express */}
          {activeTab === 'memes' && (
            <div className="space-y-3">
              <p className="text-xs text-zinc-400 text-center">
                {currentLanguage === 'hi' ? 'आज के सबसे फनी देसी मीम्स' : 'Fresh Desi Memes Trending Today'}
              </p>

              <div className="rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
                <img
                  src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&auto=format&fit=crop&q=80"
                  alt="Meme"
                  className="w-full h-48 object-cover"
                />
                <div className="p-3">
                  <p className="text-xs font-bold text-white">
                    When salary credits on 1st vs status on 15th 😭
                  </p>
                  <p className="text-[11px] text-zinc-400 font-hindi mt-0.5">
                    1 तारीख को अंबानी वाली फीलिंग, 15 को पार्ले-जी चाय में डुबाकर खाना 😂
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-zinc-300">
                      😂 2.4k
                    </button>
                    <button className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-zinc-300">
                      ❤️ 1.8k
                    </button>
                    <button className="flex-1 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
                      WhatsApp Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
