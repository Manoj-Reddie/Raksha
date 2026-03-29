/**
 * PWA Configuration and Utilities
 * Handles service worker registration and PWA features
 */

export const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        "/sw.js",
        { scope: "/" }
      );
      console.log("✅ Service Worker registered successfully:", registration);
      return registration;
    } catch (error) {
      console.error("❌ Service Worker registration failed:", error);
    }
  }
};

export const checkPWAInstalled = () => {
  // Check if running in standalone mode (installed as PWA)
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
};

export const requestNotificationPermission = async () => {
  if ("Notification" in window && Notification.permission === "default") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  return Notification.permission === "granted";
};

export const sendNotification = (title, options = {}) => {
  if ("Notification" in window && Notification.permission === "granted") {
    if (navigator.serviceWorker?.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "SHOW_NOTIFICATION",
        title,
        options,
      });
    } else {
      new Notification(title, options);
    }
  }
};

export const shareApp = async (data = {}) => {
  const shareData = {
    title: "Raksha - Women's Safety & Empowerment",
    text: "Download Raksha to stay safe and empowered. Tech-powered security platform for women.",
    url: window.location.origin,
    ...data,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (error) {
      console.log("Share cancelled or failed:", error);
    }
  }
};

export const addAppToHomeScreen = () => {
  const event = new CustomEvent("beforeinstallprompt");
  window.dispatchEvent(event);
};

export const checkCacheStatus = async () => {
  if ("caches" in window) {
    const cacheNames = await caches.keys();
    const cacheInfo = {};
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      cacheInfo[cacheName] = keys.length;
    }
    
    return cacheInfo;
  }
  return null;
};

export const clearAllCaches = async () => {
  if ("caches" in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((name) => caches.delete(name)));
    console.log("✅ All caches cleared");
  }
};

export const setupPWA = async () => {
  // Register service worker
  await registerServiceWorker();

  // Request notification permission
  const notificationPermission = await requestNotificationPermission();
  
  console.log("PWA Setup complete");
  console.log("Installed:", checkPWAInstalled());
  console.log("Notifications enabled:", notificationPermission);
};
