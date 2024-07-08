import { v4 as uuidv4 } from 'uuid';
import { IReserve } from '../interfaces/reserve.interface';
import { IReserveRepository } from '../repositories.interfaces/reserve.repository.interface';

class ReserveRepositoryInMemory implements IReserveRepository {
  private reserves: IReserve[] = [];

  async createReserve(reserveData: IReserve): Promise<IReserve> {
    reserveData._id = uuidv4();
    return await this.save(reserveData);
  }
  async save(reserve: IReserve): Promise<IReserve> {
    this.reserves.push(reserve);
    return reserve;
  }
  async clear() {
    this.reserves = [];
  }

  async findAllWithPagination(options: any): Promise<{ reserves: IReserve[]; total: number }> {
    const { where = {}, skip = 0, take = 10 } = options;
    let filteredReserves = this.reserves;

    if (where.id_user && where.id_user.$regex) {
      const regex = new RegExp(where.color.$regex, where.color.$options);
      filteredReserves = filteredReserves.filter(reserve => regex.test(reserve.id_user));
    }
    if (where.id_car && where.id_car.$regex) {
      const regex = new RegExp(where.color.$regex, where.color.$options);
      filteredReserves = filteredReserves.filter(reserve => regex.test(reserve.id_car));
    }
    const total = filteredReserves.length;
    const reserves = filteredReserves.slice(skip, skip + take);
    return { reserves, total };
  }

  async getReserveById(id: string): Promise<IReserve | null> {
    return this.reserves.find(reserve => reserve._id.valueOf() === id) || null;
  }

  async updateReserve(reserveData: Partial<IReserve>): Promise<IReserve | null> {
    const index = this.reserves.findIndex(reserve => reserve._id.valueOf() === reserveData._id);
    if (index === -1) return null;
    
    const updatedReserve = Object.assign(this.reserves[index], reserveData);
    this.reserves[index] = updatedReserve;
    return updatedReserve;
  }

  async deleteReserve(id: string): Promise<void> {
    this.reserves = this.reserves.filter(reserve => reserve._id.valueOf()  !== id);
  }

  async getReservesByUserId(userId: string): Promise<IReserve[]> {
    return this.reserves.filter(reserve => reserve.id_user.valueOf() === userId);
  }

  async getReservesByCarId(carId: string): Promise<IReserve[]> {
    return this.reserves.filter(reserve => reserve.id_car.valueOf() === carId);
  }
}

export default ReserveRepositoryInMemory;
