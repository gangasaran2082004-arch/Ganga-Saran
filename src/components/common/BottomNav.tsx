import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';
import { Home, Flame, PlaySquare, Compass, PlusCircle, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, t } = useApp();

  const navItems: { tab: ActiveTab; label: string; icon: React.ReactNode }[] = [
    {
      tab: 'home',
      label: t('navHome'),
      icon: <Home className="w-5 h-5" />,
    },
    {
      tab: 'trending',
      label: t('navTrending'),
      icon: <Flame className="w-5 h-5" />,
    },
    {
      tab: 'shorts',
      label: t('navShorts'),
      icon: <PlaySquare className="w-5 h-5" />,
    },
    {
      tab: 'explore',
      label: t('navExplore'),
      icon: <Compass className="w-5 h-5" />,
    },
    {
      tab: 'create',
      label: t('navCreate'),
      icon: <PlusCircle className="w-5 h-5" />,
    },
    {
      tab: 'profile',
      label: t('navProfile'),
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 glass-nav px-2 py-1.5 safe-area-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map(item => {
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-200 select-none ${
                isActive
                  ? 'text-orange-500 scale-105'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {/* Highlight background pill */}
              {isActive && (
                <div className="absolute inset-0 rounded-2xl bg-orange-500/15 -z-10 animate-in fade-in zoom-in-90 duration-200" />
              )}

              <div className="relative">
                {item.icon}
                {item.tab === 'create' && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-500" />
                )}
              </div>

              <span
                className={`text-[10px] mt-0.5 whitespace-nowrap font-medium transition-all ${
                  isActive ? 'font-bold text-orange-400' : 'text-zinc-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
