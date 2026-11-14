/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_ENABLE_MOCKS?: string;
  readonly VITE_TILE_LAYER_URL?: string;
  readonly VITE_TILE_LAYER_ATTRIBUTION?: string;
  readonly VITE_DEFAULT_ORIGIN_LAT?: string;
  readonly VITE_DEFAULT_ORIGIN_LON?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
