import { Request, Response, NextFunction } from 'express';
import { reserveSchema } from '../validators/reserve.validator';

export const reserveMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id_user, id_car, start_date, end_date } = req.body;

  const validation = reserveSchema.safeParse({
    id_user,
    id_car,
    start_date,
    end_date,
  });

  if (!validation.success) {
    const exampleReserve = {
      id_user: '66841d6d983f8b0f66db46b0',
      id_car: '6685a207b7dd64c7d7e38b12',
      start_date: '20/04/2023',
      end_date: '30/04/2023',
    };

    const errorMessages = validation.error.errors.map((error) => ({
      field: error.path.join('.'),
      message: error.message,
    }));

    return res.status(400).json({
      code: 400,
      message: 'Validation failed',
      details: errorMessages,
      example: exampleReserve,
    });
  }

  next();
};
