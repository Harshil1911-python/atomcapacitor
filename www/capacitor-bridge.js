/**
 * Capacitor bridge for Atom Bills
 * White status + navigation bars, improved Share.
 * Uses Capacitor.Plugins (available after native load).
 */
(function () {
  'use strict';

  function isNative() {
    return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  }

  function getPlugin(name) {
    try {
      return window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins[name];
    } catch (e) {
      return null;
    }
  }

  async function setupBars() {
    if (!isNative()) return;

    // Status Bar – white background, dark icons (Style.Light)
    const StatusBar = getPlugin('StatusBar');
    if (StatusBar) {
      try {
        if (StatusBar.setOverlaysWebView) await StatusBar.setOverlaysWebView({ overlay: false });
        if (StatusBar.setBackgroundColor) await StatusBar.setBackgroundColor({ color: '#ffffff' });
        if (StatusBar.setStyle) await StatusBar.setStyle({ style: 'LIGHT' });
        if (StatusBar.show) await StatusBar.show();
      } catch (e) {
        console.warn('[Atom] StatusBar', e);
      }
    }

    // Navigation Bar (Capawesome) – white
    const NavigationBar = getPlugin('NavigationBar');
    if (NavigationBar) {
      try {
        if (NavigationBar.setColor) {
          await NavigationBar.setColor({ color: '#ffffff', style: 'LIGHT' });
        } else if (NavigationBar.setNavigationBarColor) {
          await NavigationBar.setNavigationBarColor({ color: '#ffffff', darkButtons: true });
        }
      } catch (e) {
        console.warn('[Atom] NavigationBar', e);
      }
    }

    // Edge-to-edge helper (optional)
    const EdgeToEdge = getPlugin('EdgeToEdge');
    if (EdgeToEdge) {
      try {
        if (EdgeToEdge.setBackgroundColor) await EdgeToEdge.setBackgroundColor({ color: '#ffffff' });
      } catch (e) { /* ignore */ }
    }
  }

  function setupShare() {
    if (!isNative()) return;
    const Share = getPlugin('Share');
    if (!Share || !Share.share) return;

    const original = navigator.share ? navigator.share.bind(navigator) : null;
    navigator.share = async function (data) {
      try {
        await Share.share({
          title: (data && data.title) || 'Atom Bills',
          text: (data && data.text) || '',
          url: (data && data.url) || undefined,
          dialogTitle: (data && data.title) || 'Share'
        });
      } catch (err) {
        if (original) return original(data);
        throw err;
      }
    };
  }

  function run() {
    setupBars();
    setupShare();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  // Also run when Capacitor signals ready
  document.addEventListener('deviceready', run);
  window.addEventListener('capacitorReady', run);
})();
