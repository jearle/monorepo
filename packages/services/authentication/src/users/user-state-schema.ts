import { z } from 'zod';

export const UserStateSchema = z.enum([
  'active',
  'inactive',
  'pending_verification',
  'suspended',
  'deleted',
]);
