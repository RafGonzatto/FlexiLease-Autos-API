import { z } from 'zod';

const reserveSchema = z.object({
  start_date: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/).nonempty(),
  end_date: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/).nonempty(),
  id_car: z.string(), 
});

export { reserveSchema };
