import { User } from '../entities/user.entity';
import { IUser } from '../interfaces/user.interface';
import { FindManyOptions } from 'typeorm';
export interface IUserRepository {
  createUser(userData: IUser): Promise<IUser>;
  findOneByConditions(conditions: any): Promise<IUser | null>;
  getUserById(id: string): Promise<IUser | null>;
  updateUser(userData: Partial<IUser>): Promise<IUser | null>;
  deleteUser(id: string): Promise<void>;
  findByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<IUser | null>;
  findAllWithPagination(
    options: FindManyOptions,
  ): Promise<{ users: IUser[]; total: number }>;
  clear(): Promise<void>;
}
