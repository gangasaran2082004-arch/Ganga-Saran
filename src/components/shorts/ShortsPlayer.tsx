import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ContentItem } from '../../types';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  Subtitles,
  MoreVertical,
  UserPlus,
  UserCheck,
  Music,
  Send,
  X,
  ChevronUp,
  ChevronDown,
  Flag,
  Copy,
  Check,
  Play,
  Pause,
} from 'lucide-react';
import { audioEngine } from '../../utils/audioSynth';

export const ShortsPlayer: React.FC = () => {
  const {
    contents,
    user,
    toggleLikeContent,
    toggleSaveContent,
    toggleFollowCreator,
    addComment,
    submitReport,
    currentLanguage,
    t,
  } = useApp();

  const shortsList = contents.filter(c => c.mediaType === 'short');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [heartBurst, setHeartBurst] = useState(false);
  const [reportReason, setReportReason] = useState('Inappropriate content');
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const currentShort: ContentItem = shortsList[currentIndex] || shortsList[0];

  const isLiked = user.likedContentIds.includes(currentShort.id);
  const isSaved = user.savedContentIds.includes(currentShort.id);
  const isFollowing = user.followedCreatorIds.includes(currentShort.creator.id);

  // Play/pause and sound on index change
  useEffect(() => {
    setVideoError(false);
    setIsPlaying(true);
    if (!isMuted) {
      audioEngine.startBackgroundTrack(currentShort.category);
    }
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }

    return () => {
      audioEngine.stopBackgroundTrack();
    };
  }, [currentIndex]);

  const toggleAudioMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (videoRef.current) {
      videoRef.current.muted = nextMute;
    }
    if (nextMute) {
      audioEngine.stopBackgroundTrack();
    } else {
      audioEngine.startBackgroundTrack(currentShort.category);
    }
  };

  const handleNextShort = () => {
    audioEngine.playClick();
    if (currentIndex < shortsList.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0); // loop back
    }
  };

  const handlePrevShort = () => {
    audioEngine.playClick();
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleDoubleTap = () => {
    audioEngine.playHeartSound();
    if (!isLiked) {
      toggleLikeContent(currentShort.id);
    }
    setHeartBurst(true);
    setTimeout(() => setHeartBurst(false), 800);
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    addComment(currentShort.id, newCommentText);
    setNewCommentText('');
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Check out this trending video on Tarang: "${currentShort.title}"! ${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    setShowShareModal(false);
  };

  const handleSubmitReport = () => {
    submitReport(currentShort.id, reportReason);
    setShowReportModal(false);
  };

  const title = currentLanguage === 'hi' ? currentShort.titleHindi : currentShort.title;
  const desc = currentLanguage === 'hi' ? currentShort.descriptionHindi : currentShort.description;

  return (
    <div className="relative w-full h-[calc(100vh-64px)] bg-black overflow-hidden select-none flex flex-col justify-center items-center">
      {/* Background/Video Player Container */}
      <div
        className="relative w-full h-full max-w-md mx-auto flex items-center justify-center overflow-hidden"
        onDoubleClick={handleDoubleTap}
      >
        {!videoError ? (
          <video
            ref={videoRef}
            src={currentShort.videoUrl}
            poster={currentShort.posterUrl}
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted={isMuted}
            playsInline
          />
        ) : (
          <div className="relative w-full h-full overflow-hidden bg-black">
            <img
              src={currentShort.posterUrl}
              alt={title}
              className="w-full h-full object-cover animate-pulse opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />
          </div>
        )}

        {/* Double-tap heart burst animation */}
        {heartBurst && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 animate-in zoom-in-50 fade-in duration-300">
            <Heart className="w-24 h-24 fill-rose-500 text-rose-500 drop-shadow-2xl animate-pulse" />
          </div>
        )}

        {/* Ambient Top Shadow Overlay */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />

        {/* Top Controls: Mute, Captions, Nav arrows */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/10 uppercase">
              {currentShort.language.toUpperCase()} • Short
            </span>
            {!isMuted && (
              <div className="flex items-end gap-0.5 h-3 px-1 py-0.5 rounded bg-black/60">
                <span className="w-0.5 bg-orange-400 rounded-full animate-bounce h-3" />
                <span className="w-0.5 bg-amber-400 rounded-full animate-pulse h-2" />
                <span className="w-0.5 bg-orange-500 rounded-full animate-bounce h-2.5" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Mute / Unmute Button */}
            <button
              onClick={toggleAudioMute}
              className={`p-2 rounded-full backdrop-blur-md text-white border border-white/10 transition-all ${
                isMuted ? 'bg-black/50 text-rose-400' : 'bg-orange-500 text-white'
              }`}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-white" />}
            </button>

            {/* Captions Toggle */}
            <button
              onClick={() => setShowCaptions(!showCaptions)}
              className={`p-2 rounded-full backdrop-blur-md border border-white/10 transition-all ${
                showCaptions ? 'bg-orange-500 text-white' : 'bg-black/50 text-zinc-300'
              }`}
              aria-label="Toggle Subtitles"
            >
              <Subtitles className="w-4 h-4" />
            </button>

            {/* Report Button */}
            <button
              onClick={() => setShowReportModal(true)}
              className="p-2 rounded-full bg-black/50 backdrop-blur-md text-zinc-300 hover:text-white border border-white/10 transition-all"
              aria-label="Report"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Vertical Swipe Nav Indicators */}
        <div className="absolute top-1/2 right-2 -translate-y-1/2 hidden sm:flex flex-col gap-2 z-20">
          <button
            onClick={handlePrevShort}
            disabled={currentIndex === 0}
            className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/80 disabled:opacity-30"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextShort}
            className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/80"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Subtitles Overlay */}
        {showCaptions && (
          <div className="absolute bottom-32 left-4 right-16 z-20 pointer-events-none">
            <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-xs font-semibold text-white font-hindi leading-relaxed inline-block shadow-md">
              💬 {title}
            </span>
          </div>
        )}

        {/* Ambient Bottom Shadow Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none" />

        {/* Bottom Left Content Info */}
        <div className="absolute bottom-6 left-4 right-16 z-20 space-y-2 pointer-events-auto">
          {/* Creator Profile & Follow */}
          <div className="flex items-center gap-2">
            <img
              src={currentShort.creator.avatar}
              alt={currentShort.creator.name}
              className="w-8 h-8 rounded-full border-2 border-orange-500 object-cover"
            />
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block truncate">
                {currentShort.creator.name}
              </span>
              <span className="text-[10px] text-zinc-400 block truncate">
                {currentShort.creator.handle}
              </span>
            </div>
            <button
              onClick={() => toggleFollowCreator(currentShort.creator.id)}
              className={`ml-2 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                isFollowing
                  ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
            >
              {isFollowing ? t('following') : t('follow')}
            </button>
          </div>

          {/* Title & Description */}
          <div className="space-y-1">
            <h3 className="text-xs sm:text-sm font-bold text-white font-hindi line-clamp-2">
              {title}
            </h3>
            <p className="text-[11px] text-zinc-300 font-hindi line-clamp-2 opacity-90">
              {desc}
            </p>
          </div>

          {/* Audio Track marquee style */}
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
            <Music className="w-3 h-3 text-orange-400 animate-spin" />
            <span className="truncate max-w-[200px]">{currentShort.audioTrackName}</span>
          </div>
        </div>

        {/* Right Action Icons Column */}
        <div className="absolute bottom-8 right-3 flex flex-col items-center gap-4 z-20">
          {/* Like Button */}
          <div className="flex flex-col items-center gap-0.5">
            <button
              onClick={() => toggleLikeContent(currentShort.id)}
              className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md active:scale-90 transition-all ${
                isLiked
                  ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40'
                  : 'bg-black/40 text-white border border-white/10 hover:bg-black/60'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500' : ''}`} />
            </button>
            <span className="text-[10px] font-bold text-white">
              {currentShort.likes >= 1000
                ? `${(currentShort.likes / 1000).toFixed(0)}K`
                : currentShort.likes}
            </span>
          </div>

          {/* Comments Button */}
          <div className="flex flex-col items-center gap-0.5">
            <button
              onClick={() => setShowComments(true)}
              className="w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white backdrop-blur-md hover:bg-black/60 active:scale-90 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
            <span className="text-[10px] font-bold text-white">
              {currentShort.commentsCount}
            </span>
          </div>

          {/* Save / Bookmark Button */}
          <div className="flex flex-col items-center gap-0.5">
            <button
              onClick={() => toggleSaveContent(currentShort.id)}
              className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md active:scale-90 transition-all ${
                isSaved
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-black/40 text-white border border-white/10 hover:bg-black/60'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-amber-400' : ''}`} />
            </button>
            <span className="text-[10px] font-bold text-white">{t('save')}</span>
          </div>

          {/* Share Button */}
          <div className="flex flex-col items-center gap-0.5">
            <button
              onClick={() => setShowShareModal(true)}
              className="w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white backdrop-blur-md hover:bg-black/60 active:scale-90 transition-all"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <span className="text-[10px] font-bold text-white">{t('share')}</span>
          </div>
        </div>
      </div>

      {/* COMMENTS DRAWER */}
      {showComments && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-zinc-950 border-t border-zinc-800 rounded-t-3xl p-4 flex flex-col h-[65vh] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white font-hindi">
                {t('comments')} ({currentShort.commentsCount})
              </h3>
              <button
                onClick={() => setShowComments(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 py-1">
              {currentShort.comments && currentShort.comments.length > 0 ? (
                currentShort.comments.map(c => (
                  <div key={c.id} className="flex gap-2.5 items-start text-xs">
                    <img
                      src={c.userAvatar}
                      alt={c.userName}
                      className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-300">{c.userName}</span>
                        <span className="text-[10px] text-zinc-500">{c.timeAgo}</span>
                      </div>
                      <p className="text-zinc-200 mt-0.5 leading-relaxed font-hindi">
                        {c.text}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-zinc-500">
                  {t('noCommentsYet')}
                </div>
              )}
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleSendComment} className="flex items-center gap-2 pt-2 border-t border-zinc-800">
              <input
                type="text"
                value={newCommentText}
                onChange={e => setNewCommentText(e.target.value)}
                placeholder={t('addCommentPlaceholder')}
                className="flex-1 px-3.5 py-2.5 rounded-full bg-zinc-900 border border-zinc-700 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="p-2.5 rounded-full bg-orange-500 text-white disabled:opacity-40 active:scale-95 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SHARE MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-hindi">
                {t('share')}
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleWhatsAppShare}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-600/30 active:scale-95 transition-all"
              >
                <span>💬</span>
                <span>{t('shareToWhatsApp')}</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full py-3 px-4 rounded-xl bg-zinc-800 border border-zinc-700 text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-zinc-700 active:scale-95 transition-all"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{t('copiedLink')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-zinc-400" />
                    <span>Copy Video Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPORT MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-hindi">
                {t('report')}
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-400">{t('reportReason')}</p>

            <div className="space-y-2 text-xs">
              {[
                t('reportReason1'),
                t('reportReason2'),
                t('reportReason3'),
                t('reportReason4'),
              ].map((reason, idx) => (
                <button
                  key={idx}
                  onClick={() => setReportReason(reason)}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                    reportReason === reason
                      ? 'bg-orange-500/20 border-orange-500 text-white font-bold'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <button
              onClick={handleSubmitReport}
              className="w-full py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 active:scale-95 transition-all"
            >
              {t('submit')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
