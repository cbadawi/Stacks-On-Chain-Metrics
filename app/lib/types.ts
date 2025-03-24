import { z } from 'zod';

export const explanationSchema = z.object({
  section: z.string(),
  explanation: z.string(),
});
export const explanationsSchema = explanationSchema;

export type QueryExplanation = z.infer<typeof explanationSchema>;
