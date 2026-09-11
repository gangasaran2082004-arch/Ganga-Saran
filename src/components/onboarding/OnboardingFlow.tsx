import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../../localization/languages';
import { LanguageCode, ContentCategory } from '../../types';
import { BrandLogo } from '../brand/BrandLogo';
import { Check, Sparkles, ArrowRight, Compass, ShieldCheck } from 'lucide-react';

const INTEREST_OPTIONS: { id: ContentCategory; labelHi: string; labelEn: string; emoji: string }[] = [
  { id: 'comedy', labelHi: 'कॉमेडी व स्टैंडअप', labelEn: 'Comedy & Standup', emoji: '😂' },
  { id: 'movies', labelHi: 'फिल्में व ट्रेलर', labelEn: 'Movies & Trailers', emoji: '🎬' },
  { id: 'music', labelHi: 'म्यूजिक व गाने', labelEn: 'Music & Songs', emoji: '🎵' },
  { id: 'memes', labelHi: 'मीम्स व चुटकुले', labelEn: 'Memes & Humor', emoji: '🤣' },
  { id: 'shorts', labelHi: 'शॉर्ट वीडियो', labelEn: 'Short Videos', emoji: '📱' },
  { id: 'gaming', labelHi: 'गेमिंग', labelEn: 'Gaming', emoji: '🎮' },
  { id: 'celebrity', labelHi: 'सेलेब्स व गपशप', labelEn: 'Celebrities', emoji: '⭐' },
  { id: 'romance', labelHi: 'रोमांस', labelEn: 'Romance', emoji: '❤️' },
  { id: 'horror', labelHi: 'हॉरर व रहस्य', labelEn: 'Horror & Mystery', emoji: '👻' },
  { id: 'stories', labelHi: 'कहानियाँ व किस्से', labelEn: 'Stories & Folk', emoji: '📚' },
  { id: 'facts', labelHi: 'रोचक तथ्य (फैक्ट्स)', labelEn: 'Fascinating Facts', emoji: '🧠' },
  { id: 'trending', labelHi: 'ट्रेंडिंग', labelEn: 'Trending Hits', emoji: '🔥' },
  { id: 'sports', labelHi: 'खेल व क्रिकेट', labelEn: 'Sports & Cricket', emoji: '🏏' },
  { id: 'drama', labelHi: 'ड्रामा व भावनाएं', labelEn: 'Drama & Emotion', emoji: '🎭' },
  { id: 'international', labelHi: 'ग्लोबल ट्रेंड्स', labelEn: 'Global Entertainment', emoji: '🌍' },
];

export const OnboardingFlow: React.FC = () => {
  const { completeOnboarding, setLanguage, currentLanguage, t } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedLangs, setSelectedLangs] = useState<LanguageCode[]>(['hi', 'en']);
  const [selectedInterests, setSelectedInterests] = useState<ContentCategory[]>([
    'comedy',
    'music',
    'shorts',
    'memes',
  ]);

  const toggleLanguage = (code: LanguageCode) => {
    setSelectedLangs(prev => {
      if (prev.includes(code)) {
        if (prev.length <= 1) return prev; // keep at least one
        return prev.filter(c => c !== code);
      } else {
        return [...prev, code];
      }
    });
    // Set first selected as primary
    setLanguage(code);
  };

  const toggleInterest = (category: ContentCategory) => {
    setSelectedInterests(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleNext = () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) {
      setStep(4);
      setTimeout(() => {
        completeOnboarding(selectedLangs, selectedInterests);
      }, 1600);
    }
  };

  const handleSkip = () => {
    completeOnboarding(['hi', 'en'], ['comedy', 'music', 'shorts', 'memes']);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-[#08090D] text-white p-5 overflow-y-auto">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between pt-2">
        <BrandLogo size="sm" />
        <button
          onClick={handleSkip}
          className="text-xs font-medium text-zinc-400 hover:text-white px-3 py-1.5 rounded-full bg-white/5 border border-white/10 active:scale-95 transition-all"
        >
          {t('skipOnboarding')}
        </button>
      </div>

      {/* STEP 1: Welcome & Value Proposition */}
      {step === 1 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center my-auto py-8 space-y-6 animate-in fade-in duration-300">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-orange-500 via-rose-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-orange-500/30">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-black uppercase tracking-wider">
              New 2026
            </span>
          </div>

          <div className="space-y-3 max-w-sm">
            <h1 className="text-2xl font-black text-white leading-snug">
              {t('onboardingStep1Title')}
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {currentLanguage === 'hi'
                ? 'भारत का सबसे तेज, हल्का और संपूर्ण मनोरंजन ऐप। शॉर्ट्स, कॉमेडी, म्यूजिक, वेब सीरीज़ और मीम्स—सब एक जगह!'
                : 'India’s fastest and most engaging entertainment super-app. High-speed shorts, standup comedy, hit music & memes!'}
            </p>
          </div>

          {/* Quick Highlights Grid */}
          <div className="grid grid-cols-2 gap-2.5 w-full max-w-xs text-left text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
              <span className="text-base">⚡</span>
              <div>
                <p className="font-semibold text-white">Ultra Smooth</p>
                <p className="text-[10px] text-zinc-400">Low RAM & 4G ready</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
              <span className="text-base">🗣️</span>
              <div>
                <p className="font-semibold text-white">12 Languages</p>
                <p className="text-[10px] text-zinc-400">Hindi, English & more</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
              <span className="text-base">🎭</span>
              <div>
                <p className="font-semibold text-white">Mood Mode</p>
                <p className="text-[10px] text-zinc-400">Vibe-based feeds</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
              <span className="text-base">🛡️</span>
              <div>
                <p className="font-semibold text-white">Safe & Clean</p>
                <p className="text-[10px] text-zinc-400">AI Verified content</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Language Selection (12 Indian Languages) */}
      {step === 2 && (
        <div className="flex-1 flex flex-col my-auto py-4 space-y-4 animate-in fade-in duration-300">
          <div className="space-y-1 text-center">
            <h2 className="text-xl font-bold text-white">
              {t('onboardingStep2Title')}
            </h2>
            <p className="text-xs text-zinc-400">
              {t('onboardingStep2Subtitle')}
            </p>
          </div>

          {/* 12 Languages Grid */}
          <div className="grid grid-cols-2 gap-2.5 max-h-[55vh] overflow-y-auto no-scrollbar p-1">
            {SUPPORTED_LANGUAGES.map(lang => {
              const isSelected = selectedLangs.includes(lang.code);
              return (
                <button
                  key={lang.code}
                  onClick={() => toggleLanguage(lang.code)}
                  className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-br from-orange-500/20 to-rose-500/20 border-orange-500 shadow-md shadow-orange-500/20'
                      : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-base">{lang.flag}</span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div className="mt-2">
                    <p className="text-base font-bold text-white font-hindi">
                      {lang.nativeName}
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      {lang.name} • {lang.speakersText}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="text-center text-[11px] text-orange-400/90 font-medium">
            ✓ {selectedLangs.length} {t('selectedInterestsCount')} (Tap to add multiple)
          </div>
        </div>
      )}

      {/* STEP 3: Entertainment Interests Selection */}
      {step === 3 && (
        <div className="flex-1 flex flex-col my-auto py-4 space-y-4 animate-in fade-in duration-300">
          <div className="space-y-1 text-center">
            <h2 className="text-xl font-bold text-white">
              {t('onboardingStep3Title')}
            </h2>
            <p className="text-xs text-zinc-400">
              {t('onboardingStep3Subtitle')}
            </p>
          </div>

          {/* Interests Chips Grid */}
          <div className="grid grid-cols-2 gap-2 max-h-[55vh] overflow-y-auto no-scrollbar p-1">
            {INTEREST_OPTIONS.map(item => {
              const isSelected = selectedInterests.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleInterest(item.id)}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-orange-500/25 to-purple-500/25 border-orange-500 text-white font-semibold'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-xl flex-shrink-0">{item.emoji}</span>
                  <div className="min-w-0">
                    <p className="text-xs truncate font-medium">
                      {currentLanguage === 'hi' ? item.labelHi : item.labelEn}
                    </p>
                  </div>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-orange-400 ml-auto flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="text-center text-[11px] text-zinc-400">
            {selectedInterests.length < 3 ? (
              <span className="text-amber-400 font-medium">
                {currentLanguage === 'hi' ? 'कम से कम 3 रुचियाँ चुनें' : 'Choose at least 3 interests'}
              </span>
            ) : (
              <span className="text-emerald-400 font-medium">
                ✓ {selectedInterests.length} {t('selectedInterestsCount')}
              </span>
            )}
          </div>
        </div>
      )}

      {/* STEP 4: Personalization Engine Loading */}
      {step === 4 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center my-auto py-8 space-y-6 animate-in fade-in zoom-in-95 duration-500">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin" />
            <Sparkles className="w-8 h-8 text-orange-400" />
          </div>

          <div className="space-y-2 max-w-xs">
            <h2 className="text-xl font-bold text-white">
              {t('onboardingStep4Title')}
            </h2>
            <p className="text-xs text-zinc-400">
              {t('onboardingStep4Subtitle')}
            </p>
          </div>

          {/* Dynamic Checklist */}
          <div className="w-full max-w-xs space-y-2 text-left text-xs bg-zinc-900/70 p-4 rounded-2xl border border-zinc-800">
            <div className="flex items-center gap-2 text-emerald-400">
              <Check className="w-4 h-4" />
              <span>12 Regional Indian Audio engines initialized</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <Check className="w-4 h-4" />
              <span>Smart low-data video preloading enabled</span>
            </div>
            <div className="flex items-center gap-2 text-orange-400 animate-pulse">
              <Sparkles className="w-4 h-4" />
              <span>Generating Mood Mode & Comedy channels...</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Step Indicator & Continue CTA Button */}
      {step < 4 && (
        <div className="w-full pt-4 space-y-3">
          <div className="flex justify-center gap-1.5">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  step === i
                    ? 'w-7 bg-orange-500'
                    : 'w-2 bg-zinc-700'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={step === 3 && selectedInterests.length < 3}
            className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] ${
              step === 3 && selectedInterests.length < 3
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 via-rose-500 to-purple-600 text-white shadow-orange-500/25 hover:brightness-110'
            }`}
          >
            <span>
              {step === 3 ? t('startWatchingBtn') : t('continueBtn')}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
