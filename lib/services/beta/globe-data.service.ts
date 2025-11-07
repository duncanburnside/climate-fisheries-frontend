/**
 * Service to convert pixel data to globe.gl format
 * 
 * This service handles the conversion of pixel JSON data (array format)
 * to formats compatible with globe.gl visualization.
 */

export interface GlobePoint {
  lat: number;
  lng: number;
  value: number;
  radius?: number;
  color?: string;
}

export interface GlobeHeatmapPoint {
  lat: number;
  lng: number;
  intensity: number;
}

export class GlobeDataService {
  /**
   * Convert pixel index to latitude/longitude coordinates
   * 
   * The pixel data uses a 0.5° x 0.5° grid:
   * - Latitude: -89.75 to 89.75 (360 points)
   * - Longitude: -179.75 to 179.75 (720 points)
   * - Total: 259,200 pixels
   * 
   * Index calculation: index = (latIndex * 720) + longIndex
   * Where:
   * - latIndex = (latitude + 179.75) / 0.5
   * - longIndex = (longitude + 89.75) / 0.5
   */
  static indexToCoordinates(index: number): { lat: number; lng: number } | null {
    // Based on the pixel route calculation:
    // latIndex = (latitude + 179.75) / 0.5  -> latitude is the row (Y axis)
    // longIndex = (longitude + 89.75) / 0.5  -> longitude is the column (X axis)
    // index = Math.floor((latIndex * 360) + longIndex)
    //
    // So to reverse:
    // latIndex = Math.floor(index / 360)
    // longIndex = index % 360
    // latitude = (latIndex * 0.5) - 179.75
    // longitude = (longIndex * 0.5) - 89.75
    
    const pointsPerRow = 360; // From pixel route: (latIndex * 360) + longIndex
    const totalPoints = 259200; // 720 * 360 (latitude points * longitude points)

    if (index < 0 || index >= totalPoints) {
      return null;
    }

    // Reverse the calculation from pixel route
    const latIndex = Math.floor(index / pointsPerRow);
    const lngIndex = index % pointsPerRow;

    // Convert back to lat/lng
    const lat = (latIndex * 0.5) - 179.75; // Latitude range: -179.75 to 179.75
    const lng = (lngIndex * 0.5) - 89.75;  // Longitude range: -89.75 to 89.75

    return { lat, lng };
  }

  /**
   * Convert pixel JSON array to globe.gl points format
   * 
   * @param pixelData - Array of pixel values (can be numbers or objects with model data)
   * @param valueExtractor - Function to extract value from pixel data entry
   * @param colorMapper - Function to map value to color
   * @returns Array of GlobePoint objects
   */
  static convertPixelDataToPoints(
    pixelData: any[],
    valueExtractor: (entry: any) => number | null = (entry) => {
      if (typeof entry === 'number') return entry;
      if (entry && typeof entry === 'object') {
        // Handle model data format: { values: [mean, min, max] }
        if (Array.isArray(entry.values) && entry.values.length > 0) {
          return entry.values[0]; // Use mean value
        }
        if (entry.value !== undefined) {
          return entry.value;
        }
      }
      return null;
    },
    colorMapper?: (value: number) => string
  ): GlobePoint[] {
    const points: GlobePoint[] = [];

    for (let i = 0; i < pixelData.length; i++) {
      const entry = pixelData[i];
      if (entry === null || entry === undefined) continue;

      const value = valueExtractor(entry);
      if (value === null || isNaN(value)) continue;

      const coords = this.indexToCoordinates(i);
      if (!coords) continue;

      points.push({
        lat: coords.lat,
        lng: coords.lng,
        value,
        color: colorMapper ? colorMapper(value) : undefined,
      });
    }

    return points;
  }

  /**
   * Convert pixel data to heatmap format
   * 
   * @param pixelData - Array of pixel values
   * @param valueExtractor - Function to extract value from pixel data entry
   * @returns Array of GlobeHeatmapPoint objects
   */
  static convertPixelDataToHeatmap(
    pixelData: any[],
    valueExtractor: (entry: any) => number | null = (entry) => {
      if (typeof entry === 'number') return entry;
      if (entry && typeof entry === 'object') {
        if (Array.isArray(entry.values) && entry.values.length > 0) {
          return entry.values[0];
        }
        if (entry.value !== undefined) {
          return entry.value;
        }
      }
      return null;
    }
  ): GlobeHeatmapPoint[] {
    const heatmap: GlobeHeatmapPoint[] = [];

    // Normalize values to 0-1 range for intensity
    const values: number[] = [];
    for (let i = 0; i < pixelData.length; i++) {
      const entry = pixelData[i];
      if (entry === null || entry === undefined) continue;

      const value = valueExtractor(entry);
      if (value !== null && !isNaN(value)) {
        values.push(value);
      }
    }

    if (values.length === 0) return heatmap;

    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue;

    for (let i = 0; i < pixelData.length; i++) {
      const entry = pixelData[i];
      if (entry === null || entry === undefined) continue;

      const value = valueExtractor(entry);
      if (value === null || isNaN(value)) continue;

      const coords = this.indexToCoordinates(i);
      if (!coords) continue;

      // Normalize intensity to 0-1 range
      const intensity = range > 0 ? (value - minValue) / range : 0.5;

      heatmap.push({
        lat: coords.lat,
        lng: coords.lng,
        intensity,
      });
    }

    return heatmap;
  }

  /**
   * Sample pixel data for performance (reduce number of points)
   * 
   * @param points - Array of GlobePoint objects
   * @param sampleRate - Keep every Nth point (e.g., 2 = keep every 2nd point)
   * @returns Sampled array of points
   */
  static samplePoints(points: GlobePoint[], sampleRate: number = 2): GlobePoint[] {
    return points.filter((_, index) => index % sampleRate === 0);
  }
}

