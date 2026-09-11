import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { audioEngine } from '../../utils/audioSynth';
import {
  Volume2,
  Sparkles,
  Share2,
  Flame,
  Radio,
  Disc3,
  Check,
  Zap,
} from 'lucide-react';

interface SoundBite {
  id: string;
  emoji: string;
  titleHi: string;
  titleEn: string;
  subtitle: string;
  type: 'comedy' | 'music' | 'punjabi' | 'romance' | 'ipl';
  gradient: string;
}

const SOUND_BITES: SoundBite[] = [
  {
    id: 'sakht',
    emoji: '😎',
    titleHi: 'सख्त लौंडा वाइब',
    titleEn: 'Sakht Launda',
    subtitle: 'जाकिर खान स्पेशल कॉमेडी बीट',
    type: 'comedy',
    gradient: 'from-orange-500 to-amber-600',
  },
  {
    id: 'dhol',
    emoji: '🥁',
    titleHi: 'धमाकेदार ढोल',
    titleEn: 'Desi Dhol Bass',
    subtitle: 'हाई बास पंजाबी शादी बीट',
    type: 'punjabi',
    gradient: 'from-amber-500 to-rose-600',
  },
  {
    id: 'ipl',
    emoji: '🏏',
    titleHi: 'स्टेडियम सिक्सर',
    titleEn: 'IPL Stadium Roar',
    subtitle: 'सीटी और क्राउड चीयर हॉर्न',
    type: 'music',
    gradient: 'from-sky-500 to-indigo-600',
  },
  {
    id: 'drama',
    emoji: '🎻',
    titleHi: 'बॉलीवुड ड्रामा',
    titleEn: 'Dramatic Twist',
    subtitle: 'धूम ताना सस्पेंस स्ट्रिंग्स',
    type: 'comedy',
    gradient: 'from-purple-600 to-pink-600',
  },
  {
    id: 'lofi',
    emoji: '🌙',
    titleHi: 'रूहानी गजल लो-फाई',
    titleEn: 'Midnight Gazal',
    subtitle: 'सुकून भरे सुर व बांसुरी',
    type: 'romance',
    gradient: 'from-emerald-500 to-teal-700',
  },
  {
    id: 'meme',
    emoji: '🤣',
    titleHi: 'देसी मीम पंच',
    titleEn: 'Desi Meme Punch',
    subtitle: 'अरे भैया! हंसी का तड़का',
    type: 'comedy',
    gradient: 'from-rose-500 to-amber-500',
  },
];

export const DesiVibeStudio: React.FC = () => {
  const { currentLanguage, setActivePlayingContent, contents } = useApp();
  const [activeSoundId, setActiveSoundId] = useState<string | null>(null);
  const [copiedShare, setCopiedShare] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);

  const handlePlaySound = (sound: SoundBite) => {
    audioEngine.playClick();
    if (activeSoundId === sound.id) {
      audioEngine.stopBackgroundTrack();
      setActiveSoundId(null);
    } else {
      setActiveSoundId(sound.id);
      audioEngine.startBackgroundTrack(sound.type);
      // Auto pulse off after 6 seconds
      setTimeout(() => {
        if (activeSoundId === sound.id) {
          audioEngine.stopBackgroundTrack();
          setActiveSoundId(null);
        }
      }, 6000);
    }
  };

  const handleShareSound = (e: React.MouseEvent, sound: SoundBite) => {
    e.stopPropagation();
    audioEngine.playClick();
    const title = currentLanguage === 'hi' ? sound.titleHi : sound.titleEn;
    const text = encodeURIComponent(`सुनो ये मजेदार "${title}" तरंग ऐप पर: ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    setCopiedShare(sound.id);
    setTimeout(() => setCopiedShare(null), 2000);
  };

  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSpinResult(null);
    audioEngine.playClick();

    // Sound effect ticks
    const interval = setInterval(() => {
      audioEngine.playClick();
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      setIsSpinning(false);
      const randomContent = contents[Math.floor(Math.random() * contents.length)];
      if (randomContent) {
        setSpinResult(currentLanguage === 'hi' ? randomContent.titleHindi : randomContent.title);
        audioEngine.playHeartSound();
        setTimeout(() => {
          setActivePlayingContent(randomContent);
        }, 1200);
      }
    }, 1800);
  };

  return (
    <div className="mx-4 p-4 rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-zinc-950 border border-orange-500/30 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white font-hindi flex items-center gap-1.5">
              <span>{currentLanguage === 'hi' ? 'देसी साउंड स्टूडियो' : 'Desi Vibe Studio'}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-gradient-to-r from-orange-500 to-rose-500 text-white uppercase tracking-wider">
                Exclusive
              </span>
            </h3>
            <p className="text-[10px] text-zinc-400 font-hindi">
              {currentLanguage === 'hi'
                ? 'टैप करें और सुनें लाइव ऑडियो व मीम बीट्स'
                : 'Tap to trigger live sound effects & viral beats'}
            </p>
          </div>
        </div>

        {/* Lucky Spin Button */}
        <button
          onClick={handleSpinWheel}
          disabled={isSpinning}
          className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
            isSpinning
              ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:brightness-110 active:scale-95'
          }`}
          title="Spin for random viral hit"
        >
          <Disc3 className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin' : ''}`} />
          <span>{isSpinning ? 'Spinning...' : 'मूड स्पिनर'}</span>
        </button>
      </div>

      {/* Lucky Spin Result Notification */}
      {spinResult && (
        <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-xs text-amber-300 flex items-center justify-between animate-in zoom-in-95">
          <div className="flex items-center gap-2 font-hindi truncate">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="truncate">लकी पिक: <strong>{spinResult}</strong></span>
          </div>
          <span className="text-[10px] font-bold text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded-full flex-shrink-0">
            Playing...
          </span>
        </div>
      )}

      {/* Sound Bites 3x2 Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {SOUND_BITES.map(sound => {
          const isActive = activeSoundId === sound.id;
          return (
            <div
              key={sound.id}
              onClick={() => handlePlaySound(sound)}
              className={`relative p-3 rounded-2xl border cursor-pointer select-none transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
                isActive
                  ? 'bg-zinc-800/90 border-orange-400 shadow-lg shadow-orange-500/20 scale-[1.02]'
                  : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850'
              }`}
            >
              {/* Active Soundwave bar */}
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-rose-500 to-amber-400 animate-pulse" />
              )}

              <div className="flex items-center justify-between mb-1.5">
                <span className="text-2xl group-hover:scale-125 transition-transform duration-300">
                  {sound.emoji}
                </span>

                <div className="flex items-center gap-1">
                  {isActive ? (
                    <div className="flex items-end gap-0.5 h-3">
                      <span className="w-1 bg-orange-400 rounded-full animate-bounce h-3" />
                      <span className="w-1 bg-amber-400 rounded-full animate-pulse h-2" />
                      <span className="w-1 bg-rose-400 rounded-full animate-bounce h-2.5" />
                    </div>
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300" />
                  )}

                  <button
                    onClick={(e) => handleShareSound(e, sound)}
                    className="p-1 rounded-full text-zinc-500 hover:text-emerald-400 hover:bg-white/10 transition-colors ml-0.5"
                    title="Share to WhatsApp"
                  >
                    {copiedShare === sound.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Share2 className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white font-hindi group-hover:text-orange-300 transition-colors">
                  {currentLanguage === 'hi' ? sound.titleHi : sound.titleEn}
                </h4>
                <p className="text-[10px] text-zinc-400 line-clamp-1 font-hindi mt-0.5">
                  {sound.subtitle}
                </p>
              </div>

              <div className="mt-2 pt-1.5 border-t border-zinc-800/80 flex items-center justify-between text-[9px]">
                <span className={`font-bold ${isActive ? 'text-orange-400' : 'text-zinc-500'}`}>
                  {isActive ? 'Playing Live 🔊' : 'Tap to Play'}
                </span>
                <span className="text-zinc-500">Audio</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
