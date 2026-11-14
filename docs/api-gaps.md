# API Gaps and Contract Alignment: SEIM Backend & Frontend

This document details the observed API schema from `SEIM-Backend` (`/api/v1/**`), the alignment with frontend requirements, and how schema gaps are handled in `SEIM-Frontend`.

---

## 1. Endpoints Overview

| Endpoint | Method | Backend Status | Frontend Usage | Notes |
|---|---|---|---|---|
| `/api/v1/sensors` | `GET` | Supported | Primary sensor collection | Returns snapshot metadata, origin, bounds, count, and array of sensors. Supports conditional caching (`ETag` / `If-None-Match` -> `304 Not Modified`). |
| `/api/v1/sensors/{id}` | `GET` | Supported | Individual sensor lookup | Returns sensor object with `lat`, `lon`, `x`, `z`, `radiusMeters`. Unknown ID returns `404`. |
| `/api/v1/sensors/geojson` | `GET` | Supported | Alternative GeoJSON layer | GeoJSON FeatureCollection with `[lon, lat]` coordinates and properties (`id`, `radiusMeters`, `x`, `z`). |
| `/api/v1/layout` | `POST` | Supported | Upload Unity layout | Used primarily by Unity integration to upload local `x`, `z`, and `radius`. |
| `/api/v1/buildings` | `GET` | **Missing in Backend** | Sourced via static asset | `SEIM-Backend` has no building tables or endpoints. Buildings are extracted from Unity assets (`SEIM/Assets/Scenes/SampleScene.unity`) into `/public/data/buildings.json`. |

---

## 2. Identified Schema Gaps & Resolutions

### Gap 1: No Buildings Endpoint
* **Issue:** The original plan assumed a `GET /buildings` endpoint with fields such as `id`, `name`, `lat`, `lon`, `height`, `type`, `year_built`.
* **Resolution:** `SEIM-Backend` currently models only sensor placement and telemetry. To support Phase 2 (damage and distance calculations on structures), buildings are extracted directly from Unity scene assets (`SampleScene.unity` with `BuildingShaker` components and `PrefabInstances`) and converted from Unity local coordinates to WGS84 geographic coordinates using the reference origin `(12.98, 77.60)`. The frontend loads this data via `src/api/buildingsService.ts`.

### Gap 2: Coordinate Naming (`lon` vs `lng`)
* **Issue:** Many web mapping libraries default to `lng`, while `SEIM-Backend` uses `lon` (`origin.lon`, `sensor.lon`).
* **Resolution:** Frontend TypeScript types and Zod schemas use `lat` and `lon` as the canonical backend schema, with mapping utilities normalizing coordinates for Leaflet (`[lat, lon]` tuples or `{lat, lng}` Leaflet objects).

### Gap 3: Sensor Name / Labeling
* **Issue:** Backend sensors only have a UUID `id` (e.g. `3da26754-2733-405a-8337-f68f291a5e39`), matching Unity's station ID and MQTT topic key, without a friendly human-readable display name.
* **Resolution:** The frontend displays the sensor ID, with a formatted abbreviation (e.g. `Sensor 3da267...`) for compact map pins and table views.

### Gap 4: Live Telemetry Stream
* **Issue:** Backend ingests sensor readings via MQTT broker and `POST /api/sensor-readings`, but does not provide a WebSocket or Server-Sent Events (SSE) feed to the browser.
* **Resolution:** Frontend polls or queries `/api/v1/sensors` with conditional headers (`If-None-Match`). Real-time telemetry streaming is deferred to future backend releases.

### Gap 5: Earthquake Simulation Execution
* **Issue:** Earthquake simulation epicenter and PGA attenuation are calculated in Unity and on the client side.
* **Resolution:** Phase 2 severity engine is implemented as a pure, tested TypeScript engine in `src/features/severity/severityEngine.ts`, calculating epicentral distance via the Haversine formula and evaluating configurable damage severity bands.
