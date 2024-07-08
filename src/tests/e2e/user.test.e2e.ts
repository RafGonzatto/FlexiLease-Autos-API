import 'reflect-metadata';
import request from 'supertest';
import '../../container';
import { container } from 'tsyringe';
import UserService from '../../services/user.service';
import AppDataSource from '../../database/connection';
import { IUser } from '../../interfaces/user.interface';
import createError from 'http-errors';
import { HttpStatusCode } from 'axios';

const baseUrl = 'http://localhost:3000';

beforeAll(async () => {
  await AppDataSource.initialize();
});

afterEach(async () => {
  await AppDataSource.dropDatabase();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = container.resolve(UserService);
  });

  describe('Create User', () => {
    it('should be possible to create a new user', async () => {
      const createUser: IUser = {
        name: 'John Doe',
        email: 'teste2@gmail.com',
        birth: '01/01/2000',
        cpf: '035.024.950-41',
        cep: '98801613',
        qualified: 'sim',
        password: '123456',
      };

      const response = await request(baseUrl)
        .post('/api/v1/user')
        .send(createUser);

      expect(response.status).toBe(HttpStatusCode.Ok);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe(createUser.name);
      expect(response.body.email).toBe(createUser.email);
    });

    it('should return an error if email is already registered', async () => {
      const createUser: IUser = {
        name: 'John',
        email: 'teste2@gmail.com',
        birth: '01/01/2000',
        cpf: '752.284.130-57',
        cep: '98801613',
        qualified: 'sim',
        password: '123456',
      };

      await request(baseUrl).post('/api/v1/user').send(createUser);

      try {
        await request(baseUrl).post('/api/v1/user').send(createUser);
      } catch (error) {
        expect(error.status).toBe(400);
        expect(error).toBeInstanceOf(createError.HttpError);
        expect(error.message).toBe('Email address is already registered');
      }
    });

    it('should return an error if email is invalid', async () => {
      const createUser: IUser = {
        name: 'John',
        email: 'testegmail.com',
        birth: '01/01/2000',
        cpf: '318.002.580-89',
        cep: '98801613',
        qualified: 'sim',
        password: '123456',
      };

      try {
        await request(baseUrl).post('/api/v1/user').send(createUser);
      } catch (error) {
        expect(error).toBeInstanceOf(createError.HttpError);
        expect(error.status).toBe(400);
        expect(error.message).toBe('Invalid email address');
      }
    });

    it('should return an error if name and email are null', async () => {
      const createUser: IUser = {
        name: '',
        email: '',
        birth: '01/01/2000',
        cpf: '318.002.580-89',
        cep: '98801613',
        qualified: 'sim',
        password: '123456',
      };

      try {
        await request(baseUrl).post('/api/v1/user').send(createUser);
      } catch (error) {
        expect(error).toBeInstanceOf(createError.HttpError);
        expect(error.status).toBe(400);
      }
    });
  });

  describe('Get User By ID', () => {
    it('should be possible to get a user by ID', async () => {
      const createUser: IUser = {
        name: 'John Doe',
        email: 'test@gmail.com',
        birth: '01/01/2000',
        cpf: '035.024.950-41',
        cep: '98801613',
        qualified: 'sim',
        password: '123456',
      };

      const createdUser = await userService.createUser(createUser);

      const response = await request(baseUrl).get(
        `/api/v1/user/${createdUser._id.valueOf()}`,
      );

      expect(response.status).toBe(HttpStatusCode.Ok);
      expect(response.body).toMatchObject(createUser);
    });

    it('should return an error if user ID does not exist', async () => {
      const userId = '123456789012345678901234';

      try {
        await request(baseUrl).get(`/api/v1/user/${userId}`);
      } catch (error) {
        expect(error.status).toBe(404);
        expect(error).toBeInstanceOf(createError.HttpError);
        expect(error.message).toBe('User not found');
      }
    });
  });

  describe('Update User', () => {
    it('should be possible to update a user', async () => {
      const createUser: IUser = {
        name: 'John Doe',
        email: 'test@gmail.com',
        birth: '01/01/2000',
        cpf: '035.024.950-41',
        cep: '98801613',
        qualified: 'sim',
        password: '123456',
      };

      const createdUser = await userService.createUser(createUser);

      const updatedUserData: IUser = {
        name: 'Updated Name',
        email: 'updatedemail@gmail.com',
        birth: '01/01/2000',
        cpf: '035.024.950-41',
        cep: '98801613',
        qualified: 'sim',
        password: '123456',
      };
      const response = await request(baseUrl)
        .put(`/api/v1/user/${createdUser._id.valueOf()}`)
        .send(updatedUserData);

      expect(response.status).toBe(HttpStatusCode.Ok);
      expect(response.body).toMatchObject(updatedUserData);
    });

    it('should return an error if user ID does not exist', async () => {
      const updatedUserData = {
        name: 'Updated Name',
        email: 'updatedemail@gmail.com',
        birth: '01/01/2000',
        cpf: '035.024.950-41',
        cep: '98801613',
        qualified: 'sim',
        password: '123456',
      };

      try {
        await request(baseUrl)
          .put('/api/v1/user/123456789012345678901234')
          .send(updatedUserData);
      } catch (error) {
        expect(error.status).toBe(404);
        expect(error).toBeInstanceOf(createError.HttpError);
        expect(error.message).toBe('User not found');
      }
    });
  });

  describe('Delete User', () => {
    it('should be possible to delete a user', async () => {
      const createUser: IUser = {
        name: 'John Doe',
        email: 'test@gmail.com',
        birth: '01/01/2000',
        cpf: '035.024.950-41',
        cep: '98801613',
        qualified: 'sim',
        password: '123456',
      };

      const createdUser = await userService.createUser(createUser);

      const response = await request(baseUrl).delete(
        `/api/v1/user/${createdUser._id.valueOf()}`,
      );
      expect(response.body.message).toBe('User deleted successfully');
    });

    it('should return an error if user ID does not exist', async () => {
      const userId = '123456789012345678901234';

      try {
        await request(baseUrl).delete(`/api/v1/user/${userId}`);
      } catch (error) {
        expect(error.status).toBe(404);
        expect(error).toBeInstanceOf(createError.HttpError);
        expect(error.message).toBe('User not found');
      }
    });
  });

  describe('Authenticate User', () => {
    it('should be possible to authenticate a user', async () => {
      const createUser: IUser = {
        name: 'John Doe',
        email: 'test@gmail.com',
        birth: '01/01/2000',
        cpf: '035.024.950-41',
        cep: '98801613',
        qualified: 'sim',
        password: '123456',
      };

      await userService.createUser(createUser);
      const response = await request(baseUrl)
        .post('/api/v1/authenticate')
        .send({
          email: createUser.email,
          password: createUser.password,
        });
      expect(response.status).toBe(HttpStatusCode.Ok);
      expect(response.body).toHaveProperty('token');
    });

    it('should return an error if email and password are incorrect', async () => {
      const createUser: IUser = {
        name: 'John Doe',
        email: 'test@gmail.com',
        birth: '01/01/2000',
        cpf: '035.024.950-41',
        cep: '98801613',
        qualified: 'sim',
        password: '123456',
      };

      await userService.createUser(createUser);

      try {
        await request(baseUrl).post('/api/v1/user/authenticate').send({
          email: createUser.email,
          password: 'incorrectpassword',
        });
      } catch (error) {
        expect(error.status).toBe(404);
        expect(error).toBeInstanceOf(createError.HttpError);
        expect(error.message).toBe('Email and Password not found');
      }
    });
  });

  describe('Get All Users', () => {
    it('should be possible to get all users with pagination', async () => {
      const createUser1: IUser = {
        name: 'User 1',
        email: 'user1@gmail.com',
        birth: '01/01/2000',
        cpf: '035.024.950-41',
        cep: '98801613',
        qualified: 'sim',
        password: '123456',
      };

      const createUser2: IUser = {
        name: 'User 2',
        email: 'user2@gmail.com',
        birth: '01/01/2000',
        cpf: '707.404.650-74',
        cep: '98801613',
        qualified: 'nao',
        password: '123456',
      };

      await userService.createUser(createUser1);
      await userService.createUser(createUser2);

      const response = await request(baseUrl)
        .get('/api/v1/users')
        .query({ limit: 10, offset: 0 });
      expect(response.status).toBe(HttpStatusCode.Ok);
      expect(response.body.users.length).toBe(2);
      expect(response.body.total).toBe(2);
    });

    it('should return an empty array if no users match the criteria', async () => {
      const response = await request(baseUrl)
        .get('/api/v1/users')
        .query({ name: 'Non Existing User' });

      expect(response.status).toBe(HttpStatusCode.Ok);
      expect(response.body.users.length).toBe(0);
      expect(response.body.total).toBe(0);
    });
  });
});
