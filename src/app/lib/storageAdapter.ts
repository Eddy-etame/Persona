export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

class BrowserStorageAdapter implements StorageAdapter {
  getItem(key: string): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(key);
  }
}

/**
 * SSR-readiness boundary: replace with a server-compatible adapter when migrating to SSR.
 */
export const storageAdapter: StorageAdapter = new BrowserStorageAdapter();

