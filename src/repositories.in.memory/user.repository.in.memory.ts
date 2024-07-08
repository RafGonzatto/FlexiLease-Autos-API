import { v4 as uuidv4 } from 'uuid';
import { IUser } from '../interfaces/user.interface';
import { IUserRepository } from '../repositories.interfaces/user.repository.interface';

class UserRepositoryInMemory implements IUserRepository {
  private repository: IUser[] = [];

  async createUser(userData: IUser): Promise<IUser> {
    userData._id = uuidv4(); 
    return await this.save(userData);
  }

  async save(user: IUser): Promise<IUser> {
    this.repository.push(user);
    return user;
  }
  async clear(): Promise<void> {
    this.repository = [];
  }
  async findOneByConditions(conditions: any): Promise<IUser | null> {
    return this.repository.find(user => {
      return Object.entries(conditions).every(([key, value]) => user[key] === value);
    }) || null;
  }

  async getUserById(id: string): Promise<IUser | null> {
    return this.repository.find(user => user._id.valueOf() === id) || null;
  }

  async updateUser(userData: IUser): Promise<IUser | null> {
  
    return await this.save(userData);
  }

  async deleteUserById(id: string): Promise<boolean> {
    const initialLength = this.repository.length;
    this.repository = this.repository.filter(user => user._id.valueOf() !== id);
    return this.repository.length < initialLength;
  }

  async findByEmailAndPassword(email: string, password: string): Promise<IUser | null> {
    return this.repository.find(user => user.email === email && user.password === password) || null;
  }

  async deleteUser(id: string): Promise<void> {
    this.repository = this.repository.filter(u => u._id.valueOf() !== id);
  }

  async findAllWithPagination(options: { skip: number; take: number }): Promise<{ users: IUser[], total: number }> {
    const users = this.repository.slice(options.skip, options.skip + options.take);
    const total = this.repository.length;
    return { users, total };
  }
}

export default UserRepositoryInMemory;
