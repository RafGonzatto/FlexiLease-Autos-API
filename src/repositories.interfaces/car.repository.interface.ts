import { Car } from '../entities/car.entity';
import { ICar } from '../interfaces/car.interface';
import { DeleteResult } from 'typeorm';

export interface ICarRepository {
  getCarById(id: string): Promise<ICar | undefined>;
  createCar(carData: ICar): Promise<Car>;
  updateCar(carData: Partial<ICar>): Promise<Car | undefined>;
  deleteCar(id: string): Promise<boolean>;
  findCars(filters: any, limit: number, offset: number): Promise<[Car[], number]>;
}
