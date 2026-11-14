import { http, HttpResponse } from 'msw';
import { realisticSensorsResponse } from './fixtures';

export const CURRENT_ETAG = '"seim-placement-run-4b9ed75d"';

export const handlers = [
  // GET /api/v1/sensors/geojson (must be defined BEFORE /api/v1/sensors/:id)
  http.get('*/api/v1/sensors/geojson', () => {
    const geoJson = {
      type: 'FeatureCollection',
      features: realisticSensorsResponse.sensors.map((sensor) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [sensor.lon, sensor.lat],
        },
        properties: {
          id: sensor.id,
          radiusMeters: sensor.radiusMeters,
          x: sensor.x,
          z: sensor.z,
        },
      })),
    };

    return HttpResponse.json(geoJson, {
      status: 200,
      headers: {
        'Content-Type': 'application/geo+json',
        ETag: '"geojson-etag-v1"',
      },
    });
  }),

  // GET /api/v1/sensors
  http.get('*/api/v1/sensors', ({ request }) => {
    const ifNoneMatch = request.headers.get('If-None-Match');
    if (ifNoneMatch && (ifNoneMatch === CURRENT_ETAG || ifNoneMatch === '*' || ifNoneMatch.includes(CURRENT_ETAG))) {
      return new HttpResponse(null, {
        status: 304,
        headers: {
          ETag: CURRENT_ETAG,
        },
      });
    }

    return HttpResponse.json(realisticSensorsResponse, {
      status: 200,
      headers: {
        ETag: CURRENT_ETAG,
      },
    });
  }),

  // GET /api/v1/sensors/:id
  http.get('*/api/v1/sensors/:id', ({ params, request }) => {
    const { id } = params;
    const sensor = realisticSensorsResponse.sensors.find((s) => s.id === id);

    if (!sensor) {
      return HttpResponse.json({ message: `Sensor ${id} not found` }, { status: 404 });
    }

    const sensorEtag = `"${sensor.id}-${sensor.lat}-${sensor.lon}"`;
    const ifNoneMatch = request.headers.get('If-None-Match');
    if (ifNoneMatch && ifNoneMatch === sensorEtag) {
      return new HttpResponse(null, {
        status: 304,
        headers: {
          ETag: sensorEtag,
        },
      });
    }

    return HttpResponse.json(sensor, {
      status: 200,
      headers: {
        ETag: sensorEtag,
      },
    });
  }),
];
