import { FindManyOptions, Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { User } from '../entities/user.entity';
import { IUser } from '../interfaces/user.interface';
import { IUserRepository } from '../repositories.interfaces/user.repository.interface';
import AppDataSource from '../database/connection';

class UserRepository implements IUserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async createUser(userData: IUser) {
    const user = this.repository.create(userData);
    return await this.repository.save(user);
  }
  async findOneByConditions(conditions: any): Promise<User | null> {
    return await this.repository.findOne({ where: conditions });
  }
  async getUserById(id: string): Promise<User | null> {
    return await this.repository.findOne({ where: { _id: new ObjectId(id) } });
  }
  async updateUser(userData: Partial<User>): Promise<User | null> {
    const user = await this.repository.save(userData);
    return user;
  }
  async findByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<IUser | null> {
    return await this.repository.findOne({
      where: { email: email, password: password },
    });
  }
  async deleteUser(id: string): Promise<void> {
    await this.repository.delete({ _id: new ObjectId(id) });
  }

  async findAllWithPagination(
    options: FindManyOptions,
  ): Promise<{ users: User[]; total: number }> {
    const users: User[] = await this.repository.find(options);
    const total: number = users.length;
    return { users, total };
  }
  async clear(): Promise<void> {}
}

export default UserRepository;
