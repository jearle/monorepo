import type z from 'zod';
import { MessageSchema } from './message-schema';

export type Message = Readonly<z.infer<typeof MessageSchema>>;
