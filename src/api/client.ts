import { SensorMapResponseSchema, SensorSchema, GeoJsonFeatureCollectionSchema } from './schemas';
import type { Sensor, SensorMapResponse } from './types';

export interface RequestOptions {
  ifNoneMatch?: string;
  signal?: AbortSignal;
}

export interface ApiResponse<T> {
  data: T | null;
  notModified: boolean;
  eTag?: string;
  status: number;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public responseBody?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class SeimApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = (baseUrl || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public setBaseUrl(newUrl: string): void {
    this.baseUrl = newUrl.replace(/\/$/, '');
  }

  /**
   * Fetches all sensors from the latest accepted placement run.
   * Leverages ETag and If-None-Match headers for caching.
   */
  async getSensors(options: RequestOptions = {}): Promise<ApiResponse<SensorMapResponse>> {
    const url = `${this.baseUrl}/api/v1/sensors`;
    const headers: Record<string, string> = {
      Accept: 'application/json',
    };
    if (options.ifNoneMatch) {
      headers['If-None-Match'] = options.ifNoneMatch;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
      signal: options.signal,
    });

    const eTag = response.headers.get('ETag') || undefined;

    if (response.status === 304) {
      return {
        data: null,
        notModified: true,
        eTag,
        status: 304,
      };
    }

    if (!response.ok) {
      let body: unknown;
      try {
        body = await response.json();
      } catch {
        body = await response.text();
      }
      throw new ApiError(`Failed to fetch sensors: ${response.status} ${response.statusText}`, response.status, body);
    }

    const json = await response.json();
    const validated = SensorMapResponseSchema.safeParse(json);
    if (!validated.success) {
      throw new ApiError(`SensorMapResponse failed schema validation: ${validated.error.message}`, response.status, json);
    }

    return {
      data: validated.data,
      notModified: false,
      eTag,
      status: response.status,
    };
  }

  /**
   * Fetches a single placed sensor by ID.
   */
  async getSensor(id: string, options: RequestOptions = {}): Promise<ApiResponse<Sensor>> {
    const url = `${this.baseUrl}/api/v1/sensors/${encodeURIComponent(id)}`;
    const headers: Record<string, string> = {
      Accept: 'application/json',
    };
    if (options.ifNoneMatch) {
      headers['If-None-Match'] = options.ifNoneMatch;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
      signal: options.signal,
    });

    const eTag = response.headers.get('ETag') || undefined;

    if (response.status === 304) {
      return {
        data: null,
        notModified: true,
        eTag,
        status: 304,
      };
    }

    if (!response.ok) {
      let body: unknown;
      try {
        body = await response.json();
      } catch {
        body = await response.text();
      }
      throw new ApiError(`Failed to fetch sensor ${id}: ${response.status} ${response.statusText}`, response.status, body);
    }

    const json = await response.json();
    const validated = SensorSchema.safeParse(json);
    if (!validated.success) {
      throw new ApiError(`Sensor schema validation error: ${validated.error.message}`, response.status, json);
    }

    return {
      data: validated.data,
      notModified: false,
      eTag,
      status: response.status,
    };
  }

  /**
   * Fetches GeoJSON representation of sensors.
   */
  async getSensorsGeoJson(options: RequestOptions = {}): Promise<ApiResponse<unknown>> {
    const url = `${this.baseUrl}/api/v1/sensors/geojson`;
    const headers: Record<string, string> = {
      Accept: 'application/geo+json, application/json',
    };
    if (options.ifNoneMatch) {
      headers['If-None-Match'] = options.ifNoneMatch;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
      signal: options.signal,
    });

    const eTag = response.headers.get('ETag') || undefined;

    if (response.status === 304) {
      return {
        data: null,
        notModified: true,
        eTag,
        status: 304,
      };
    }

    if (!response.ok) {
      throw new ApiError(`Failed to fetch GeoJSON: ${response.status} ${response.statusText}`, response.status);
    }

    const json = await response.json();
    const validated = GeoJsonFeatureCollectionSchema.safeParse(json);
    if (!validated.success) {
      throw new ApiError(`GeoJson validation error: ${validated.error.message}`, response.status, json);
    }

    return {
      data: validated.data,
      notModified: false,
      eTag,
      status: response.status,
    };
  }
}

export const apiClient = new SeimApiClient();
