/**
 * Google Analytics 4 (GA4) Service for PHARma tiv
 * Automatically measures visits, page navigation, calls, and interactions.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA_MEASUREMENT_ID: string =
  (import.meta.env.VITE_GA_MEASUREMENT_ID as string) || 'G-3NSDNKX56S';

let isInitialized = false;

/**
 * Initializes Google Analytics (GA4) dynamically.
 * If VITE_GA_MEASUREMENT_ID is defined in environment variables,
 * the official gtag.js script is loaded and configured.
 */
export function initAnalytics(): void {
  if (typeof window === 'undefined' || isInitialized) return;

  if (!GA_MEASUREMENT_ID) {
    // Helpful developer reminder if GA ID is not yet provided
    if (import.meta.env.DEV) {
      console.info(
        '[Analytics] Google Analytics non configuré (VITE_GA_MEASUREMENT_ID absent). Les événements sont loggués en console.'
      );
    }
    isInitialized = true;
    return;
  }

  try {
    // 1. Prepare dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: false, // We control page_view manually for SPA transitions
    });

    // 2. Inject official Google tag script
    const scriptId = 'google-analytics-gtag';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);
    }

    isInitialized = true;
    console.info(`[Analytics] Google Analytics 4 initialisé (${GA_MEASUREMENT_ID})`);
  } catch (error) {
    console.warn('[Analytics] Erreur lors de l’initialisation de Google Analytics:', error);
  }
}

/**
 * Tracks a screen/page view in the Single Page Application.
 */
export function trackPageView(pageTitle: string, pagePath: string): void {
  if (typeof window === 'undefined') return;

  if (window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('event', 'page_view', {
      page_title: pageTitle,
      page_location: window.location.href,
      page_path: pagePath,
    });
  } else if (import.meta.env.DEV) {
    console.debug(`[Analytics] PageView: "${pageTitle}" -> ${pagePath}`);
  }
}

/**
 * Tracks a custom user interaction event.
 */
export function trackEvent(
  eventName: string,
  params: Record<string, string | number | boolean> = {}
): void {
  if (typeof window === 'undefined') return;

  if (window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('event', eventName, params);
  } else if (import.meta.env.DEV) {
    console.debug(`[Analytics] Event "${eventName}":`, params);
  }
}

/**
 * Helper to track when a user clicks to call a pharmacy.
 */
export function trackPharmacyCall(pharmacyName: string, phone: string): void {
  trackEvent('call_pharmacy', {
    pharmacy_name: pharmacyName,
    phone_number: phone,
    event_category: 'engagement',
  });
}

/**
 * Helper to track when a user clicks for GPS navigation to a pharmacy.
 */
export function trackPharmacyDirections(pharmacyName: string): void {
  trackEvent('directions_click', {
    pharmacy_name: pharmacyName,
    event_category: 'engagement',
  });
}

/**
 * Helper to track WhatsApp inquiries.
 */
export function trackPharmacyWhatsApp(pharmacyName: string): void {
  trackEvent('whatsapp_click', {
    pharmacy_name: pharmacyName,
    event_category: 'engagement',
  });
}

/**
 * Helper to track emergency SAMU / Pompiers calls.
 */
export function trackEmergencyCall(serviceName: string, phone: string): void {
  trackEvent('emergency_call', {
    service_name: serviceName,
    phone_number: phone,
    event_category: 'emergency',
  });
}
