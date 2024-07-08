import { FindManyOptions } from 'typeorm'
import { ObjectId } from 'mongodb';
import { IReserve } from '../interfaces/reserve.interface'
import { IReserveRepository } from '../repositories.interfaces/reserve.repository.interface'
import { ICarRepository } from '../repositories.interfaces/car.repository.interface'
import { IUserRepository } from '../repositories.interfaces/user.repository.interface'
import createError from 'http-errors'
import { inject, injectable } from 'tsyringe'
import { parse } from 'date-fns';
import { Reserve } from '../entities/reserve.entity'

@injectable()
class ReserveService {
  constructor(
    @inject('ReserveRepository')
    private reserveRepository: IReserveRepository,
    @inject('CarRepository')
    private carRepository: ICarRepository,
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  async createReserve(id_user: string, id_car: string, start_date: string, end_date: string): Promise<IReserve> {
    const reserveData: IReserve = {
        start_date,
        end_date,
        id_user,
        id_car
    };

    const car = await this.carRepository.getCarById(reserveData.id_car.toString());
    if (!car) {
        throw new createError.NotFound('Car not found');
    }

    const user = await this.userRepository.getUserById(reserveData.id_user.toString());
    if (!user) {
        throw new createError.NotFound('User not found');
    }

    if (user.qualified === "não") {
        throw new createError.BadRequest('User is not qualified');
    }

    const userReserves = await this.reserveRepository.getReservesByUserId(id_user);
    const carReserves = await this.reserveRepository.getReservesByCarId(id_car);

    const parseDate = (dateStr: string) => parse(dateStr, 'dd/MM/yyyy', new Date());

    const newStartDate = parseDate(reserveData.start_date);
    const newEndDate = parseDate(reserveData.end_date);

    await this.checkReservationConflicts(userReserves, carReserves, newStartDate, newEndDate);

    const carReservePeriod = await this.calculateDateDifference(reserveData.start_date, reserveData.end_date);
    const final_value = car.value_per_day * carReservePeriod;
    reserveData.final_value = final_value.toString();

    const createdReserve = await this.reserveRepository.createReserve(reserveData);
    return createdReserve;
}

  async getAllReserves(filters: any,  limit?: number, offset?: number) {
    const whereConditions: any = {};
    
    if (filters._id) whereConditions._id = new ObjectId(filters._id);
    if (filters.id_user) whereConditions.id_user = new ObjectId(filters.id_user);
    if (filters.id_car) whereConditions._id = new ObjectId(filters.id_car);
  
    if (filters.id_user) whereConditions.id_user = { $regex: `.*${filters.id_user}.*`, $options: 'i' };
    if (filters.id_car) whereConditions.id_car = { $regex: `.*${filters.id_car}.*`, $options: 'i' };
    if (filters.start_date) whereConditions.start_date = { $regex: `.*${filters.start_date}.*`, $options: 'i' };
    if (filters.end_date) whereConditions.color = { $regex: `.*${filters.end_date}.*`, $options: 'i' };
    if (filters.final_value) whereConditions.final_value = { $regex: `.*${filters.final_value}.*`, $options: 'i' };


  if (filters.number_of_passengers) whereConditions.number_of_passengers = filters.number_of_passengers;
    const options: FindManyOptions<Reserve> = {
        where: whereConditions,
        take: limit,
        skip: offset,
    };

    const { reserves, total } = await this.reserveRepository.findAllWithPagination(options);

    const offsets = Math.ceil(total / limit);

    return { reserves, total, limit, offset, offsets };
}
  async getReserveById(id: string): Promise<IReserve | null> {
    const reserveResult = await this.reserveRepository.getReserveById(id);
    return reserveResult
  }
  async updateReserve(id: string, reserveData: any): Promise<IReserve | null> {
    const existingReserve: IReserve = await this.reserveRepository.getReserveById(id);
    if (!existingReserve) {
        throw new createError.NotFound('Reserve not found');
    }

    const car = await this.carRepository.getCarById(reserveData.id_car);
    if (!car) {
        throw new createError.NotFound('Car not found');
    }

    const user = await this.userRepository.getUserById(reserveData.id_user);
    if (!user) {
        throw new createError.NotFound('User not found');
    }

    if (user.qualified === "não") {
        throw new createError.BadRequest('User is not qualified');
    }

    let carReserves = await this.reserveRepository.getReservesByCarId(reserveData.id_car);
    let userReserves = await this.reserveRepository.getReservesByUserId(reserveData.id_user);

    carReserves = carReserves.filter(reserve => reserve._id !== new ObjectId(id));
    userReserves = userReserves.filter(reserve => reserve._id !== new ObjectId(id));

    const parseDate = (dateStr: string) => parse(dateStr, 'dd/MM/yyyy', new Date());
    
    const newStartDate = parseDate(reserveData.start_date);
    const newEndDate = parseDate(reserveData.end_date);

    await this.checkReservationConflicts(userReserves, carReserves, newStartDate, newEndDate);

    const carReservePeriod = await this.calculateDateDifference(reserveData.start_date, reserveData.end_date);
    const final_value = car.value_per_day * carReservePeriod;
    reserveData.final_value = final_value.toString();

    const updatedReserve = await this.reserveRepository.updateReserve(existingReserve);
    return updatedReserve;
}

    private async checkReservationConflicts(userReserves: any[], carReserves: any[], newStartDate: Date, newEndDate: Date) {
      const parseDate = (dateStr: string) => parse(dateStr, 'dd/MM/yyyy', new Date());
  
      for (const userReserve of userReserves) {
          const existingStartDate = parseDate(userReserve.start_date);
          const existingEndDate = parseDate(userReserve.end_date);
  
          if (
              (newStartDate >= existingStartDate && newStartDate <= existingEndDate) ||
              (newEndDate >= existingStartDate && newEndDate <= existingEndDate) ||
              (existingStartDate >= newStartDate && existingEndDate <= newEndDate)
          ) {
              throw new createError.BadRequest('User already has a reservation for a car in the specified period');
          }
      }
  
      for (const carReserve of carReserves) {
          const existingStartDate = parseDate(carReserve.start_date);
          const existingEndDate = parseDate(carReserve.end_date);
  
          if (
              (newStartDate >= existingStartDate && newStartDate <= existingEndDate) ||
              (newEndDate >= existingStartDate && newEndDate <= existingEndDate) ||
              (existingStartDate >= newStartDate && existingEndDate <= newEndDate)
          ) {
              throw new createError.BadRequest('Car is already reserved in the specified period');
          }
      }
  }
  
  async deleteReserve(id: string): Promise<void> {
    await this.reserveRepository.deleteReserve(id);
  }
  async calculateDateDifference(startDateStr: string, endDateStr: string): Promise<number> {
    const startDateParts = startDateStr.split('/');
    const endDateParts = endDateStr.split('/');
  
    const startDate = new Date(+startDateParts[2], +startDateParts[1] - 1, +startDateParts[0]);
    const endDate = new Date(+endDateParts[2], +endDateParts[1] - 1, +endDateParts[0]);
  
    const differenceMs = endDate.getTime() - startDate.getTime();
  
    const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
  
    return differenceDays;
  }
  
}
export default ReserveService
