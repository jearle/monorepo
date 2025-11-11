import { z } from 'zod';

import { PayloadSchema } from './payload-schema';
import { AuthenticatePayloadSchema } from './authenticate-payload-schema';

export type Payload = z.infer<typeof PayloadSchema>;
export type AuthenticatePayload = z.infer<typeof AuthenticatePayloadSchema>;
