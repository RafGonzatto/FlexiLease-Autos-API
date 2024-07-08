import { FindManyOptions, getRepository, Not, Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Reserve } from '../entities/reserve.entity';
import { IReserve } from '../interfaces/reserve.interface';
import { IReserveRepository } from '../repositories.interfaces/reserve.repository.interface';
import AppDataSource from '../database/connection';

class ReserveRepository implements IReserveRepository {
  private repository: Repository<Reserve>;

  constructor() {
    this.repository = AppDataSource.getRepository(Reserve);
  }

  async createReserve(reserveData: IReserve) {
    const reserve = this.repository.create(reserveData);
    return await this.repository.save(reserve);
  }
  async findAllWithPagination(
    options: FindManyOptions,
  ): Promise<{ reserves: Reserve[]; total: number }> {
    const reserves: Reserve[] = await this.repository.find(options);

    const total: number = await this.repository.count(options);

    return { reserves, total };
  }

  async getReserveById(id: string): Promise<Reserve | null> {
    return await this.repository.findOne({ where: { _id: new ObjectId(id) } });
  }
  async updateReserve(
    reserveData: Partial<IReserve>,
  ): Promise<IReserve | null> {
    const reserve = await this.repository.save(reserveData);
    return reserve;
  }
  async deleteReserve(id: string): Promise<void> {
    const result = await this.repository.delete({ _id: new ObjectId(id) });
  }

  async getReservesByUserId(userId: string): Promise<IReserve[]> {
    const reserves = await this.repository.find({ where: { id_user: userId } });
    return reserves;
  }
  async getReservesByCarId(carId: string): Promise<IReserve[]> {
    const reserves = await this.repository.find({ where: { id_car: carId } });
    return reserves;
  }
  async clear(): Promise<void> {}
}

export default ReserveRepository;
