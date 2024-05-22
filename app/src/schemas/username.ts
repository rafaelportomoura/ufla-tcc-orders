import { z } from 'zod';

export const username_schema = z.object({
  username: z.string()
});
