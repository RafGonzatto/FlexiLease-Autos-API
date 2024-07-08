import { v4 as uuidv4 } from 'uuid';
import { ICar } from '../interfaces/car.interface';
import { ICarRepository } from '../repositories.interfaces/car.repository.interface';

class CarRepositoryInMemory implements ICarRepository {
  private cars: ICar[] = [];

  async createCar(carData: ICar): Promise<ICar> {
    carData._id = uuidv4()
    return await this.save(carData);
  }
  async save(car: ICar): Promise<ICar> {
    this.cars.push(car);
    return car;
  }
  async clear() {
    this.cars = [];
  }

  async findAllWithPagination(options: any): Promise<{ cars: ICar[]; total: number }> {
    const { where = {}, skip = 0, take = 10 } = options;
    let filteredCars = this.cars;

    if (where.color && where.color.$regex) {
      const regex = new RegExp(where.color.$regex, where.color.$options);
      filteredCars = filteredCars.filter(car => regex.test(car.color));
    }
    const total = filteredCars.length;
    const cars = filteredCars.slice(skip, skip + take);

    return { cars, total };
  }

  async getCarById(id: string): Promise<ICar | null> {
    const car = this.cars.find(car => car._id.toString() === id);
    return car || null;
  }

  async updateCar(carData: Partial<ICar>): Promise<ICar | null> {
    const index = this.cars.findIndex(car => car._id.valueOf()  === carData._id);
    if (index === -1) return null;
    
    const updatedCar = Object.assign(this.cars[index], carData);
    this.cars[index] = updatedCar;
    return updatedCar;
  }

  async deleteCar(id: string): Promise<void> {
    this.cars = this.cars.filter(car => car._id.valueOf() !== id);
  }
}

export default CarRepositoryInMemory;
