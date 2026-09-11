import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Bell, Check, Sparkles, Heart, MessageSquare, Info } from 'lucide-react';

interface NotificationsDrawerProps {
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ onClose }) => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setActivePlayingContent,
    contents,
    currentLanguage,
    t,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');

  const displayedNotifications = activeFilter === 'unread'
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const handleNotificationClick = (notif: any) => {
    markNotificationRead(notif.id);
    if (notif.contentId) {
      const match = contents.find(c => c.id === notif.contentId);
      if (match) {
        setActivePlayingContent(match);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-bold text-white font-hindi">
              {t('notifications')}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              className="text-[11px] text-orange-400 font-semibold hover:underline"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex px-4 py-2 gap-2 border-b border-zinc-800 text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-xl font-medium transition-all ${
              activeFilter === 'all'
                ? 'bg-orange-500 text-white font-bold'
                : 'bg-zinc-900 text-zinc-400'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setActiveFilter('unread')}
            className={`px-3 py-1 rounded-xl font-medium transition-all ${
              activeFilter === 'unread'
                ? 'bg-orange-500 text-white font-bold'
                : 'bg-zinc-900 text-zinc-400'
            }`}
          >
            Unread ({notifications.filter(n => !n.isRead).length})
          </button>
        </div>

        {/* Notifications List */}
        <div className="p-3 flex-1 overflow-y-auto no-scrollbar space-y-2">
          {displayedNotifications.length > 0 ? (
            displayedNotifications.map(notif => {
              const title = currentLanguage === 'hi' && notif.titleHindi ? notif.titleHindi : notif.title;
              const msg = currentLanguage === 'hi' && notif.messageHindi ? notif.messageHindi : notif.message;

              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex gap-3 items-start ${
                    !notif.isRead
                      ? 'bg-orange-500/10 border-orange-500/30'
                      : 'bg-zinc-900/60 border-zinc-800/80 hover:bg-zinc-900'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 text-orange-400">
                    {notif.type === 'recommendation' && <Sparkles className="w-4 h-4" />}
                    {notif.type === 'like' && <Heart className="w-4 h-4 text-rose-500" />}
                    {notif.type === 'comment' && <MessageSquare className="w-4 h-4 text-sky-400" />}
                    {notif.type === 'announcement' && <Info className="w-4 h-4 text-amber-400" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white truncate font-hindi">
                        {title}
                      </h4>
                      <span className="text-[10px] text-zinc-500">{notif.timeAgo}</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 mt-0.5 leading-relaxed font-hindi">
                      {msg}
                    </p>
                  </div>

                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0 mt-1.5" />
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-xs text-zinc-500">
              No notifications right now
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
