import { Request, Response, NextFunction } from 'express'
import { reserveSchema } from '../validators/reserve.validator'

export const reserveMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { room, capacity, day, time } = req.body

  const validation = reserveSchema.safeParse({
    room,
    capacity,
    day,
    time,
  })

  if (!validation.success) {
    const errorMessages = validation.error.errors.map(
      (error: { message: any }) => error.message,
    )
    const errorMessage = errorMessages.join(', ')
    return res.status(400).json({ error: errorMessage })
  }

  next()
}
