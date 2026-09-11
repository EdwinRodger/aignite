/**
 * Mobile Bridge Helper for AIgnite
 * Enables bidirectional messaging between Next.js web application
 * and the React Native / Expo WebView container.
 */

export type MobileBridgeEvent =
  | { type: 'TRIGGER_HAPTIC'; payload: { style?: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning' } }
  | { type: 'SET_DEFAULT_LANDING'; payload: { path: string } }
  | { type: 'REQUEST_MIC_PERMISSION' }
  | { type: 'SHARE_REPORT_CARD'; payload: { title: string; url: string; score?: number } }
  | { type: 'OPEN_EXTERNAL_URL'; payload: { url: string } };

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

/**
 * Checks if the current page is being viewed inside the AIgnite Expo mobile app
 */
export function isMobileApp(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(window.ReactNativeWebView);
}

/**
 * Send a typed event message from the web app to the Expo mobile app
 */
export function sendNativeMessage(event: MobileBridgeEvent): void {
  if (typeof window === 'undefined') return;

  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify(event));
  }
}

/**
 * Helper to trigger native haptic feedback on Android/iOS via Expo
 */
export function triggerHaptic(style: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning' = 'light'): void {
  sendNativeMessage({
    type: 'TRIGGER_HAPTIC',
    payload: { style },
  });
}
