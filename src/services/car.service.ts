import { DeleteResult, ObjectId } from 'typeorm'
import { ICar } from '../interfaces/car.interface'
import { ICarRepository } from '../repositories.interfaces/car.repository.interface'
import createError from 'http-errors'
import { inject, injectable } from 'tsyringe'
import { Car } from '../entities/car.entity'
import { Accessorie } from '../models/accessorie.model'

@injectable()
class CarService {
  constructor(
    @inject('CarRepository')
    private carRepository: ICarRepository,
  ) {}

  async createCar(carData: ICar): Promise<ICar> {
    const accessories = carData.accessories.map(accessoryData => new Accessorie(accessoryData.description));

    const carResult: ICar = {
      model: carData.model,
      color: carData.color,
      year: carData.year,
      value_per_day: carData.value_per_day,
      accessories: accessories,
      number_of_passengers: carData.number_of_passengers,
    };


    const createdCar  = await this.carRepository.createCar(carResult);
    return createdCar;
  }
  async findCars(filters: any, limit: number, offset: number) {
    const [cars, total] = await this.carRepository.findCars(filters, limit, offset);

    return {
      cars,
      total,
      limit,
      offset,
      offsets: Math.ceil(total / limit),
    };
  }
  async getCarById(id: string): Promise<ICar | null> {
    const carResult = await this.carRepository.getCarById(id);
    delete carResult._id;
    return carResult
  }
  async updateCar(id: string, carData: Partial<ICar>): Promise<ICar | null> {
    const existingCar: ICar = await this.carRepository.getCarById(id);
    if (!existingCar) {
      throw new createError.NotFound('Car not found');
    }

    const existingAccessoriesMap = new Map(existingCar.accessories.map(acc => [acc._id.toHexString(), acc]));

    existingCar.model = carData.model;
    existingCar.color = carData.color;
    existingCar.year = carData.year;
    existingCar.value_per_day = carData.value_per_day;
    existingCar.number_of_passengers = carData.number_of_passengers;

    const updatedAccessories: Accessorie[] = [];
    for (const newAccessory of carData.accessories) {
      if (newAccessory._id && existingAccessoriesMap.has(newAccessory._id.toString())) {
        const existingAccessory = existingAccessoriesMap.get(newAccessory._id.toString());
        existingAccessory.description = newAccessory.description;
        updatedAccessories.push(existingAccessory);
      } else {
        updatedAccessories.push(new Accessorie(newAccessory.description));
      }
    }

    existingCar.accessories = updatedAccessories;

    const updatedCar = await this.carRepository.updateCar(existingCar);
    return updatedCar;
  }
  async deleteCar(id: string): Promise<boolean> {
    const result =  await this.carRepository.deleteCar(id);
    if (result) {
      return true; 
    } else {
      throw new createError.NotFound('Car not found');
    }
  }
  
  
}
export default CarService
