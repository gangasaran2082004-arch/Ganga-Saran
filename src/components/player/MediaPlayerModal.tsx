import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Heart,
  Bookmark,
  Share2,
  Flag,
  Send,
  MessageCircle,
  Eye,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { ContentCard } from '../feed/ContentCard';
import { audioEngine } from '../../utils/audioSynth';

export const MediaPlayerModal: React.FC = () => {
  const {
    activePlayingContent,
    setActivePlayingContent,
    toggleLikeContent,
    toggleSaveContent,
    toggleFollowCreator,
    addComment,
    addWatchHistory,
    submitReport,
    user,
    contents,
    currentLanguage,
    t,
  } = useApp();

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(48);
  const [commentText, setCommentText] = useState('');
  const [showShareNotification, setShowShareNotification] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [reactionParticles, setReactionParticles] = useState<{ id: number; emoji: string; x: number }[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Parse duration seconds from content
  const totalDuration = activePlayingContent?.durationSeconds || 45;

  useEffect(() => {
    if (activePlayingContent) {
      setVideoError(false);
      setCurrentTime(0);
      setDuration(totalDuration);
      addWatchHistory(activePlayingContent.id, 10);
      setIsPlaying(true);

      // Start audio synth track for rich entertainment sound
      if (!isMuted) {
        audioEngine.startBackgroundTrack(activePlayingContent.category);
      }
    }

    return () => {
      audioEngine.stopBackgroundTrack();
    };
  }, [activePlayingContent]);

  // Handle continuous time progression fallback if video element fails or stalls
  useEffect(() => {
    let timer: any = null;
    if (isPlaying && (videoError || !videoRef.current || videoRef.current.paused)) {
      timer = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= totalDuration) {
            return 0; // loop
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, videoError, totalDuration]);

  if (!activePlayingContent) return null;

  const isLiked = user.likedContentIds.includes(activePlayingContent.id);
  const isSaved = user.savedContentIds.includes(activePlayingContent.id);
  const isFollowing = user.followedCreatorIds.includes(activePlayingContent.creator.id);

  const title = currentLanguage === 'hi' ? activePlayingContent.titleHindi : activePlayingContent.title;
  const desc = currentLanguage === 'hi' ? activePlayingContent.descriptionHindi : activePlayingContent.description;

  const togglePlay = () => {
    audioEngine.playClick();
    if (isPlaying) {
      if (videoRef.current) videoRef.current.pause();
      audioEngine.stopBackgroundTrack();
      setIsPlaying(false);
    } else {
      if (videoRef.current && !videoError) {
        videoRef.current.play().catch(() => {});
      }
      if (!isMuted) {
        audioEngine.startBackgroundTrack(activePlayingContent.category);
      }
      setIsPlaying(true);
    }
  };

  const handleMuteToggle = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
    if (nextMuted) {
      audioEngine.stopBackgroundTrack();
    } else if (isPlaying) {
      audioEngine.startBackgroundTrack(activePlayingContent.category);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !videoError) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || totalDuration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (videoRef.current && !videoError) {
      videoRef.current.currentTime = time;
    }
  };

  const handleSkip = (seconds: number) => {
    audioEngine.playClick();
    const newTime = Math.max(0, Math.min(totalDuration, currentTime + seconds));
    setCurrentTime(newTime);
    if (videoRef.current && !videoError) {
      videoRef.current.currentTime = newTime;
    }
  };

  const spawnReaction = (emoji: string) => {
    audioEngine.playHeartSound();
    const id = Date.now() + Math.random();
    setReactionParticles(prev => [...prev.slice(-6), { id, emoji, x: 20 + Math.random() * 60 }]);
    setTimeout(() => {
      setReactionParticles(prev => prev.filter(p => p.id !== id));
    }, 1200);
  };

  const handleWhatsAppShare = () => {
    audioEngine.playClick();
    const text = encodeURIComponent(`Watch "${title}" on Tarang: ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    setShowShareNotification(true);
    setTimeout(() => setShowShareNotification(false), 2000);
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    audioEngine.playClick();
    addComment(activePlayingContent.id, commentText);
    setCommentText('');
  };

  // Subtitles generator based on currentTime
  const getDynamicSubtitle = () => {
    const p = currentTime / (totalDuration || 1);
    if (currentLanguage === 'hi') {
      if (p < 0.3) return 'वाह भाई! ये वाला सीन तो एकदम जबरदस्त है 🔥';
      if (p < 0.6) return 'मम्मी का रिएक्शन और पूरे घर में सन्नाटा! 😂';
      if (p < 0.9) return 'लास्ट में जो हुआ वो किसी ने नहीं सोचा था 👏';
      return 'लाइक और सब्सक्राइब करना बिल्कुल न भूलें!';
    } else {
      if (p < 0.3) return 'Wait for the plot twist coming right now... 🔥';
      if (p < 0.6) return 'Relatable desi family moments you cannot miss! 😂';
      if (p < 0.9) return 'Pure entertainment masterpiece 👏';
      return 'Follow creator for next viral episode!';
    }
  };

  // Related videos
  const relatedVideos = contents.filter(
    c => c.id !== activePlayingContent.id && c.category === activePlayingContent.category
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between overflow-y-auto select-none animate-in fade-in">
      {/* Top Bar with Close Button */}
      <div className="sticky top-0 z-40 px-4 py-3 glass-nav flex items-center justify-between">
        <span className="text-xs font-bold text-zinc-300 truncate max-w-[250px] font-hindi">
          {title}
        </span>
        <button
          onClick={() => setActivePlayingContent(null)}
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white active:scale-95"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col p-4 space-y-4">
        {/* Video Player Box */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-zinc-950 shadow-2xl border border-zinc-800">
          {!videoError ? (
            <video
              ref={videoRef}
              src={activePlayingContent.videoUrl}
              poster={activePlayingContent.posterUrl}
              onTimeUpdate={handleTimeUpdate}
              onError={() => setVideoError(true)}
              autoPlay
              playsInline
              muted={isMuted}
              className="w-full h-full object-cover"
            />
          ) : (
            /* Cinema Motion Visualizer fallback */
            <div className="relative w-full h-full overflow-hidden bg-gradient-to-tr from-black via-zinc-900 to-black">
              <img
                src={activePlayingContent.posterUrl}
                alt={title}
                className={`w-full h-full object-cover opacity-60 transition-transform duration-1000 ${
                  isPlaying ? 'scale-105 filter brightness-110' : 'scale-100'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>
          )}

          {/* Floating Reaction Particles */}
          {reactionParticles.map(p => (
            <div
              key={p.id}
              style={{ left: `${p.x}%` }}
              className="absolute bottom-12 pointer-events-none z-30 text-3xl animate-bounce"
            >
              {p.emoji}
            </div>
          ))}

          {/* Dynamic Real-Time Subtitles */}
          <div className="absolute bottom-14 left-4 right-4 pointer-events-none z-20 flex justify-center text-center">
            <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-xs font-bold text-amber-300 border border-amber-500/30 shadow-lg font-hindi">
              💬 {getDynamicSubtitle()}
            </span>
          </div>

          {/* Video Controls Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 flex flex-col justify-between p-3 pointer-events-auto">
            {/* Top info strip */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-bold text-emerald-300">LIVE AUDIO STREAM</span>
              </div>
              <div className="flex items-center gap-2">
                {/* Dancing Equalizer Waves */}
                {isPlaying && !isMuted && (
                  <div className="flex items-end gap-0.5 h-4 px-1.5 py-0.5 rounded bg-black/60">
                    <span className="w-1 bg-orange-400 rounded-full animate-pulse h-3" />
                    <span className="w-1 bg-amber-400 rounded-full animate-bounce h-4" />
                    <span className="w-1 bg-orange-500 rounded-full animate-pulse h-2" />
                    <span className="w-1 bg-yellow-400 rounded-full animate-bounce h-3.5" />
                  </div>
                )}
                <span className="px-2 py-0.5 rounded bg-black/70 text-[10px] font-bold text-orange-400 border border-orange-500/20">
                  1080p HD
                </span>
              </div>
            </div>

            {/* Bottom Controls Strip */}
            <div className="space-y-2">
              {/* Scrubber Bar */}
              <input
                type="range"
                min={0}
                max={totalDuration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />

              <div className="flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-1.5 rounded-full bg-orange-500 text-white hover:bg-orange-600 active:scale-95 transition-all shadow-md shadow-orange-500/30"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                  </button>

                  <button
                    onClick={() => handleSkip(-10)}
                    className="p-1 text-zinc-300 hover:text-white"
                    title="10s Back"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleSkip(10)}
                    className="p-1 text-zinc-300 hover:text-white"
                    title="10s Forward"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleMuteToggle}
                    className={`p-1.5 rounded-full transition-all ${
                      isMuted ? 'text-rose-400 bg-rose-500/20' : 'text-emerald-400 bg-emerald-500/20'
                    }`}
                    title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <span className="text-[11px] font-mono text-zinc-300">
                    {Math.floor(currentTime / 60)}:
                    {Math.floor(currentTime % 60)
                      .toString()
                      .padStart(2, '0')}{' '}
                    / {activePlayingContent.duration}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-orange-400 px-1.5 py-0.5 rounded bg-white/10">
                    {activePlayingContent.language.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Reaction Emojis Bar */}
        <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-zinc-900/90 border border-zinc-800">
          <span className="text-[11px] font-bold text-zinc-400 font-hindi">
            {currentLanguage === 'hi' ? 'लाइव प्रतिक्रिया भेजें:' : 'Send Live Reaction:'}
          </span>
          <div className="flex items-center gap-2">
            {[
              { emoji: '🔥', label: 'Aag' },
              { emoji: '😂', label: 'Hasi' },
              { emoji: '❤️', label: 'Dil' },
              { emoji: '👏', label: 'Taali' },
              { emoji: '🤯', label: 'Shock' },
            ].map(r => (
              <button
                key={r.emoji}
                onClick={() => spawnReaction(r.emoji)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-base hover:scale-125 active:scale-90 transition-transform"
                title={r.label}
              >
                {r.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Video Info Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 font-bold uppercase text-[10px]">
              {activePlayingContent.category}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {(activePlayingContent.views / 1000).toFixed(0)}K views
            </span>
            <span>•</span>
            <span>{activePlayingContent.publishedAt}</span>
          </div>

          <h1 className="text-base sm:text-lg font-bold text-white font-hindi leading-snug">
            {title}
          </h1>

          <p className="text-xs text-zinc-300 font-hindi leading-relaxed">
            {desc}
          </p>
        </div>

        {/* Actions Strip: Like, Save, WhatsApp Share, Report */}
        <div className="flex items-center justify-around py-3 border-y border-zinc-800 text-xs">
          <button
            onClick={() => toggleLikeContent(activePlayingContent.id)}
            className={`flex items-center gap-1.5 font-bold transition-all ${
              isLiked ? 'text-rose-500' : 'text-zinc-300 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
            <span>{activePlayingContent.likes}</span>
          </button>

          <button
            onClick={() => toggleSaveContent(activePlayingContent.id)}
            className={`flex items-center gap-1.5 font-bold transition-all ${
              isSaved ? 'text-amber-400' : 'text-zinc-300 hover:text-white'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400' : ''}`} />
            <span>{isSaved ? t('saved') : t('save')}</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="flex items-center gap-1.5 text-emerald-400 font-bold hover:brightness-110"
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={() => submitReport(activePlayingContent.id, 'User flagged')}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200"
          >
            <Flag className="w-4 h-4" />
            <span>{t('report')}</span>
          </button>
        </div>

        {/* Creator Channel Box */}
        <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={activePlayingContent.creator.avatar}
              alt={activePlayingContent.creator.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-orange-500/40"
            />
            <div>
              <div className="flex items-center gap-1">
                <h4 className="text-xs font-bold text-white font-hindi">
                  {activePlayingContent.creator.name}
                </h4>
                {activePlayingContent.creator.verified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                )}
              </div>
              <p className="text-[10px] text-zinc-400">
                {(activePlayingContent.creator.followersCount / 1000000).toFixed(1)}M followers
              </p>
            </div>
          </div>

          <button
            onClick={() => toggleFollowCreator(activePlayingContent.creator.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isFollowing
                ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            {isFollowing ? t('following') : t('follow')}
          </button>
        </div>

        {/* Comments Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-hindi">
              {t('comments')} ({activePlayingContent.commentsCount})
            </h3>
          </div>

          {/* Add comment input */}
          <form onSubmit={handleSendComment} className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder={t('addCommentPlaceholder')}
              className="flex-1 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500 font-hindi"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold disabled:opacity-40"
            >
              Post
            </button>
          </form>

          {/* Comments list */}
          <div className="space-y-2.5">
            {activePlayingContent.comments?.map(c => (
              <div key={c.id} className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-xs space-y-1">
                <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                  <span className="font-bold text-zinc-300">{c.userName}</span>
                  <span>{c.timeAgo}</span>
                </div>
                <p className="text-zinc-200 font-hindi leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* More Like This / Recommendations */}
        {relatedVideos.length > 0 && (
          <div className="space-y-3 pt-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-hindi">
              More Like This
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedVideos.map(item => (
                <ContentCard key={`rel_${item.id}`} content={item} layout="portrait" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
