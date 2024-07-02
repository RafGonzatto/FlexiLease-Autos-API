import { Request, Response, NextFunction } from 'express';
import { carSchema } from '../validators/car.validator';

export const carMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { model, color, year, value_per_day, accessories, number_of_passengers } = req.body;

  const validation = carSchema.safeParse({
    model,
    color,
    year,
    value_per_day,
    accessories,
    number_of_passengers,
  });

  if (!validation.success) {
    const exampleCar = {
      model: "Civic S10 2.8",
      color: "Silver",
      year: "2020",
      value_per_day: 150,
      accessories: [
        { description: "GPS" },
        { description: "Leather seats" }
      ],
      number_of_passengers: 5
    };

    const errorMessages = validation.error.errors.map((error) => ({
      field: error.path.join('.'),
      message: error.message
    }));

    return res.status(400).json({
      code: 400,
      message: "Validation failed",
      details: errorMessages,
      example: exampleCar
    });
  }

  next();
};
