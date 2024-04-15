import { z } from "zod";

export const DocumentTypeSchema = z.object({
  date: z.date(),
  title: z.string(),
  url: z.string(),
  country: z.string(),
  chunk: z.string(),
});

export const DocumentTypeArraySchema = z.array(DocumentTypeSchema);

export type DocumentType = z.infer<typeof DocumentTypeSchema>;
