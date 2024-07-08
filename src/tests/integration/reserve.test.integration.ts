import 'reflect-metadata';
import { IReserveRepository } from '../../repositories.interfaces/reserve.repository.interface';
import { IUserRepository } from '../../repositories.interfaces/user.repository.interface';
import { ICarRepository } from '../../repositories.interfaces/car.repository.interface';
import ReserveRepositoryInMemory from '../../repositories.in.memory/reserve.repository.in.memory';
import UserRepositoryInMemory from '../../repositories.in.memory/user.repository.in.memory';
import CarRepositoryInMemory from '../../repositories.in.memory/car.repository.in.memory';
import ReserveService from '../../services/reserve.service';
import { IUser } from '../../interfaces/user.interface';
import { ICar } from '../../interfaces/car.interface';

let createReserveService: ReserveService;
let carsRepository: ICarRepository;
let usersRepository: IUserRepository;
let reservesRepository: IReserveRepository;

beforeEach(async () => {
    await carsRepository.clear();
    await usersRepository.clear();
    await reservesRepository.clear();
  });
  
beforeAll(() => {
  usersRepository = new UserRepositoryInMemory();
  reservesRepository = new ReserveRepositoryInMemory();
  carsRepository = new CarRepositoryInMemory();
  createReserveService = new ReserveService(reservesRepository, carsRepository, usersRepository);
});

describe('Reserve Service Integration Tests', () => {
  it('should be able to create a new reserve', async () => {
    const createUser: IUser = {
      name: 'Rafael teste',
      email: 'teste@gmail.com',
      birth: '01/01/2000',
      password: '123456',
      cpf: '035.024.950-41',
      qualified: 'sim',
      cep: '98801613',
    };

    const newUser = await usersRepository.createUser(createUser);

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

    const newCar = await carsRepository.createCar(carData);

    const createdReserve = await createReserveService.createReserve(
      newUser._id.valueOf().toString(),
      newCar._id.valueOf().toString(),
      "01/01/2022",
      "10/01/2022"
    );

    expect(createdReserve).toHaveProperty('_id');
    expect(createdReserve.id_user).toEqual(newUser._id.valueOf().toString());
  });

  it('should be able to find all reserves with pagination', async () => {
    const createUser: IUser = {
        name: 'Rafael teste',
        email: 'teste@gmail.com',
        birth: '01/01/2000',
        password: '123456',
        cpf: '035.024.950-41',
        qualified: 'sim',
        cep: '98801613',
      };
  
      const newUser = await usersRepository.createUser(createUser);
  
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
      
    const newCar = await carsRepository.createCar(carData);
    await createReserveService.createReserve(
        newUser._id.valueOf().toString(),
        newCar._id.valueOf().toString(),
        "01/01/2022",
        "10/01/2022");

    await createReserveService.createReserve(
        newUser._id.valueOf().toString(),
        newCar._id.valueOf().toString(),
        "01/02/2022",
        "10/02/2022");

    const filters = {};
    const { reserves, total } = await createReserveService.getAllReserves(filters, 10, 0);

    expect(reserves).toHaveLength(2);
    expect(total).toBe(2);
  });

  it('should be able to get a reserve by ID', async () => {

    const createUser: IUser = {
        name: 'Rafael teste',
        email: 'teste@gmail.com',
        birth: '01/01/2000',
        password: '123456',
        cpf: '035.024.950-41',
        qualified: 'sim',
        cep: '98801613',
      };
  
      const newUser = await usersRepository.createUser(createUser);
  
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
      
    const newCar = await carsRepository.createCar(carData);
    const createdReserve = await createReserveService.createReserve(
        newUser._id.valueOf().toString(),
        newCar._id.valueOf().toString(),
        "01/01/2022",
        "10/01/2022");


    const foundReserve = await createReserveService.getReserveById(createdReserve._id.valueOf().toString());

    expect(foundReserve).toBeDefined();
    expect(foundReserve?._id).toBe(createdReserve._id.valueOf().toString());
    expect(foundReserve?.id_user).toBe(createdReserve.id_user);
  });


});

