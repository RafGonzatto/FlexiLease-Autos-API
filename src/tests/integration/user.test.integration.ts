import 'reflect-metadata';
import { IReserveRepository } from '../../repositories.interfaces/reserve.repository.interface';
import { IUserRepository } from '../../repositories.interfaces/user.repository.interface';
import UserRepositoryInMemory from '../../repositories.in.memory/user.repository.in.memory';
import ReserveRepositoryInMemory from '../../repositories.in.memory/reserve.repository.in.memory';
import UserService from '../../services/user.service';
import { IUser } from '../../interfaces/user.interface';
import createError from 'http-errors';
import { v4 as uuidv4 } from 'uuid';

let createUserService: UserService;
let usersRepository: IUserRepository;
let reservesRepository: IReserveRepository;

beforeEach(async () => {
  await usersRepository.clear();
});

beforeAll(() => {
  usersRepository = new UserRepositoryInMemory();
  reservesRepository = new ReserveRepositoryInMemory();
  createUserService = new UserService(usersRepository, reservesRepository);
});

describe('User Service Integration Tests', () => {
  it('should be able to create a new user', async () => {
    const createUser: IUser = {
      name: 'Rafael teste',
      email: 'teste@gmail.com',
      birth: '01/01/2000',
      password: '123456',
      cpf: '035.024.950-41',
      qualified: 'sim',
      cep: '98801613',
    };
    try {
      const user = await createUserService.createUser(createUser);
      expect(user).toHaveProperty('_id');
      expect(user.name).toEqual(createUser.name);
      expect(user.email).toEqual(createUser.email);
    } catch (error) {
      console.error('Error handling creation of user:', error);
    }
  });

  it('should not be able to create a user with duplicate email', async () => {
    const createUser: IUser = {
      name: 'Rafael teste',
      email: 'teste@gmail.com',
      birth: '01/01/2000',
      password: '123456',
      cpf: '352.011.570-09',
      qualified: 'sim',
      cep: '98801613',
    };

    try {
      await createUserService.createUser(createUser);
      await createUserService.createUser(createUser);
    } catch (error) {
      expect(error).toBeInstanceOf(createError.HttpError);
      expect(error.status).toBe(409);
      expect(error.message).toBe('Email address is already registered');
    }
  });
  it('should not be able to update a non-existing user', async () => {
    const updatedUser: IUser = {
      _id: uuidv4(),
      name: 'Non-existing user',
      email: 'update@gmail.com',
      birth: '01/01/2000',
      password: '123456',
      cpf: '035.024.950-41',
      qualified: 'sim',
      cep: '98801613',
    };
    try {
      await createUserService.updateUser(updatedUser);
    } catch (error) {
      expect(error).toBeInstanceOf(createError.HttpError);
      expect(error.status).toBe(404);
      expect(error.message).toBe('User not found');
    }
  });
});

it('should be able to delete a user', async () => {
  const createUser: IUser = {
    name: 'Rafael teste',
    email: 'delete@gmail.com',
    birth: '01/01/2000',
    password: '123456',
    cpf: '311.624.600-91',
    qualified: 'sim',
    cep: '98801613',
  };

  const user = await createUserService.createUser(createUser);

  try {
    await createUserService.deleteUser(user._id.valueOf().toString());
  } catch (error) {
    fail('deleteUser threw an error: ' + error);
  }
});

it('should not be able to delete a non-existing user', async () => {
  try {
    await createUserService.deleteUser(uuidv4());
  } catch (error) {
    expect(error).toBeInstanceOf(createError.HttpError);
    expect(error.status).toBe(404);
    expect(error.message).toBe('User not found');
  }
});
