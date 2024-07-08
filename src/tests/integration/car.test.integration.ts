import 'reflect-metadata';
import { IReserveRepository } from '../../repositories.interfaces/reserve.repository.interface';
import { ICarRepository } from '../../repositories.interfaces/car.repository.interface';
import CarRepositoryInMemory from '../../repositories.in.memory/car.repository.in.memory';
import ReserveRepositoryInMemory from '../../repositories.in.memory/reserve.repository.in.memory';
import CarService from '../../services/car.service';
import { ICar } from '../../interfaces/car.interface';

let createCarService: CarService;
let carsRepository: ICarRepository;
let reservesRepository: IReserveRepository;

beforeAll(() => {
  carsRepository = new CarRepositoryInMemory();
  reservesRepository = new ReserveRepositoryInMemory(); 
  createCarService = new CarService(carsRepository, reservesRepository);
});
beforeEach(async () => {
  await carsRepository.clear();
});
describe('Car Service Integration Tests', () => {
  it('should be able to create a new car', async () => {
    const carData: ICar = {
      model: "Civic S10 2.8",
      color: "Silver",
      year: "2020",
      value_per_day: 150,
      accessories: [
        { description: "GPS" },
        { description: "Leather seats" }
      ],
      number_of_passengers: 5
    };

    const newCar = await createCarService.createCar(carData);

    expect(newCar).toHaveProperty('_id');
    expect(newCar.model).toBe(carData.model);
    expect(newCar.color).toBe(carData.color);
    expect(newCar.year).toBe(carData.year);
    expect(newCar.value_per_day).toBe(carData.value_per_day);
    expect(newCar.accessories).toHaveLength(carData.accessories.length);
    expect(newCar.number_of_passengers).toBe(carData.number_of_passengers);
  });

  it('should be able to find all cars with pagination', async () => {
    const carData1: ICar = {
      model: "Civic S10 2.8",
      color: "Beige",
      year: "2020",
      value_per_day: 150,
      accessories: [
        { description: "GPS" },
        { description: "Leather seats" }
      ],
      number_of_passengers: 5
    };

    const carData2: ICar = {
      model: "Corolla 1.8",
      color: "Beige",
      year: "2021",
      value_per_day: 160,
      accessories: [
        { description: "Bluetooth" },
        { description: "Sunroof" }
      ],
      number_of_passengers: 5
    };

    await carsRepository.createCar(carData1);
    await carsRepository.createCar(carData2);

    const filters = {"color": "Beige"};
    const { cars, total } = await createCarService.getAllCars(filters, 10, 0);

    expect(cars).toHaveLength(2);
    expect(total).toBe(2);
  });

  it('should be able to get a car by ID', async () => {
    const carData: ICar = {
      model: "Civic S10 2.8",
      color: "Silver",
      year: "2020",
      value_per_day: 150,
      accessories: [
        { description: "GPS" },
        { description: "Leather seats" }
      ],
      number_of_passengers: 5
    };

    const newCar = await createCarService.createCar(carData);
    const foundCar = await createCarService.getCarById(newCar._id.valueOf().toString());

    expect(foundCar).not.toBeNull();
    expect(foundCar?._id).toBe(newCar._id);
    expect(foundCar?.model).toBe(carData.model);
    expect(foundCar?.color).toBe(carData.color);
    expect(foundCar?.year).toBe(carData.year);
    expect(foundCar?.value_per_day).toBe(carData.value_per_day);
    expect(foundCar?.accessories).toHaveLength(carData.accessories.length);
    expect(foundCar?.number_of_passengers).toBe(carData.number_of_passengers);
  });

  it('should be able to update a car', async () => {
    const carData: ICar = {
      model: "Civic S10 2.8",
      color: "Silver",
      year: "2020",
      value_per_day: 150,
      accessories: [
        { description: "GPS" },
        { description: "Leather seats" }
      ],
      number_of_passengers: 5
    };

    const newCar = await createCarService.createCar(carData);

    const updatedCarData: ICar = {
      model: "Civic S10 3.0",
      color: "Red",
      year: "2021",
      value_per_day: 100,
      accessories: [
        { description: "GPS" },
        { description: "Leather seats" }
      ],
      number_of_passengers: 5
    };

    const updatedCar = await createCarService.updateCar(newCar._id.valueOf().toString(), updatedCarData);

    expect(updatedCar).not.toBeNull();
    expect(updatedCar?._id).toBe(newCar._id);
    expect(updatedCar?.color).toBe("Red");
    expect(updatedCar?.model).toBe(updatedCarData.model);
    expect(updatedCar?.year).toBe(updatedCarData.year);
    expect(updatedCar?.value_per_day).toBe(updatedCarData.value_per_day);
    expect(updatedCar?.accessories).toHaveLength(updatedCarData.accessories.length);
    expect(updatedCar?.number_of_passengers).toBe(updatedCarData.number_of_passengers);
  });

  it('should be able to delete a car', async () => {
    const carData: ICar = {
      model: "Civic S10 2.8",
      color: "Silver",
      year: "2020",
      value_per_day: 150,
      accessories: [
        { description: "GPS" },
        { description: "Leather seats" }
      ],
      number_of_passengers: 5
    };

    const newCar = await createCarService.createCar(carData);

    await createCarService.deleteCar(newCar._id.valueOf().toString());

    const foundCar = await createCarService.getCarById(newCar._id.valueOf().toString());

    expect(foundCar).toBeNull();
  });
});
