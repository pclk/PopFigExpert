import {z} from 'zod';
import { MessageArraySchema } from './MessageType';

// HistoryType.ts at src/app/lib/validators

export const HistoryTypeSchema = z.object({
  id: z.string(),
  label: z.string(),
  messages: MessageArraySchema,
});

export const HistoryTypeArraySchema = z.array(HistoryTypeSchema);

export type HistoryType = z.infer<typeof HistoryTypeSchema>;
