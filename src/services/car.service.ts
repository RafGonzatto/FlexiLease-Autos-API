import { DeleteResult, FindManyOptions } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ICar } from '../interfaces/car.interface';
import { ICarRepository } from '../repositories.interfaces/car.repository.interface';
import { IReserveRepository } from '../repositories.interfaces/reserve.repository.interface';
import createError from 'http-errors';
import { inject, injectable } from 'tsyringe';
import { Car } from '../entities/car.entity';
import { Accessorie } from '../models/accessorie.model';

@injectable()
class CarService {
  constructor(
    @inject('CarRepository')
    private carRepository: ICarRepository,
    @inject('ReserveRepository')
    private reserveRepository: IReserveRepository,
  ) {}

  async createCar(carData: ICar): Promise<ICar> {
    const accessories = carData.accessories.map(
      (accessoryData) => new Accessorie(accessoryData.description),
    );

    const carResult: ICar = {
      model: carData.model,
      color: carData.color,
      year: carData.year,
      value_per_day: carData.value_per_day,
      accessories: accessories,
      number_of_passengers: carData.number_of_passengers,
    };

    const createdCar = await this.carRepository.createCar(carResult);
    return createdCar;
  }
  async getAllCars(filters: any, limit?: number, offset?: number) {
    const whereConditions: any = {};

    if (filters._id) whereConditions._id = new ObjectId(filters._id);
    if (filters.model)
      whereConditions.model = { $regex: `.*${filters.model}.*`, $options: 'i' };
    if (filters.color)
      whereConditions.color = { $regex: `.*${filters.color}.*`, $options: 'i' };
    if (filters.year)
      whereConditions.year = { $regex: `.*${filters.year}.*`, $options: 'i' };
    if (filters.value_per_day)
      whereConditions.value_per_day = {
        $regex: `.*${filters.value_per_day}.*`,
        $options: 'i',
      };

    if (
      (filters.accessories_description &&
        filters.accessories_description.length > 0) ||
      (filters.accessories_id && filters.accessories_id.length > 0)
    ) {
      const elemMatchConditions: any = {};

      if (
        filters.accessories_description &&
        filters.accessories_description.length > 0
      ) {
        elemMatchConditions.description = {
          $in: filters.accessories_description.map(
            (description: string) => new RegExp(description, 'i'),
          ),
        };
      }

      if (filters.accessories_id && filters.accessories_id.length > 0) {
        elemMatchConditions._id = {
          $in: filters.accessories_id.map((id: string) => new ObjectId(id)),
        };
      }

      whereConditions.accessories = { $elemMatch: elemMatchConditions };
    }

    if (filters.number_of_passengers)
      whereConditions.number_of_passengers = filters.number_of_passengers;
    const options: FindManyOptions<Car> = {
      where: whereConditions,
      take: limit,
      skip: offset,
    };

    const { cars, total } =
      await this.carRepository.findAllWithPagination(options);

    const offsets = Math.ceil(total / limit);

    return { cars, total, limit, offset, offsets };
  }
  async getCarById(id: string): Promise<ICar | null> {
    const carResult = await this.carRepository.getCarById(id);
    return carResult;
  }
  async updateCar(id: string, carData: Partial<ICar>): Promise<ICar | null> {
    const existingCar: ICar = await this.carRepository.getCarById(id);
    if (!existingCar) {
      throw new createError.NotFound('Car not found');
    }

    const existingAccessoriesMap = new Map(
      existingCar.accessories.map((acc) => [acc._id.toHexString(), acc]),
    );

    existingCar.model = carData.model;
    existingCar.color = carData.color;
    existingCar.year = carData.year;
    existingCar.value_per_day = carData.value_per_day;
    existingCar.number_of_passengers = carData.number_of_passengers;

    const updatedAccessories: Accessorie[] = [];
    for (const newAccessory of carData.accessories) {
      if (
        newAccessory._id &&
        existingAccessoriesMap.has(newAccessory._id.toString())
      ) {
        const existingAccessory = existingAccessoriesMap.get(
          newAccessory._id.toString(),
        );
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
  async deleteCar(id: string): Promise<void> {
    const car = await this.carRepository.getCarById(id);
    if (!car) {
      throw new createError.NotFound('Car not found');
    }
    const reserves = await this.reserveRepository.getReservesByUserId(id);
    reserves.forEach(async (reserve) => {
      await this.reserveRepository.deleteReserve(reserve._id.toString());
    });

    await this.carRepository.deleteCar(id);
  }
}
export default CarService;
