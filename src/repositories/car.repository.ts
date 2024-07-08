import { FindManyOptions, getRepository, Not, Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Car } from '../entities/car.entity';
import {ICar} from '../interfaces/car.interface'
import { ICarRepository } from '../repositories.interfaces/car.repository.interface';
import AppDataSource from '../database/connection'

class CarRepository implements ICarRepository {
  private repository: Repository<Car>;

  constructor() {
    this.repository = AppDataSource.getRepository(Car);
  }

  async createCar(carData: ICar) {
    const car = this.repository.create(carData)
    return await this.repository.save(car);
  }
  async findAllWithPagination(options:FindManyOptions): Promise<{ cars: ICar[], total: number }> {
    const cars: Car[] = await this.repository.find(options);

    const total: number = await this.repository.count(options);

    return { cars, total };
}

  async getCarById(id: string): Promise<ICar | null> {
    return await this.repository.findOne({ where: { _id: new ObjectId(id) } });
  }
  async updateCar(carData: Partial<Car>): Promise<ICar | null> {
    const car = await this.repository.save(carData);
    return car;
  }
  async deleteCar(id: string): Promise<void> {
    await this.repository.delete({ _id: new ObjectId(id)  });
  }
  async clear(): Promise<void> {
  }
}

export default CarRepository
