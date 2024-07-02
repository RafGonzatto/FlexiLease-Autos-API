import { z } from 'zod';

const carSchema = z.object({
  model: z.string().nonempty({
    message: "Model is required and cannot be empty",
  }),
  color: z.string().nonempty({
    message: "Color is required and cannot be empty",
  }),
  year: z.string().regex(/^\d{4}$/).refine(val => {
    const year = parseInt(val);
    return year >= 1950 && year <= 2023;
  }, {
    message: "Year must be a valid 4-digit number between 1950 and 2023",
  }),
  value_per_day: z.number().positive({
    message: "Value per day must be a positive number",
  }),
  accessories: z.array(
    z.object({
      description: z.string({
        message: "Description is required for each accessory",
      }),
    })
  )
  .min(1, {
    message: "At least one accessory must be provided",
  })
  .refine(accessories => {
    const descriptions = accessories.map(acc => acc.description);
    return new Set(descriptions).size === descriptions.length;
  }, {
    message: "Accessories must be unique",
  }),
  number_of_passengers: z.number().positive({
    message: "Number of passengers must be a positive number",
  }),
});

export { carSchema };
