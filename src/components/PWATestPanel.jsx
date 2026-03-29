"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  checkPWAInstalled,
  requestNotificationPermission,
  sendNotification,
  shareApp,
  checkCacheStatus,
  clearAllCaches,
} from "@/utils/pwaUtils";
import { CheckCircle, XCircle, Download, Share2, Trash2 } from "lucide-react";

export default function PWATestPanel() {
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState("default");
  const [cacheInfo, setCacheInfo] = useState(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsPWAInstalled(checkPWAInstalled());

    if ("Notification" in window) {
      setNotificationStatus(Notification.permission);
    }

    setIsOnline(navigator.onLine);
    window.addEventListener("online", () => setIsOnline(true));
    window.addEventListener("offline", () => setIsOnline(false));

    loadCacheStatus();
  }, []);

  const loadCacheStatus = async () => {
    const status = await checkCacheStatus();
    setCacheInfo(status);
  };

  const handleRequestNotifications = async () => {
    const permission = await requestNotificationPermission();
    setNotificationStatus(permission ? "granted" : "denied");
  };

  const handleSendNotification = () => {
    sendNotification("Test Notification from Raksha", {
      body: "PWA is working correctly! 🎉",
      icon: "/raksha-logo.svg",
      badge: "/raksha-logo.svg",
      tag: "pwa-test",
    });
  };

  const handleShare = async () => {
    await shareApp({
      text: "Try Raksha - Women's Safety & Empowerment App!",
    });
  };

  const handleClearCache = async () => {
    await clearAllCaches();
    setCacheInfo(null);
    loadCacheStatus();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>PWA Status Panel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Installation Status */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Installation Status</h3>
              {isPWAInstalled ? (
                <Badge variant="default" className="bg-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Installed
                </Badge>
              ) : (
                <Badge variant="outline" className="text-yellow-600">
                  <Download className="w-3 h-3 mr-1" />
                  Not Installed
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600">
              {isPWAInstalled
                ? "Raksha is installed as a PWA on this device"
                : "Click the install button to add Raksha to your home screen"}
            </p>
          </div>

          {/* Online Status */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Connection Status</h3>
              {isOnline ? (
                <Badge variant="default" className="bg-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Online
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <XCircle className="w-3 h-3 mr-1" />
                  Offline
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600">
              {isOnline
                ? "Connected to the internet. Cached assets available."
                : "No internet connection. Using cached content."}
            </p>
          </div>

          {/* Notification Status */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Notifications</h3>
              <Badge
                variant={
                  notificationStatus === "granted" ? "default" : "outline"
                }
                className={
                  notificationStatus === "granted" ? "bg-green-600" : ""
                }
              >
                {notificationStatus.charAt(0).toUpperCase() +
                  notificationStatus.slice(1)}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Enable notifications to receive emergency alerts and updates
              </p>
              <div className="flex gap-2">
                {notificationStatus !== "granted" ? (
                  <Button
                    onClick={handleRequestNotifications}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Request Permission
                  </Button>
                ) : (
                  <Button
                    onClick={handleSendNotification}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Send Test Notification
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Sharing */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Share App</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Share Raksha with friends and family
            </p>
            <Button onClick={handleShare} variant="outline" className="w-full">
              <Share2 className="w-4 h-4 mr-2" />
              Share Raksha
            </Button>
          </div>

          {/* Cache Status */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Cache Storage</h3>
              <Badge variant="outline">
                {cacheInfo ? Object.keys(cacheInfo).length : 0} Caches
              </Badge>
            </div>
            {cacheInfo ? (
              <div className="space-y-2">
                {Object.entries(cacheInfo).map(([name, count]) => (
                  <div
                    key={name}
                    className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded"
                  >
                    <span className="font-medium">{name}</span>
                    <span className="text-gray-600">{count} items</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">No caches loaded yet</p>
            )}
            <Button
              onClick={handleClearCache}
              variant="destructive"
              className="w-full mt-3"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Caches
            </Button>
          </div>

          {/* Testing Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Testing Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                ✓ Build app and start production: npm run build && npm start
              </li>
              <li>✓ Open DevTools → Application to see Service Workers</li>
              <li>✓ Toggle offline mode to test cached content</li>
              <li>✓ Try installing the app to your home screen</li>
              <li>✓ Check manifests in Application tab</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
