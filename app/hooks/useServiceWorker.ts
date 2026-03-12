import { useEffect, useState, useCallback } from 'react';

interface ServiceWorkerStatus {
  isSupported: boolean;
  isRegistered: boolean;
  isActivated: boolean;
  registration: ServiceWorkerRegistration | null;
  error: Error | null;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const useServiceWorker = () => {
  const [status, setStatus] = useState<ServiceWorkerStatus>({
    isSupported: false,
    isRegistered: false,
    isActivated: false,
    registration: null,
    error: null,
  });

  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if running in browser and service worker is supported
    if (typeof window === 'undefined') return;

    const isSupported = 'serviceWorker' in navigator;

    setStatus(prev => ({ ...prev, isSupported }));

    if (!isSupported) {
      console.log('Service Worker is not supported in this browser');
      return;
    }

    // Check if PWA is already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone ||
                         document.referrer.includes('android-app://');
      setIsInstalled(isStandalone);
    };

    checkInstalled();

    // Register service worker
    registerServiceWorker();

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Periodically check service worker status
    const checkInterval = setInterval(checkServiceWorkerStatus, 30000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearInterval(checkInterval);
    };
  }, []);

  const registerServiceWorker = async () => {
    try {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
      const registration = await navigator.serviceWorker.register(`${basePath}/sw.js`, {
        scope: `${basePath}/`,
      });

      console.log('Service Worker registered with scope:', registration.scope);

      setStatus(prev => ({
        ...prev,
        isRegistered: true,
        registration,
        error: null,
      }));

      // Check if there's an active worker
      if (registration.active) {
        setStatus(prev => ({ ...prev, isActivated: true }));
      }

      // Listen for updates
      registration.addEventListener('updatefound', () => {
        console.log('New Service Worker found, installing...');
        const newWorker = registration.installing;

        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New worker is ready, notify user
              handleServiceWorkerUpdate(registration);
            }
          });
        }
      });

      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      setStatus(prev => ({
        ...prev,
        error: error as Error,
      }));
    }
  };

  const checkServiceWorkerStatus = useCallback(() => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration) {
        setStatus(prev => ({
          ...prev,
          isRegistered: true,
          registration,
          isActivated: !!registration.active,
        }));

        // Check for updates
        registration.update();
      }
    });
  }, []);

  const handleServiceWorkerUpdate = useCallback((registration: ServiceWorkerRegistration) => {
    if (confirm('A new version of the app is available. Would you like to update?')) {
      // Tell the new worker to skip waiting and become active
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });

        // Reload the page to get the new version
        window.location.reload();
      }
    }
  }, []);

  const promptInstall = useCallback(async () => {
    if (!installPrompt) {
      console.log('Install prompt not available');
      return false;
    }

    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        return true;
      } else {
        console.log('User dismissed the install prompt');
        return false;
      }
    } catch (error) {
      console.error('Error during install prompt:', error);
      return false;
    }
  }, [installPrompt]);

  const unregisterServiceWorker = useCallback(async () => {
    if (!('serviceWorker' in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const unregistered = await registration.unregister();
        console.log('Service Worker unregistered:', unregistered);

        setStatus(prev => ({
          ...prev,
          isRegistered: false,
          isActivated: false,
          registration: null,
        }));

        return unregistered;
      }
    } catch (error) {
      console.error('Error unregistering Service Worker:', error);
      setStatus(prev => ({
        ...prev,
        error: error as Error,
      }));
    }
  }, []);

  const clearCache = useCallback(async () => {
    if (!('caches' in window)) return;

    try {
      const cacheNames = await caches.keys();
      const deletions = await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );

      console.log(`Cleared ${deletions.filter(Boolean).length} caches`);
      return deletions.some(Boolean);
    } catch (error) {
      console.error('Error clearing caches:', error);
      return false;
    }
  }, []);

  // Listen for messages from service worker
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'CACHE_UPDATED') {
        console.log('Cache updated by service worker:', event.data.payload);
        // You can show a notification or update UI here
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
  }, []);

  return {
    ...status,
    installPrompt,
    isInstalled,
    canInstall: !!installPrompt && !isInstalled,
    promptInstall,
    unregisterServiceWorker,
    clearCache,
    checkForUpdates: () => status.registration?.update(),
  };
};

export default useServiceWorker;
export type { ServiceWorkerStatus, BeforeInstallPromptEvent };