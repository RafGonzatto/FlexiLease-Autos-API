import { Request, Response } from 'express'
import CarService from '../services/car.service'
import { container } from 'tsyringe'
import { ICar } from '../interfaces/car.interface'

class CarController {
  async createCar(req: Request, res: Response) {
    try {
      const { model, color, year, value_per_day, accessories, number_of_passengers } = req.body;
      
      const carData: ICar = {
        model: model,
        color: color,
        year : year,
        value_per_day: value_per_day,
        accessories: accessories,
        number_of_passengers: number_of_passengers,
      };

      const service = container.resolve(CarService)
      const carResult = await service.createCar(carData)
      return res.status(201).json(carResult)
    } catch (error: any) {
      if (error && error.status) {
        return res
          .status(error.status)
          .json({ code: error.status, message: error.message })
      } else {
        console.error('Error handling creation of car:', error)
        return res
          .status(500)
          .json({ code: 500, error: error.message.toString() })
      }
    }
  }
  async findCars(req: Request, res: Response) {
    try {
      const { model, color, year, value_per_day, accessories, number_of_passengers, limit = 10, offset = 0 } = req.query;
      const filters: any = {};
      if (model) filters.model = model;
      if (color) filters.color = color;
      if (year) filters.year = year;
      if (value_per_day) filters.value_per_day = Number(value_per_day);
      if (accessories) filters.accessories = { $elemMatch: { description: accessories } };
      if (number_of_passengers) filters.number_of_passengers = Number(number_of_passengers);

      const service = container.resolve(CarService);
      const result = await service.findCars(filters, Number(limit), Number(offset));

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Error handling fetching cars:', error);
      return res.status(500).json({ code: 500, error: error.message.toString() });
    }
  }
  async getCarById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const service = container.resolve(CarService);
      const car = await service.getCarById(id);
      if (!car) {
        return res.status(404).json({ message: 'Car not found' });
      }
      return res.status(200).json(car);
    } catch (error: any) {
      console.error('Error fetching car by ID:', error);
      return res.status(500).json({ code: 500, error: error.message.toString() });
    }
  }
  async updateCar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const carData = req.body;
      const service = container.resolve(CarService);
      const updatedCar = await service.updateCar(id, carData);
      if (!updatedCar) {
        return res.status(404).json({ message: 'Car not found' });
      }
      return res.status(200).json(updatedCar);
    } catch (error: any) {
      console.error('Error updating car:', error);
      return res.status(500).json({ code: 500, error: error.message.toString() });
    }
  }
  async deleteCar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const service = container.resolve(CarService);
      const deletedCar = await service.deleteCar(id);
      if (!deletedCar) {
        return res.status(404).json({ message: 'Car not found' });
      }
      return res.status(200).json({ message: 'Car deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting car:', error);
      return res.status(500).json({ code: 500, error: error.message.toString() });
    }
  }
  
}

export default CarController
