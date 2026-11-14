import { z } from 'zod';

export const LatitudeSchema = z
  .number()
  .min(-90, 'Latitude must be >= -90')
  .max(90, 'Latitude must be <= 90')
  .refine(Number.isFinite, 'Latitude must be a finite number');

export const LongitudeSchema = z
  .number()
  .min(-180, 'Longitude must be >= -180')
  .max(180, 'Longitude must be <= 180')
  .refine(Number.isFinite, 'Longitude must be a finite number');

export const CoordinateSchema = z.object({
  lat: LatitudeSchema,
  lon: LongitudeSchema,
});

export const OriginSchema = z.object({
  lat: LatitudeSchema,
  lon: LongitudeSchema,
});

export const BoundsSchema = z.object({
  minX: z.number().refine(Number.isFinite),
  maxX: z.number().refine(Number.isFinite),
  minZ: z.number().refine(Number.isFinite),
  maxZ: z.number().refine(Number.isFinite),
});

export const SensorSchema = z.object({
  id: z.string().min(1, 'Sensor ID must not be empty'),
  lat: LatitudeSchema,
  lon: LongitudeSchema,
  x: z.number().nullable().optional(),
  z: z.number().nullable().optional(),
  radiusMeters: z.number().positive('Sensor radius must be positive'),
  xzSource: z.string().nullable().optional(),
});

export const SensorMapResponseSchema = z.object({
  placementRunId: z.string(),
  generatedAt: z.string(),
  units: z.string(),
  origin: OriginSchema,
  bounds: BoundsSchema,
  count: z.number().int().nonnegative(),
  sensors: z.array(SensorSchema),
});

export const BuildingPositionSchema = z.object({
  x: z.number().refine(Number.isFinite),
  y: z.number().refine(Number.isFinite),
  z: z.number().refine(Number.isFinite),
  lat: LatitudeSchema,
  lon: LongitudeSchema,
});

export const BuildingPropertiesSchema = z.object({
  massKg: z.number().positive(),
  stiffness: z.number().positive(),
  dampingCoefficient: z.number().positive(),
  damageThresholdG: z.number().positive(),
  type: z.string().optional(),
  heightMeters: z.number().positive().optional(),
  yearBuilt: z.number().int().optional(),
});

export const BuildingSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  zoneId: z.string().optional(),
  position: BuildingPositionSchema,
  properties: BuildingPropertiesSchema,
});

export const BuildingsDocumentSchema = z.object({
  origin: OriginSchema,
  count: z.number().int().nonnegative(),
  buildings: z.array(BuildingSchema),
});

export const GeoJsonFeaturePointSchema = z.object({
  type: z.literal('Feature'),
  geometry: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([LongitudeSchema, LatitudeSchema]),
  }),
  properties: z.object({
    id: z.string(),
    radiusMeters: z.number(),
    x: z.number().nullable().optional(),
    z: z.number().nullable().optional(),
  }),
});

export const GeoJsonFeatureCollectionSchema = z.object({
  type: z.literal('FeatureCollection'),
  features: z.array(GeoJsonFeaturePointSchema),
});
