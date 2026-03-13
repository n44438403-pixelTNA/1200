import { storage } from './storage';

export type DownloadType = 'PDF' | 'MCQ' | 'ANALYSIS' | 'LESSON';

export interface DownloadItem {
  id: string; // unique identifier (e.g., chapterId or resultId)
  type: DownloadType;
  title: string;
  subject: string;
  timestamp: number;
  data: any; // The actual content to be saved offline
  size?: number; // Estimated size in bytes
}

const DOWNLOADS_KEY = 'nst_user_downloads';

export const downloadManager = {
  /**
   * Get all downloaded items
   */
  getAllDownloads: async (): Promise<DownloadItem[]> => {
    const downloads = await storage.getItem<DownloadItem[]>(DOWNLOADS_KEY);
    return downloads || [];
  },

  /**
   * Save an item for offline use
   */
  saveDownload: async (item: DownloadItem): Promise<boolean> => {
    try {
      const downloads = await downloadManager.getAllDownloads();

      // Check if already exists, update if it does
      const existingIndex = downloads.findIndex(d => d.id === item.id && d.type === item.type);

      // Calculate approximate size
      const sizeStr = JSON.stringify(item.data);
      item.size = new Blob([sizeStr]).size;

      if (existingIndex >= 0) {
        downloads[existingIndex] = item;
      } else {
        downloads.push(item);
      }

      await storage.setItem(DOWNLOADS_KEY, downloads);
      return true;
    } catch (error) {
      console.error('Error saving download:', error);
      return false;
    }
  },

  /**
   * Remove a downloaded item
   */
  removeDownload: async (id: string, type: DownloadType): Promise<boolean> => {
    try {
      const downloads = await downloadManager.getAllDownloads();
      const filtered = downloads.filter(d => !(d.id === id && d.type === type));
      await storage.setItem(DOWNLOADS_KEY, filtered);
      return true;
    } catch (error) {
      console.error('Error removing download:', error);
      return false;
    }
  },

  /**
   * Check if an item is already downloaded
   */
  isDownloaded: async (id: string, type: DownloadType): Promise<boolean> => {
    const downloads = await downloadManager.getAllDownloads();
    return downloads.some(d => d.id === id && d.type === type);
  },

  /**
   * Get a specific downloaded item
   */
  getDownload: async (id: string, type: DownloadType): Promise<DownloadItem | null> => {
    const downloads = await downloadManager.getAllDownloads();
    return downloads.find(d => d.id === id && d.type === type) || null;
  },

  /**
   * Clear all downloads
   */
  clearAll: async (): Promise<boolean> => {
      try {
          await storage.removeItem(DOWNLOADS_KEY);
          return true;
      } catch (e) {
          console.error('Error clearing downloads', e);
          return false;
      }
  }
};
