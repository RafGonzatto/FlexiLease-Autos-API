import { User } from '../entities/user.entity';
import { IUser } from '../interfaces/user.interface';
import { ObjectId } from 'mongodb';
import { FindManyOptions } from 'typeorm';
export interface IUserRepository {
  createUser(userData: IUser): Promise<User>;
  findOneByConditions(conditions: any): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  updateUser( userData: Partial<IUser>): Promise<User | null>;
  deleteUser(user: User): Promise<void>;
  findByEmailAndPassword(email: string, password: string): Promise<IUser | null>;
  findAllWithPagination(options:FindManyOptions): Promise<{ users: User[], total: number }> 
}
