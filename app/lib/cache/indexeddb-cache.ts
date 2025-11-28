/**
 * IndexedDB Cache Wrapper
 *
 * Simplified wrapper for IndexedDB caching operations.
 */

export interface IndexedDBCacheOptions {
  dbName?: string;
  storeName?: string;
  version?: number;
}

export class IndexedDBCache<T = any> {
  private dbName: string;
  private storeName: string;
  private version: number;
  private dbPromise: Promise<IDBDatabase> | null = null;

  constructor(options: IndexedDBCacheOptions = {}) {
    this.dbName = options.dbName || 'vizualni-admin-cache';
    this.storeName = options.storeName || 'data';
    this.version = options.version || 1;
  }

  private async getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });

    return this.dbPromise;
  }

  async get(key: string): Promise<T | null> {
    try {
      const db = await this.getDB();
      const tx = db.transaction([this.storeName], 'readonly');
      const store = tx.objectStore(this.storeName);
      const request = store.get(key);

      return new Promise((resolve) => {
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }

  async set(key: string, value: T): Promise<void> {
    try {
      const db = await this.getDB();
      const tx = db.transaction([this.storeName], 'readwrite');
      const store = tx.objectStore(this.storeName);
      store.put(value, key);

      return new Promise((resolve) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    } catch {
      // Silently fail
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const db = await this.getDB();
      const tx = db.transaction([this.storeName], 'readwrite');
      const store = tx.objectStore(this.storeName);
      store.delete(key);
    } catch {
      // Silently fail
    }
  }

  async clear(): Promise<void> {
    try {
      const db = await this.getDB();
      const tx = db.transaction([this.storeName], 'readwrite');
      const store = tx.objectStore(this.storeName);
      store.clear();
    } catch {
      // Silently fail
    }
  }
}
