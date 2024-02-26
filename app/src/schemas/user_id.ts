import { z } from 'zod';

export const user_id_schema = z.object({
  user_id: z.string()
});
