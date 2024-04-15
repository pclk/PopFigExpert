import { z } from "zod";

// MessageType.ts at src/app/lib/validators

export const MessageSchema = z.object({
  id: z.string(),
  text: z.string(),
  isUser: z.boolean(),
});

export const MessageArraySchema = z.array(MessageSchema);

export type MessageType = z.infer<typeof MessageSchema>;
