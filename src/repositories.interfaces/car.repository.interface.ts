import { Car } from '../entities/car.entity';
import { ICar } from '../interfaces/car.interface';
import { FindManyOptions } from 'typeorm';

export interface ICarRepository {
  getCarById(id: string): Promise<ICar | undefined>;
  createCar(carData: ICar): Promise<ICar>;
  updateCar(carData: Partial<ICar>): Promise<ICar | undefined>;
  deleteCar(id: string): Promise<void>;
  findAllWithPagination(options:FindManyOptions): Promise<{ cars: ICar[], total: number }> 
  clear(): Promise<void>; 
}
