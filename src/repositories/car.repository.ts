import { getRepository, Not, Repository } from 'typeorm';
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
  async findCars(filters: any, limit: number, offset: number): Promise<[Car[], number]> {
    const query = this.repository.createQueryBuilder('car')
      .skip(offset)
      .take(limit);

    Object.keys(filters).forEach((key) => {
      query.andWhere(`car.${key} = :${key}`, { [key]: filters[key] });
    });

    const [cars, total] = await query.getManyAndCount();
    return [cars, total];
  }
  async getCarById(id: string): Promise<Car | null> {
    return await this.repository.findOne({ where: { _id: new ObjectId(id) } });
  }
  async updateCar(carData: Partial<Car>): Promise<Car | null> {
    const car = await this.repository.save(carData);
    return car;
  }
  async deleteCar(id: string): Promise<boolean> {
    const result = await this.repository.delete({ _id: new ObjectId(id)  });
    return result.affected > 0;
  }
  
}

export default CarRepository
