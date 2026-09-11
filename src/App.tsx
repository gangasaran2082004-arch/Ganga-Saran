import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SplashScreen } from './components/splash/SplashScreen';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { TopHeader } from './components/common/TopHeader';
import { BottomNav } from './components/common/BottomNav';
import { HomeScreen } from './components/home/HomeScreen';
import { TrendingScreen } from './components/trending/TrendingScreen';
import { ShortsPlayer } from './components/shorts/ShortsPlayer';
import { ExploreScreen } from './components/explore/ExploreScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { MediaPlayerModal } from './components/player/MediaPlayerModal';
import { QuickFunModal } from './components/quickfun/QuickFunModal';
import { SearchScreen } from './components/search/SearchScreen';
import { NotificationsDrawer } from './components/notifications/NotificationsDrawer';
import { CreatorStudioModal } from './components/creator/CreatorStudioModal';
import { AdminDashboardModal } from './components/admin/AdminDashboardModal';
import { AndroidDeviceFrame } from './components/common/AndroidDeviceFrame';
import { OfflineBanner } from './components/common/OfflineBanner';
import { OfflineVaultModal } from './components/offline/OfflineVaultModal';
import { DownloadAppModal } from './components/common/DownloadAppModal';

const MainAppContent: React.FC = () => {
  const {
    showSplash,
    hasCompletedOnboarding,
    activeTab,
    setActiveTab,
    isOfflineVaultOpen,
    setIsOfflineVaultOpen,
  } = useApp();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // Splash Screen check
  if (showSplash) {
    return <SplashScreen />;
  }

  // Onboarding check
  if (!hasCompletedOnboarding) {
    return <OnboardingFlow />;
  }

  return (
    <AndroidDeviceFrame>
      {/* Top App Header (hidden during fullscreen Shorts) */}
      {activeTab !== 'shorts' && (
        <TopHeader
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenProfile={() => setActiveTab('profile')}
          onOpenOfflineVault={() => setIsOfflineVaultOpen(true)}
          onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
        />
      )}

      {/* Offline Detection & Notification Banner */}
      <OfflineBanner onOpenOfflineVault={() => setIsOfflineVaultOpen(true)} />

      {/* Main View Router */}
      <main className="flex-1 w-full relative">
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'trending' && <TrendingScreen />}
        {activeTab === 'shorts' && <ShortsPlayer />}
        {activeTab === 'explore' && <ExploreScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
        {activeTab === 'create' && (
          <div className="p-4">
            <CreatorStudioModal onClose={() => setActiveTab('home')} />
          </div>
        )}
      </main>

      {/* Bottom Sticky Navigation */}
      <BottomNav />

      {/* Global Modals & Overlays */}
      <MediaPlayerModal />
      <QuickFunModal />
      <AdminDashboardModal />
      {isOfflineVaultOpen && (
        <OfflineVaultModal onClose={() => setIsOfflineVaultOpen(false)} />
      )}
      {isDownloadModalOpen && (
        <DownloadAppModal onClose={() => setIsDownloadModalOpen(false)} />
      )}

      {isSearchOpen && (
        <SearchScreen onClose={() => setIsSearchOpen(false)} />
      )}

      {isNotificationsOpen && (
        <NotificationsDrawer onClose={() => setIsNotificationsOpen(false)} />
      )}

      {isCreateModalOpen && (
        <CreatorStudioModal onClose={() => setIsCreateModalOpen(false)} />
      )}
    </AndroidDeviceFrame>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
