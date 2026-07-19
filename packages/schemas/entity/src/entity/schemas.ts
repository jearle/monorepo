import { z } from 'zod';

export const EntityIdSchema = z.object({
  id: z.uuid(),
});

export const EntityMetadataSchema = z.object({
  metadata: z.record(z.string(), z.unknown()).nullable(),
});

export const EntityNameSchema = z.object({
  name: z.string().trim().min(1).max(255),
});

export const EntityAtSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export const EntityBaseSchema = z.object({
  ...EntityMetadataSchema.shape,
  ...EntityNameSchema.shape,
});

export const EntitySchema = z.object({
  ...EntityIdSchema.shape,
  ...EntityAtSchema.shape,
  ...EntityBaseSchema.shape,
});

export const EntityCreateSchema = EntityBaseSchema;

export const EntityUpdateSchema = z.object({
  ...EntityIdSchema.shape,
  ...EntityBaseSchema.partial().shape,
});
