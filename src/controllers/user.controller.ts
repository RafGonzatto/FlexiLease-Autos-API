import { Request, Response } from 'express'
import UserService from '../services/user.service'
import { container } from 'tsyringe'
import { IUser } from '../interfaces/user.interface';
import { ObjectId } from 'mongodb';

class UserController {
  async createUser(req: Request, res: Response) {
    try {
        const { name, cpf, birth, email, password, cep, qualified } = req.body;

        // Aqui você pode montar o objeto de dados do usuário com os campos recebidos
        const userData : IUser = {
          name,
          cpf,
          birth,
          email,
          password,
          cep,
          qualified,
        };
      const service = container.resolve(UserService)
      const users = await service.createUser(userData)
      return res.status(200).json(users)
    } catch (error: any) {
      if (error && error.status) {
        return res
          .status(error.status)
          .json({ code: error.status, message: error.message })
      } else {
        console.error('Error handling creation of user:', error)
        return res
          .status(500)
          .json({ code: 500, error: error.message.toString() })
      }
    }
  }
  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const service = container.resolve(UserService);
      const user = await service.getUserById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(user);
    } catch (error: any) {
      console.error('Error fetching user by ID:', error);
      return res.status(500).json({ code: 500, error: error.message.toString() });
    }
  }
  async updateUser(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { name, cpf, birth, email, password, cep, qualified } = req.body;

        // Aqui você pode montar o objeto de dados do usuário com os campos recebidos
        const userData : IUser = {
          _id: new ObjectId(id),
          name,
          cpf,
          birth,
          email,
          password,
          cep,
          qualified,
        };
      const service = container.resolve(UserService)
      const users = await service.updateUser(userData)
      return res.status(200).json(users)
    } catch (error: any) {
      if (error && error.status) {
        return res
          .status(error.status)
          .json({ code: error.status, message: error.message })
      } else {
        console.error('Error handling updating of user:', error)
        return res
          .status(500)
          .json({ code: 500, error: error.message.toString() })
      }
    }
  }

  async authenticateUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

        // Aqui você pode montar o objeto de dados do usuário com os campos recebidos
      const service = container.resolve(UserService)
      const token = await service.authenticateUser(email, password)
      return res.status(200).json(token)
    } catch (error: any) {
      if (error && error.status) {
        return res
          .status(error.status)
          .json({ code: error.status, message: error.message })
      } else {
        console.error('Error handling authentication of user:', error)
        return res
          .status(500)
          .json({ code: 500, error: error.message.toString() })
      }
    }
  } 
  async deleteUser(req: Request, res: Response): Promise<Response> {

    try {
      const { id } = req.params;
      const service = container.resolve(UserService)
      await service.deleteUser(id);
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const { name, cpf, birth, email, cep, qualified, patio, complement, neighborhood, locality, uf, limit, offset } = req.query;

      const service = container.resolve(UserService)
      const users = await service.getAllUsers({
        name: name as string,
        cpf: cpf as string,
        birth: birth as string,
        email: email as string,
        cep: cep as string,
        qualified: qualified as string,
        patio: patio as string,
        complement: complement as string,
        neighborhood: neighborhood as string,
        locality: locality as string,
        uf: uf as string,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        offset: offset ? parseInt(offset as string, 10) : undefined,
      });

      return res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default UserController
