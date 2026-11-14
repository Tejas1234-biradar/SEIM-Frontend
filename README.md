# SEIM Frontend — Earthquake Simulation Dashboard

A high-performance React + TypeScript web application for seismic sensor monitoring and real-time disaster severity simulation, built to integrate with `SEIM-Backend` and Unity-authored structural assets from `SEIM/Assets`.

---

## 🚀 Features

### Phase 1: Interactive Map & Sensor Telemetry
- **Full-Screen Interactive Map:** Powered by Leaflet and OpenStreetMap tiles with smooth zoom, pan, and auto-bounds fitting.
- **Sensor Network Visualization:** Displays placed seismic stations from `GET /api/v1/sensors` with station UUID, detection radius, and geographic coordinates.
- **Unity Asset Structures:** Visualizes 22 real buildings extracted from `SEIM/Assets/Scenes/SampleScene.unity` with local-to-geographic WGS84 coordinate projection (`origin: 12.98°N, 77.60°E`).
- **Layer Controls:** Toggle Sensors, Buildings, Detection Radii, and Severity Rings independently.
- **Conditional Caching:** Full HTTP `ETag` and `If-None-Match` support for efficient polling with `304 Not Modified` responses.
- **Dual Mode (Live vs. Mock):** Seamless toggle between live `SEIM-Backend` and Mock Service Worker (MSW) with edge-case fixtures and 5,000+ marker scale testing.

### Phase 2: Earthquake Severity Simulation Engine
- **Pure Geo & Simulation Engine:** Mathematically verified Great-Circle Haversine distance engine and attenuation-scaled disaster severity model.
- **Magnitude-Adaptive Severity Bands:**
  - **Severe (0 – 5 km at M5.0):** Immediate structural collapse and high PGA risk.
  - **High (5 – 15 km at M5.0):** Significant structural displacement and masonry cracking.
  - **Moderate (15 – 40 km at M5.0):** Moderate shaking with non-structural damage.
  - **Low (40 – 100 km at M5.0):** Noticeable ground motion without structural failure.
  - Distance thresholds scale dynamically with earthquake magnitude ($M_w$).
- **Visual Severity & Concentric Rings:** Dynamic concentric colored rings on the map matching active severity thresholds.
- **PGA & Damage Threshold Analysis:** Evaluates structural parameters (`buildingMass`, `stiffness`, `damageThresholdG`) from Unity's `BuildingShaker` against estimated Peak Ground Acceleration.
- **Impact Summary & Sortable Table:** Instant count of structures at risk, identifying nearest and farthest affected buildings, with instant map-centering on table row selection.

---

## 🛠 Tech Stack

- **Runtime & Framework:** Node.js, React 18, TypeScript, Vite
- **Mapping:** Leaflet, React-Leaflet
- **Data & State Management:** TanStack Query (v5), Zod (v3)
- **API Mocking:** Mock Service Worker (MSW v2)
- **Icons & Styling:** Lucide React, modern responsive CSS with colorblind-safe palettes
- **Testing:** Vitest, Testing Library, Playwright

---

## 📦 Getting Started

### 1. Installation
```bash
cd SEIM-Frontend
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8080` | URL of the running SEIM Spring Boot backend |
| `VITE_ENABLE_MOCKS` | `false` | Enable Mock Service Worker (MSW) by default |
| `VITE_TILE_LAYER_URL` | OpenStreetMap URL | Tile layer endpoint |
| `VITE_DEFAULT_ORIGIN_LAT` | `12.98` | Simulation center latitude |
| `VITE_DEFAULT_ORIGIN_LON` | `77.60` | Simulation center longitude |

### 3. Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Running Tests
```bash
# Run unit & component tests (Vitest)
npm run test

# Run tests with coverage
npm run test:coverage

# Typecheck
npm run typecheck

# Production build
npm run build
```

---

## 📁 Project Structure

```
SEIM-Frontend/
├── .github/workflows/ci.yml # CI pipeline: lint, typecheck, test, build
├── docs/
│   └── api-gaps.md          # API contract analysis & backend alignment notes
├── public/
│   ├── data/
│   │   └── buildings.json   # 22 structures extracted from SEIM/Assets with exact lat/lon
│   ├── favicon.svg
│   └── mockServiceWorker.js # MSW service worker
├── src/
│   ├── api/                 # Typed API client, Zod schemas, types, and buildings service
│   ├── components/          # Shared Navbar, Spinner, and ErrorAlert
│   ├── features/
│   │   ├── map/             # Leaflet MapContainer, Markers, Rings, Controls, and Icons
│   │   └── severity/        # Haversine & Severity Engine, Controls, Legend, Summary, Table
│   ├── lib/
│   │   └── geo/             # Haversine distance, bounds, coordinate conversions
│   ├── mocks/               # MSW handlers, browser worker, Node test server, fixtures
│   ├── App.tsx              # Main dashboard layout and state orchestration
│   ├── main.tsx             # Application bootstrap & React Query provider
│   ├── index.css            # Global theme & Leaflet custom styling
│   └── setupTests.ts        # Vitest & MSW test setup
└── tests/
    ├── unit/                # Pure function tests (haversine, severity, schemas, client)
    ├── component/           # React component tests (Legend, Controls, Summary)
    └── e2e/                 # Playwright end-to-end integration specs
```
