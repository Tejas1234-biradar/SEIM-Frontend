import { describe, it, expect } from 'vitest';
import { SeimApiClient } from '@/api/client';
import { CURRENT_ETAG } from '@/mocks/handlers';

describe('SeimApiClient', () => {
  const client = new SeimApiClient('http://localhost:8080');

  it('fetches sensors successfully and parses response', async () => {
    const res = await client.getSensors();
    expect(res.status).toBe(200);
    expect(res.notModified).toBe(false);
    expect(res.data).toBeDefined();
    expect(res.data?.sensors.length).toBeGreaterThan(0);
    expect(res.eTag).toBe(CURRENT_ETAG);
  });

  it('handles If-None-Match with 304 Not Modified', async () => {
    const res = await client.getSensors({ ifNoneMatch: CURRENT_ETAG });
    expect(res.status).toBe(304);
    expect(res.notModified).toBe(true);
    expect(res.data).toBeNull();
  });

  it('fetches single sensor by ID', async () => {
    const sensorId = '3da26754-2733-405a-8337-f68f291a5e39';
    const res = await client.getSensor(sensorId);
    expect(res.status).toBe(200);
    expect(res.data?.id).toBe(sensorId);
    expect(res.data?.lat).toBe(12.99);
  });

  it('throws ApiError on non-existent sensor ID (404)', async () => {
    await expect(client.getSensor('non-existent-id')).rejects.toThrow(/not found|404/i);
  });

  it('fetches GeoJSON feature collection', async () => {
    const res = await client.getSensorsGeoJson();
    expect(res.status).toBe(200);
    expect(res.data).toBeDefined();
  });
});
