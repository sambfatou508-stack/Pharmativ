import { Pharmacy } from '../types/pharmacy';

/**
 * Calculates geodesic distance between two GPS coordinates using the Haversine formula (in meters).
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Formats distance into a human-readable string (e.g. "250 m" or "1.4 km").
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.max(10, Math.round(meters))} m`;
  }
  const km = (meters / 1000).toFixed(1);
  return `${km} km`;
}

/**
 * Estimates travel time on foot (~4.8 km/h) and by car (~30 km/h in urban area).
 */
export function estimateTravelTime(meters: number): {
  walkingMinutes: number;
  drivingMinutes: number;
  summary: string;
} {
  // Walking: ~80 meters per minute
  const walkingMinutes = Math.max(1, Math.round(meters / 80));
  // Driving: ~500 meters per minute (30 km/h)
  const drivingMinutes = Math.max(1, Math.round(meters / 500));

  let summary = '';
  if (meters <= 800) {
    summary = `~${walkingMinutes} min à pied (${meters} m)`;
  } else {
    summary = `~${drivingMinutes} min en voiture • ~${walkingMinutes} min à pied`;
  }

  return { walkingMinutes, drivingMinutes, summary };
}

/**
 * Enriches a list of pharmacies with real calculated distances from the user coordinates.
 * Returns a new array sorted by ascending distance (closest first).
 */
export function enrichWithUserDistance(
  pharmacies: Pharmacy[],
  userLocation: { lat: number; lng: number } | null
): Pharmacy[] {
  if (!userLocation) return pharmacies;

  const enriched = pharmacies.map((p) => {
    const dist = calculateDistanceMeters(
      userLocation.lat,
      userLocation.lng,
      p.coordinates.lat,
      p.coordinates.lng
    );
    return {
      ...p,
      distanceMeters: dist,
      distanceDisplay: formatDistance(dist),
    };
  });

  return enriched.sort((a, b) => a.distanceMeters - b.distanceMeters);
}

/**
 * Finds the closest pharmacy from a list to a given user coordinate.
 */
export function findNearestPharmacy(
  pharmacies: Pharmacy[],
  userLocation: { lat: number; lng: number }
): Pharmacy | null {
  if (!pharmacies.length) return null;

  let nearest: Pharmacy | null = null;
  let minDistance = Infinity;

  for (const p of pharmacies) {
    const dist = calculateDistanceMeters(
      userLocation.lat,
      userLocation.lng,
      p.coordinates.lat,
      p.coordinates.lng
    );
    if (dist < minDistance) {
      minDistance = dist;
      nearest = {
        ...p,
        distanceMeters: dist,
        distanceDisplay: formatDistance(dist),
      };
    }
  }

  return nearest;
}
