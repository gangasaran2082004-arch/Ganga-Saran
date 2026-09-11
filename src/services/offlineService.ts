// Tarang Offline Detection & Cache Management Service
import { ContentItem } from '../types';

export interface OfflineCacheStats {
  itemCount: number;
  estimatedStorageBytes: number;
}

const CACHED_ITEMS_KEY = 'tarang_offline_cached_content_v1';

export class OfflineService {
  private static instance: OfflineService;

  private constructor() {
    this.registerServiceWorker();
  }

  public static getInstance(): OfflineService {
    if (!OfflineService.instance) {
      OfflineService.instance = new OfflineService();
    }
    return OfflineService.instance;
  }

  // Register the service worker
  public registerServiceWorker(): void {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw-custom.js')
          .then((registration) => {
            console.log('Tarang ServiceWorker registered with scope:', registration.scope);
          })
          .catch((err) => {
            console.warn('Tarang ServiceWorker registration optional fallback:', err);
          });
      });
    }
  }

  // Get list of cached content items stored locally
  public getCachedItems(): ContentItem[] {
    try {
      const stored = localStorage.getItem(CACHED_ITEMS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading offline cache:', e);
    }
    return [];
  }

  // Cache a content item for offline playback
  public cacheItem(item: ContentItem): boolean {
    try {
      const current = this.getCachedItems();
      if (!current.some((c) => c.id === item.id)) {
        const updated = [item, ...current];
        localStorage.setItem(CACHED_ITEMS_KEY, JSON.stringify(updated));

        // Also instruct the service worker to cache the media poster and video if supported
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'CACHE_CONTENT',
            urls: [item.posterUrl, item.videoUrl],
          });
        }
        return true;
      }
    } catch (e) {
      console.error('Error saving to offline cache:', e);
    }
    return false;
  }

  // Remove a cached item
  public removeItem(itemId: string): void {
    try {
      const current = this.getCachedItems();
      const filtered = current.filter((c) => c.id !== itemId);
      localStorage.setItem(CACHED_ITEMS_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error('Error removing from offline cache:', e);
    }
  }

  // Clear all cached items
  public clearAll(): void {
    localStorage.removeItem(CACHED_ITEMS_KEY);
  }

  // Check if an item is cached
  public isItemCached(itemId: string): boolean {
    const current = this.getCachedItems();
    return current.some((c) => c.id === itemId);
  }

  // Calculate approximate cache usage
  public getStorageStats(): OfflineCacheStats {
    const items = this.getCachedItems();
    // Approximate 3.5 MB per cached item with metadata & asset cache
    return {
      itemCount: items.length,
      estimatedStorageBytes: items.length * 3.5 * 1024 * 1024,
    };
  }
}

export const offlineService = OfflineService.getInstance();
