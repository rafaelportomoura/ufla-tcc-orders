import { z } from 'zod';

export const header_schema = z.object({
  user_id: z.string()
});
