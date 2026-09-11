export type LanguageCode =
  | 'hi'
  | 'en'
  | 'bn'
  | 'mr'
  | 'gu'
  | 'pa'
  | 'ta'
  | 'te'
  | 'kn'
  | 'ml'
  | 'or'
  | 'as';

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  script: string;
  flag: string;
  speakersText: string;
}

export type ContentCategory =
  | 'trending'
  | 'comedy'
  | 'movies'
  | 'music'
  | 'memes'
  | 'shorts'
  | 'web_series'
  | 'news'
  | 'gaming'
  | 'celebrity'
  | 'stories'
  | 'romance'
  | 'horror'
  | 'facts'
  | 'sports'
  | 'drama'
  | 'international';

export type MoodType =
  | 'hasna' // 😂 Mujhe hasna hai
  | 'relax' // 😌 Relax karna hai
  | 'trending' // 🔥 Kuch trending dikhao
  | 'romance' // ❤️ Romantic mood
  | 'thrill' // 😱 Thrill chahiye
  | 'interesting' // 🧠 Kuch interesting dikhao
  | 'music'; // 🎵 Music sunna hai

export interface MoodOption {
  id: MoodType;
  labelEn: string;
  labelHi: string;
  taglineEn: string;
  taglineHi: string;
  emoji: string;
  gradient: string;
  accentColor: string;
  categories: ContentCategory[];
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  verified: boolean;
  followersCount: number;
  bio: string;
  bioHindi?: string;
  location?: string;
  isFollowed?: boolean;
}

export interface CommentItem {
  id: string;
  contentId: string;
  userName: string;
  userAvatar: string;
  text: string;
  textHindi?: string;
  likes: number;
  timeAgo: string;
  isCreator?: boolean;
  isLiked?: boolean;
}

export interface ContentItem {
  id: string;
  title: string;
  titleHindi: string;
  description: string;
  descriptionHindi: string;
  category: ContentCategory;
  language: LanguageCode;
  duration: string;
  durationSeconds: number;
  views: number;
  likes: number;
  commentsCount: number;
  sharesCount: number;
  isSaved?: boolean;
  isLiked?: boolean;
  creator: Creator;
  mediaType: 'short' | 'video' | 'clip';
  videoUrl: string;
  posterUrl: string;
  tags: string[];
  publishedAt: string;
  audioTrackName: string;
  trendingRank?: number;
  recommendedScore?: number;
  watchProgress?: number; // 0 to 100 for Continue Watching
  hasSubtitles?: boolean;
  aspectRatio?: '9:16' | '16:9';
  sponsored?: boolean;
  sponsorName?: string;
  comments?: CommentItem[];
  moods?: MoodType[];
  locationRegion?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  language: LanguageCode;
  interests: ContentCategory[];
  followersCount: number;
  followingCount: number;
  totalLikes: number;
  isTarangPlus: boolean;
  walletBalance: number;
  watchHistory: {
    contentId: string;
    watchedAt: string;
    progress: number;
  }[];
  savedContentIds: string[];
  likedContentIds: string[];
  followedCreatorIds: string[];
  userUploads: ContentItem[];
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'recommendation' | 'announcement';
  title: string;
  titleHindi: string;
  message: string;
  messageHindi: string;
  timeAgo: string;
  isRead: boolean;
  avatar?: string;
  contentId?: string;
}

export interface ReportItem {
  id: string;
  contentId: string;
  contentTitle: string;
  reportedBy: string;
  reason: string;
  timestamp: string;
  status: 'pending' | 'reviewed' | 'resolved';
}

export type AppTheme = 'dark' | 'light' | 'system';

export interface AppSettings {
  language: LanguageCode;
  theme: AppTheme;
  dataSaverMode: boolean;
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  autoPlayVideos: boolean;
  hapticFeedback: boolean;
  subtitlesEnabled: boolean;
  networkQuality: 'fast' | 'moderate' | 'slow_2g_3g';
}

export type ActiveTab = 'home' | 'trending' | 'shorts' | 'explore' | 'create' | 'profile';

export interface BrandConcept {
  id: string;
  name: string;
  nameHindi: string;
  meaning: string;
  tagline: string;
  taglineHindi: string;
  vibe: string;
  palette: string[];
  selected?: boolean;
}
