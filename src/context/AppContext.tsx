import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  LanguageCode,
  ContentCategory,
  MoodType,
  ActiveTab,
  ContentItem,
  UserProfile,
  NotificationItem,
  ReportItem,
  AppSettings,
  BrandConcept,
} from '../types';
import { getTranslation } from '../localization/translations';
import { INITIAL_CONTENTS, INITIAL_USER, INITIAL_NOTIFICATIONS, CREATORS } from '../data/mockData';
import { BRAND_CONCEPTS } from '../data/brandConcepts';
import { offlineService } from '../services/offlineService';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface AppContextType {
  // Brand & Concept
  brandConcepts: BrandConcept[];
  activeBrand: BrandConcept;
  setActiveBrand: (brand: BrandConcept) => void;

  // Language & Localization
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  preferredLanguages: LanguageCode[];
  togglePreferredLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;

  // Offline & Service Worker
  isOnline: boolean;
  isSimulatedOffline: boolean;
  toggleSimulatedOffline: () => void;
  cachedContents: ContentItem[];
  cacheContentForOffline: (item: ContentItem) => void;
  removeCachedContent: (id: string) => void;
  clearAllCachedContent: () => void;
  isContentCached: (id: string) => boolean;
  isOfflineVaultOpen: boolean;
  setIsOfflineVaultOpen: (open: boolean) => void;

  // Onboarding & Opening
  hasCompletedOnboarding: boolean;
  completeOnboarding: (languages: LanguageCode[], interests: ContentCategory[]) => void;
  resetOnboarding: () => void;
  showSplash: boolean;
  dismissSplash: () => void;

  // Navigation & Screens
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  previousTab: ActiveTab;
  goBack: () => void;

  // User & Profile
  user: UserProfile;
  toggleLikeContent: (contentId: string) => void;
  toggleSaveContent: (contentId: string) => void;
  toggleFollowCreator: (creatorId: string) => void;
  addWatchHistory: (contentId: string, progress: number) => void;
  updateUserInterests: (interests: ContentCategory[]) => void;

  // Mood Mode
  activeMood: MoodType | null;
  setActiveMood: (mood: MoodType | null) => void;

  // Content & Feed
  contents: ContentItem[];
  filteredFeed: ContentItem[];
  activePlayingContent: ContentItem | null;
  setActivePlayingContent: (content: ContentItem | null) => void;
  addComment: (contentId: string, text: string) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchCategoryFilter: ContentCategory | 'all';
  setSearchCategoryFilter: (cat: ContentCategory | 'all') => void;
  searchLanguageFilter: LanguageCode | 'all';
  setSearchLanguageFilter: (lang: LanguageCode | 'all') => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Settings
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;

  // Admin & Reports
  reports: ReportItem[];
  submitReport: (contentId: string, reason: string) => void;
  resolveReport: (reportId: string, action: 'ban' | 'approve') => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;

  // Creator Studio
  publishCreatorContent: (newContent: Omit<ContentItem, 'id' | 'views' | 'likes' | 'commentsCount' | 'sharesCount' | 'publishedAt' | 'creator'>) => void;

  // Device Shell Mode
  isAndroidFrameMode: boolean;
  setIsAndroidFrameMode: (enabled: boolean) => void;
  isQuickFunOpen: boolean;
  setIsQuickFunOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Brand
  const [brandConcepts] = useState<BrandConcept[]>(BRAND_CONCEPTS);
  const [activeBrand, setActiveBrand] = useState<BrandConcept>(BRAND_CONCEPTS[0]);

  // Language
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(() => {
    return (localStorage.getItem('tarang_lang') as LanguageCode) || 'hi';
  });
  const [preferredLanguages, setPreferredLanguages] = useState<LanguageCode[]>(['hi', 'en']);

  // Onboarding & Splash
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(true);
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Tabs & Navigation
  const [activeTab, setActiveTabState] = useState<ActiveTab>('home');
  const [previousTab, setPreviousTab] = useState<ActiveTab>('home');

  const setActiveTab = (tab: ActiveTab) => {
    setPreviousTab(activeTab);
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setActiveTabState(previousTab);
  };

  // User Profile
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);

  // Mood
  const [activeMood, setActiveMood] = useState<MoodType | null>(null);

  // Content Store
  const [contents, setContents] = useState<ContentItem[]>(INITIAL_CONTENTS);
  const [activePlayingContent, setActivePlayingContent] = useState<ContentItem | null>(null);

  // Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchCategoryFilter, setSearchCategoryFilter] = useState<ContentCategory | 'all'>('all');
  const [searchLanguageFilter, setSearchLanguageFilter] = useState<LanguageCode | 'all'>('all');

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Reports
  const [reports, setReports] = useState<ReportItem[]>([
    {
      id: 'rep_1',
      contentId: 'cnt_8',
      contentTitle: 'Exam Memes Compilation',
      reportedBy: '@anonymous_user',
      reason: 'Questionable humor',
      timestamp: 'Yesterday',
      status: 'pending',
    },
  ]);

  // Settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('tarang_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      language: 'hi',
      theme: 'dark',
      dataSaverMode: false,
      highContrast: false,
      fontSize: 'normal',
      autoPlayVideos: true,
      hapticFeedback: true,
      subtitlesEnabled: true,
      networkQuality: 'fast',
    };
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isQuickFunOpen, setIsQuickFunOpen] = useState(false);
  const [isOfflineVaultOpen, setIsOfflineVaultOpen] = useState(false);
  const [isAndroidFrameMode, setIsAndroidFrameMode] = useState<boolean>(() => {
    return window.innerWidth > 900;
  });

  // Online / Offline status & simulation
  const { isOnline, isSimulatedOffline, toggleSimulatedOffline } = useOnlineStatus();

  // Cached content management for 100% offline viewing
  const [cachedContents, setCachedContents] = useState<ContentItem[]>(() => {
    const fromStorage = offlineService.getCachedItems();
    if (fromStorage.length > 0) return fromStorage;
    // Pre-cache top items for immediate offline testability
    const initialSeed = INITIAL_CONTENTS.slice(0, 3);
    initialSeed.forEach(item => offlineService.cacheItem(item));
    return initialSeed;
  });

  const cacheContentForOffline = (item: ContentItem) => {
    offlineService.cacheItem(item);
    setCachedContents(offlineService.getCachedItems());
  };

  const removeCachedContent = (id: string) => {
    offlineService.removeItem(id);
    setCachedContents(offlineService.getCachedItems());
  };

  const clearAllCachedContent = () => {
    offlineService.clearAll();
    setCachedContents([]);
  };

  const isContentCached = (id: string): boolean => {
    return cachedContents.some(c => c.id === id);
  };

  // Fast auto dismiss splash screen after smooth 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Sync settings to localStorage and HTML theme
  useEffect(() => {
    localStorage.setItem('tarang_settings', JSON.stringify(settings));
    if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, [settings]);

  // Translation helper
  const t = (key: string): string => {
    return getTranslation(key, currentLanguage);
  };

  const setLanguage = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
    localStorage.setItem('tarang_lang', lang);
    setSettings(prev => ({ ...prev, language: lang }));
  };

  const togglePreferredLanguage = (lang: LanguageCode) => {
    setPreferredLanguages(prev => {
      if (prev.includes(lang)) {
        if (prev.length <= 1) return prev; // keep at least 1
        return prev.filter(l => l !== lang);
      } else {
        return [...prev, lang];
      }
    });
  };

  const completeOnboarding = (languages: LanguageCode[], interests: ContentCategory[]) => {
    if (languages.length > 0) {
      setLanguage(languages[0]);
      setPreferredLanguages(languages);
    }
    setUser(prev => ({ ...prev, interests }));
    setHasCompletedOnboarding(true);
    localStorage.setItem('tarang_onboarded', 'true');
    setShowSplash(false);
  };

  const resetOnboarding = () => {
    setHasCompletedOnboarding(false);
    localStorage.removeItem('tarang_onboarded');
    setShowSplash(false);
  };

  const dismissSplash = () => {
    setShowSplash(false);
  };

  const toggleLikeContent = (contentId: string) => {
    setContents(prev =>
      prev.map(c => {
        if (c.id === contentId) {
          const isLiked = user.likedContentIds.includes(contentId);
          return {
            ...c,
            likes: isLiked ? c.likes - 1 : c.likes + 1,
            isLiked: !isLiked,
          };
        }
        return c;
      })
    );

    setUser(prev => {
      const isLiked = prev.likedContentIds.includes(contentId);
      const newLiked = isLiked
        ? prev.likedContentIds.filter(id => id !== contentId)
        : [...prev.likedContentIds, contentId];
      return {
        ...prev,
        likedContentIds: newLiked,
        totalLikes: isLiked ? prev.totalLikes - 1 : prev.totalLikes + 1,
      };
    });
  };

  const toggleSaveContent = (contentId: string) => {
    setContents(prev =>
      prev.map(c => {
        if (c.id === contentId) {
          const isSaved = user.savedContentIds.includes(contentId);
          return { ...c, isSaved: !isSaved };
        }
        return c;
      })
    );

    setUser(prev => {
      const isSaved = prev.savedContentIds.includes(contentId);
      return {
        ...prev,
        savedContentIds: isSaved
          ? prev.savedContentIds.filter(id => id !== contentId)
          : [...prev.savedContentIds, contentId],
      };
    });
  };

  const toggleFollowCreator = (creatorId: string) => {
    setUser(prev => {
      const isFollowing = prev.followedCreatorIds.includes(creatorId);
      return {
        ...prev,
        followedCreatorIds: isFollowing
          ? prev.followedCreatorIds.filter(id => id !== creatorId)
          : [...prev.followedCreatorIds, creatorId],
        followingCount: isFollowing ? prev.followingCount - 1 : prev.followingCount + 1,
      };
    });
  };

  const addWatchHistory = (contentId: string, progress: number) => {
    setUser(prev => {
      const existing = prev.watchHistory.filter(w => w.contentId !== contentId);
      return {
        ...prev,
        watchHistory: [
          { contentId, watchedAt: 'Just now', progress },
          ...existing,
        ],
      };
    });
  };

  const updateUserInterests = (interests: ContentCategory[]) => {
    setUser(prev => ({ ...prev, interests }));
  };

  const addComment = (contentId: string, text: string) => {
    const newComment = {
      id: `cm_${Date.now()}`,
      contentId,
      userName: user.name,
      userAvatar: user.avatar,
      text,
      likes: 0,
      timeAgo: 'Just now',
      isCreator: false,
    };

    setContents(prev =>
      prev.map(c => {
        if (c.id === contentId) {
          const comments = c.comments || [];
          return {
            ...c,
            commentsCount: c.commentsCount + 1,
            comments: [newComment, ...comments],
          };
        }
        return c;
      })
    );
  };

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const submitReport = (contentId: string, reason: string) => {
    const content = contents.find(c => c.id === contentId);
    const newReport: ReportItem = {
      id: `rep_${Date.now()}`,
      contentId,
      contentTitle: content?.title || 'Unknown Content',
      reportedBy: user.handle,
      reason,
      timestamp: 'Just now',
      status: 'pending',
    };
    setReports(prev => [newReport, ...prev]);
  };

  const resolveReport = (reportId: string, action: 'ban' | 'approve') => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    if (action === 'ban') {
      setContents(prev => prev.filter(c => c.id !== report.contentId));
    }

    setReports(prev =>
      prev.map(r => (r.id === reportId ? { ...r, status: 'resolved' } : r))
    );
  };

  const publishCreatorContent = (newContentData: Omit<ContentItem, 'id' | 'views' | 'likes' | 'commentsCount' | 'sharesCount' | 'publishedAt' | 'creator'>) => {
    const newContent: ContentItem = {
      ...newContentData,
      id: `cnt_${Date.now()}`,
      views: 12,
      likes: 1,
      commentsCount: 0,
      sharesCount: 0,
      publishedAt: 'Just now',
      creator: {
        id: user.id,
        name: user.name,
        handle: user.handle,
        avatar: user.avatar,
        verified: false,
        followersCount: user.followersCount,
        bio: user.bio,
      },
    };

    setContents(prev => [newContent, ...prev]);
    setUser(prev => ({
      ...prev,
      userUploads: [newContent, ...prev.userUploads],
    }));
  };

  // Smart Personalization & Recommendation Engine
  const filteredFeed = useMemo(() => {
    let list = [...contents];

    // Mood Mode filtering
    if (activeMood) {
      list = list.filter(c => c.moods && c.moods.includes(activeMood));
      if (list.length === 0) {
        // Soft fallback to all contents
        list = [...contents];
      }
    }

    // Recommendation scoring boost based on user's interests & watch history
    return list.sort((a, b) => {
      let scoreA = a.recommendedScore || 50;
      let scoreB = b.recommendedScore || 50;

      if (user.interests.includes(a.category)) scoreA += 25;
      if (user.interests.includes(b.category)) scoreB += 25;

      if (preferredLanguages.includes(a.language)) scoreA += 15;
      if (preferredLanguages.includes(b.language)) scoreB += 15;

      if (user.likedContentIds.includes(a.id)) scoreA += 10;
      if (user.likedContentIds.includes(b.id)) scoreB += 10;

      return scoreB - scoreA;
    });
  }, [contents, activeMood, user.interests, preferredLanguages, user.likedContentIds]);

  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;

  return (
    <AppContext.Provider
      value={{
        brandConcepts,
        activeBrand,
        setActiveBrand,
        currentLanguage,
        setLanguage,
        preferredLanguages,
        togglePreferredLanguage,
        t,
        hasCompletedOnboarding,
        completeOnboarding,
        resetOnboarding,
        showSplash,
        dismissSplash,
        activeTab,
        setActiveTab,
        previousTab,
        goBack,
        user,
        toggleLikeContent,
        toggleSaveContent,
        toggleFollowCreator,
        addWatchHistory,
        updateUserInterests,
        activeMood,
        setActiveMood,
        contents,
        filteredFeed,
        activePlayingContent,
        setActivePlayingContent,
        addComment,
        searchQuery,
        setSearchQuery,
        searchCategoryFilter,
        setSearchCategoryFilter,
        searchLanguageFilter,
        setSearchLanguageFilter,
        notifications,
        unreadNotificationCount,
        markNotificationRead,
        markAllNotificationsRead,
        settings,
        updateSettings,
        reports,
        submitReport,
        resolveReport,
        isAdminOpen,
        setIsAdminOpen,
        publishCreatorContent,
        isAndroidFrameMode,
        setIsAndroidFrameMode,
        isQuickFunOpen,
        setIsQuickFunOpen,
        isOnline,
        isSimulatedOffline,
        toggleSimulatedOffline,
        cachedContents,
        cacheContentForOffline,
        removeCachedContent,
        clearAllCachedContent,
        isContentCached,
        isOfflineVaultOpen,
        setIsOfflineVaultOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
