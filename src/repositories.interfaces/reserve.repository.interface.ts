import { Reserve } from '../entities/reserve.entity';
import { IReserve } from '../interfaces/reserve.interface';
import { FindManyOptions } from 'typeorm';
export interface IReserveRepository {
  createReserve(reserveData: IReserve): Promise<IReserve>;
  getReserveById(id: string): Promise<IReserve | null>;
  updateReserve( reserveData: Partial<IReserve>): Promise<IReserve | null>;
  deleteReserve(id: string): Promise<void>;
  findAllWithPagination(options:FindManyOptions): Promise<{ reserves: IReserve[], total: number }> 
  getReservesByUserId(userId: string): Promise<IReserve[]> 
  getReservesByCarId(carId: string): Promise<IReserve[]> 
  clear(): Promise<void>; 
}
