import { ScreenId } from '../types/pharmacy';
import { PHARMACIES } from '../data/pharmacies';

interface ScreenSEOConfig {
  title: string;
  description: string;
  keywords: string;
}

const SCREEN_SEO: Record<ScreenId, ScreenSEOConfig> = {
  'accueil-garde': {
    title: 'Pharma tiv - Pharmacie de garde Tivaouane 24h/24',
    description:
      'Trouvez la pharmacie de garde à Tivaouane ouverte 24h/24 avec Pharma tiv. Localisation GPS, itinéraire Google Maps, numéros directs et urgences SAMU.',
    keywords:
      'pharmacie de garde Tivaouane, pharmacie ouverte Tivaouane, pharmacie 24h/24 Tivaouane, Pharma tiv, pharmacie proche Tivaouane, urgence pharmacie Sénégal',
  },
  'toutes-les-pharmacies': {
    title: 'Annuaire Pharmacies Tivaouane - Pharma tiv GPS',
    description:
      'Consultez l’annuaire complet des pharmacies de Tivaouane avec horaires, coordonnées GPS, numéros de téléphone directs, WhatsApp et conventions IPM.',
    keywords:
      'annuaire pharmacie Tivaouane, Pharmacie Mbaye Sy Abdou, Grande Pharmacie de Tivaouane, Pharmacie El Hadji Malick Sy, liste pharmacies Tivaouane, IPM pharmacie Tivaouane',
  },
  'urgences-samu-tivaouane': {
    title: 'Urgences & SAMU Tivaouane (1515) - Pharma tiv',
    description:
      'Numéros d’urgence gratuits à Tivaouane : SAMU 1515, Sapeurs-Pompiers 18, Police 17, Hôpital Mame Abdou Aziz Sy Dabakh et postes de santé.',
    keywords:
      'urgence médicale Tivaouane, SAMU 1515 Tivaouane, Hôpital Dabakh Tivaouane, pompiers Tivaouane 18, garde nuit Tivaouane',
  },
};

function upsertMetaTag(attr: 'name' | 'property', key: string, content: string): void {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonicalLink(url: string): void {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

function injectPharmaciesDirectoryJsonLd(baseUrl: string): void {
  const scriptId = 'pharma-tiv-directory-jsonld';
  let script = document.getElementById(scriptId) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Pharmacies de garde et officines à Tivaouane',
    description:
      'Liste géolocalisée des pharmacies de garde et officines ouvertes 24h/24 dans la commune de Tivaouane, Sénégal.',
    url: baseUrl,
    numberOfItems: PHARMACIES.length,
    itemListElement: PHARMACIES.map((pharmacy, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Pharmacy',
        name: pharmacy.name,
        telephone: `+221${pharmacy.phone}`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: pharmacy.address,
          addressLocality: 'Tivaouane',
          addressRegion: 'Thiès',
          addressCountry: 'SN',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: pharmacy.coordinates.lat,
          longitude: pharmacy.coordinates.lng,
        },
        openingHours: pharmacy.openingHours,
      },
    })),
  };

  script.textContent = JSON.stringify(structuredData);
}

export function updatePageSEO(screen: ScreenId): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const config = SCREEN_SEO[screen] || SCREEN_SEO['accueil-garde'];
  const canonicalUrl = `${window.location.origin}${window.location.pathname}`;
  const shareImageUrl = `${window.location.origin}/og-share.jpg`;

  document.title = config.title;

  upsertMetaTag('name', 'description', config.description);
  upsertMetaTag('name', 'keywords', config.keywords);

  upsertMetaTag('property', 'og:title', config.title);
  upsertMetaTag('property', 'og:description', config.description);
  upsertMetaTag('property', 'og:url', canonicalUrl);
  upsertMetaTag('property', 'og:image', shareImageUrl);

  upsertMetaTag('name', 'twitter:title', config.title);
  upsertMetaTag('name', 'twitter:description', config.description);
  upsertMetaTag('name', 'twitter:image', shareImageUrl);

  upsertCanonicalLink(canonicalUrl);
  injectPharmaciesDirectoryJsonLd(canonicalUrl);
}
