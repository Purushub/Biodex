/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GpsCoordinate {
  lat: number;
  lng: number;
  rawString?: string;
  source: 'parsed' | 'fallback' | 'default';
}

/**
 * Parses multiple formats of GPS coordinates:
 * - "39.1031° N, 84.5120° W"
 * - "44.8142° N, 93.3524° W"
 * - "44.8142, -93.3524"
 * - "44.8142 -93.3524"
 * - "Lat: 44.8142, Lng: -93.3524"
 */
export function parseGpsString(
  gpsStr?: string | null,
  fallbackLat = 44.8142,
  fallbackLng = -93.3524
): GpsCoordinate {
  if (!gpsStr || typeof gpsStr !== 'string' || gpsStr.trim().length === 0) {
    return { lat: fallbackLat, lng: fallbackLng, source: 'default' };
  }

  const clean = gpsStr.trim();

  // Pattern 1: Degrees with cardinal direction: "39.1031° N, 84.5120° W" or "39.1031 N, 84.5120 W"
  const dmsMatch = clean.match(
    /([0-9.]+)\s*°?\s*([NSns])\s*[,/;\s]+\s*([0-9.]+)\s*°?\s*([EWew])/
  );
  if (dmsMatch) {
    let lat = parseFloat(dmsMatch[1]);
    if (dmsMatch[2].toUpperCase() === 'S') lat = -lat;
    let lng = parseFloat(dmsMatch[3]);
    if (dmsMatch[4].toUpperCase() === 'W') lng = -lng;

    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return { lat, lng, rawString: clean, source: 'parsed' };
    }
  }

  // Pattern 2: Decimal degrees separated by comma or space: "44.8142, -93.3524"
  const decMatch = clean.match(
    /([-+]?[0-9]*\.?[0-9]+)\s*[,/;\s]+\s*([-+]?[0-9]*\.?[0-9]+)/
  );
  if (decMatch) {
    const lat = parseFloat(decMatch[1]);
    const lng = parseFloat(decMatch[2]);
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return { lat, lng, rawString: clean, source: 'parsed' };
    }
  }

  return { lat: fallbackLat, lng: fallbackLng, rawString: clean, source: 'fallback' };
}

/**
 * Formats a coordinate pair into a user-friendly GPS string
 */
export function formatGpsCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
}
