import { Request, Response, NextFunction } from 'express';
import { userSchema } from '../validators/user.validator';

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { name, cpf, birth, email, password, cep, qualified } = req.body;

  const validation = userSchema.safeParse({ name, cpf, birth, email, password, cep, qualified });

  if (!validation.success) {
    const exampleUser = {
      name: "John Doe",
      cpf: "778.146.327-73",
      birth: "03/03/2000",
      email: "john.doe@example.com",
      password: "123456",
      cep: "99010051",
      qualified: "sim"
    };

    const errorMessages = validation.error.errors.map((error) => ({
      field: error.path.join('.'),
      message: error.message
    }));

    return res.status(400).json({
      code: 400,
      message: "Validation failed",
      details: errorMessages,
      example: exampleUser
    });
  }

  next();
};
