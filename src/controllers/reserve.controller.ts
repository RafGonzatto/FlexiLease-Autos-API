import { Request, Response } from 'express';
import ReserveService from '../services/reserve.service';
import { container } from 'tsyringe';

class ReserveController {
  async createReserve(req: Request, res: Response) {
    try {
      const { id_user, id_car, start_date, end_date } = req.body;
      const service = container.resolve(ReserveService);
      const reserves = await service.createReserve(
        id_user,
        id_car,
        start_date,
        end_date,
      );
      return res.status(201).json(reserves);
    } catch (error: any) {
      if (error && error.status) {
        return res
          .status(error.status)
          .json({ code: error.status, message: error.message });
      } else {
        console.error('Error handling creation of reserve:', error);
        return res
          .status(500)
          .json({ code: 500, error: error.message.toString() });
      }
    }
  }
  async findReserves(req: Request, res: Response) {
    try {
      const {
        _id,
        start_date,
        end_date,
        id_user,
        id_car,
        final_value,
        limit = 10,
        offset = 0,
      } = req.query;

      const filters: any = {
        _id,
        start_date,
        end_date,
        id_user,
        id_car,
        final_value,
      };
      const service = container.resolve(ReserveService);
      const reserves = await service.getAllReserves(
        filters,
        Number(limit),
        Number(offset),
      );
      return res.status(200).json(reserves);
    } catch (error: any) {
      console.error('Error handling fetching reserves:', error);
      return res
        .status(500)
        .json({ code: 500, error: error.message.toString() });
    }
  }
  async updateReserve(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { id_user, id_car, start_date, end_date } = req.body;
      const reserveData = {
        id_user,
        id_car,
        start_date,
        end_date,
      };
      const service = container.resolve(ReserveService);
      const updatedReserve = await service.updateReserve(id, reserveData);
      return res.status(200).json(updatedReserve);
    } catch (error: any) {
      if (error && error.status) {
        return res
          .status(error.status)
          .json({ code: error.status, message: error.message });
      } else {
        console.error('Error handling update of reserve:', error);
        return res
          .status(500)
          .json({ code: 500, error: error.message.toString() });
      }
    }
  }
  async getReserveById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const service = container.resolve(ReserveService);
      const reserve = await service.getReserveById(id);
      if (!reserve) {
        return res.status(404).json({ message: 'Reserve not found' });
      }
      return res.status(200).json(reserve);
    } catch (error: any) {
      console.error('Error fetching reserve by ID:', error);
      return res
        .status(500)
        .json({ code: 500, error: error.message.toString() });
    }
  }
  async deleteReserve(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const service = container.resolve(ReserveService);
      await service.deleteReserve(id);
      return res.status(204).json();
    } catch (error: any) {
      if (error && error.status) {
        return res
          .status(error.status)
          .json({ code: error.status, message: error.message });
      } else {
        console.error('Error handling deletion of reserve:', error);
        return res
          .status(500)
          .json({ code: 500, error: error.message.toString() });
      }
    }
  }
}

export default ReserveController;
