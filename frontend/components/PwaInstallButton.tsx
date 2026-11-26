"use client";

import React, { useEffect, useState } from "react";
import { Download, Check, Share, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}

export function PwaInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // Register service worker for PWA installability
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }

    // Detect if already running as installed standalone app
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (standalone) {
      setIsInstalled(true);
      return;
    }

    const ua = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIos(iosDevice);

    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowIosGuide(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      return;
    }

    if (isIos) {
      setShowIosGuide((prev) => !prev);
    }
  };

  if (isInstalled) {
    return (
      <span
        className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-safe/10 text-safe border border-safe/20"
        title="Running as installed app"
      >
        <Check className="w-3.5 h-3.5" />
        App Installed
      </span>
    );
  }

  if (!deferredPrompt && !isIos) {
    return null;
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleInstallClick}
        className="inline-flex items-center justify-center gap-1.5 h-9 px-2.5 sm:px-3 rounded-md border border-primary/40 bg-primary/10 text-foreground hover:bg-primary/20 text-xs font-semibold transition-colors"
        title="Install Asher EcoDash as an app"
      >
        <Download className="w-4 h-4 text-primary shrink-0" />
        <span className="hidden sm:inline">Install App</span>
      </button>

      {showIosGuide && (
        <div className="absolute right-0 top-full mt-2 w-64 p-3.5 rounded-lg border border-border bg-card shadow-lg z-50 text-xs space-y-2">
          <div className="flex items-center justify-between font-semibold text-foreground">
            <span>Install on iOS / Safari</span>
            <button
              type="button"
              onClick={() => setShowIosGuide(false)}
              className="text-slate-400 hover:text-foreground"
              aria-label="Close install instructions"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-slate-500 leading-relaxed">
            Tap the <Share className="inline w-3.5 h-3.5 mx-0.5 text-foreground" />{" "}
            <strong>Share</strong> button in Safari, then choose{" "}
            <strong>Add to Home Screen</strong>.
          </p>
        </div>
      )}
    </div>
  );
}
