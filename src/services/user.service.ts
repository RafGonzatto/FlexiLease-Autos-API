import { DeleteResult, FindManyOptions, Like, Not } from 'typeorm';
import { IUser } from '../interfaces/user.interface';
import { IUserRepository } from '../repositories.interfaces/user.repository.interface';
import { IReserveRepository } from '../repositories.interfaces/reserve.repository.interface';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { inject, injectable } from 'tsyringe';
import { User } from '../entities/user.entity';
import { GetAllUsersParams } from '../models/getAllUsersParams.model';
import { ObjectId } from 'mongodb';

@injectable()
class UserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('ReserveRepository')
    private reserveRepository: IReserveRepository,
  ) {}

  async createUser(userData: IUser): Promise<IUser> {
    const emailConditions: any = { email: userData.email };
    const existingUser =
      await this.userRepository.findOneByConditions(emailConditions);
    if (existingUser) {
      throw new createError.Conflict('Email address is already registered');
    }
    const cpfConditions: any = { cpf: userData.cpf };
    const existingCPF =
      await this.userRepository.findOneByConditions(cpfConditions);
    if (existingCPF) {
      throw new createError.Conflict('CPF is already registered');
    }
    const isValidCPF = await this.isValidCPF(userData.cpf);
    if (!isValidCPF) {
      throw new createError.BadRequest('Invalid CPF');
    }
    const viaCepUrl = `https://viacep.com.br/ws/${userData.cep}/json/`;
    const response = await axios.get(viaCepUrl);

    if (response.status !== 200) {
      throw new createError.NotFound(
        'Failed to fetch address information from ViaCEP',
      );
    }

    const { data } = response;

    userData.patio = data.logradouro;
    userData.complement = data.complemento;
    userData.neighborhood = data.bairro;
    userData.locality = data.localidade;
    userData.uf = data.uf;

    const userResult = await this.userRepository.createUser(userData);
    return userResult;
  }
  async getUserById(id: string): Promise<IUser | null> {
    const userResult = await this.userRepository.getUserById(id);
    return userResult;
  }
  async updateUser(userData: IUser): Promise<IUser> {
    const existingUser = await this.userRepository.getUserById(
      userData._id.toString(),
    );
    if (!existingUser) {
      throw new createError.NotFound('User not found');
    }

    const emailConditions: any = { email: userData.email };
    if (userData._id) {
      emailConditions._id = { $ne: new ObjectId(userData._id) };
    }
    const existingEmail =
      await this.userRepository.findOneByConditions(emailConditions);
    if (existingEmail) {
      throw new createError.Conflict('Email address is already registered');
    }

    const cpfConditions: any = { cpf: userData.cpf };
    if (userData._id) {
      cpfConditions._id = { $ne: new ObjectId(userData._id) };
    }
    const existingCPF =
      await this.userRepository.findOneByConditions(cpfConditions);
    if (existingCPF) {
      throw new createError.Conflict('CPF is already registered');
    }
    const isValidCPF = await this.isValidCPF(userData.cpf);
    if (!isValidCPF) {
      throw new createError.BadRequest('Invalid CPF');
    }
    const viaCepUrl = `https://viacep.com.br/ws/${userData.cep}/json/`;
    const response = await axios.get(viaCepUrl);

    if (response.status !== 200) {
      throw new createError.NotFound(
        'Failed to fetch address information from ViaCEP',
      );
    }

    const { data } = response;

    userData.patio = data.logradouro;
    userData.complement = data.complemento;
    userData.neighborhood = data.bairro;
    userData.locality = data.localidade;
    userData.uf = data.uf;

    Object.assign(existingUser, userData);

    const userResult = await this.userRepository.updateUser(userData);
    return userResult;
  }
  async authenticateUser(
    email: string,
    password: string,
  ): Promise<string | null> {
    const user = await this.userRepository.findByEmailAndPassword(
      email,
      password,
    );
    if (!user) {
      throw new createError.NotFound('Email and Password not found');
    }
    const SECRET_KEY = process.env.JWT_SECRET;
    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, {
      expiresIn: '12h',
    });
    return token;
  }
  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new createError.NotFound('User not found');
    }
    const reserves = await this.reserveRepository.getReservesByUserId(id);
    if (reserves) {
      reserves.forEach(async (reserve) => {
        await this.reserveRepository.deleteReserve(reserve._id.toString());
      });
    }
    await this.userRepository.deleteUser(id);
  }
  async getAllUsers(
    params: GetAllUsersParams,
  ): Promise<{
    users: IUser[];
    total: number;
    limit: number;
    offset: number;
    offsets: number;
  }> {
    const {
      name,
      cpf,
      birth,
      email,
      cep,
      qualified,
      patio,
      complement,
      neighborhood,
      locality,
      uf,
      limit,
      offset,
    } = params;
    const whereConditions: Record<string, any> = {};

    if (name) whereConditions.name = { $regex: `.*${name}.*`, $options: 'i' };
    if (cpf) whereConditions.cpf = { $regex: `.*${cpf}.*`, $options: 'i' };
    if (birth)
      whereConditions.birth = { $regex: `.*${birth}.*`, $options: 'i' };
    if (email)
      whereConditions.email = { $regex: `.*${email}.*`, $options: 'i' };
    if (cep) whereConditions.cep = { $regex: `.*${cep}.*`, $options: 'i' };
    if (qualified)
      whereConditions.qualified = { $regex: `.*${qualified}.*`, $options: 'i' };
    if (patio)
      whereConditions.patio = { $regex: `.*${patio}.*`, $options: 'i' };
    if (complement)
      whereConditions.complement = {
        $regex: `.*${complement}.*`,
        $options: 'i',
      };
    if (neighborhood)
      whereConditions.neighborhood = {
        $regex: `.*${neighborhood}.*`,
        $options: 'i',
      };
    if (locality)
      whereConditions.locality = { $regex: `.*${locality}.*`, $options: 'i' };
    if (uf) whereConditions.uf = { $regex: `.*${uf}.*`, $options: 'i' };

    const options: FindManyOptions<User> = {
      where: { ...whereConditions },
      take: limit,
      skip: offset,
    };

    const { users, total } =
      await this.userRepository.findAllWithPagination(options);

    const offsets = Math.ceil(total / limit);

    return { users, total, limit, offset, offsets };
  }
  async isValidCPF(cpf: string): Promise<boolean> {
    cpf = cpf.replace(/[^\d]+/g, '');

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false;
    }

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }

    if (remainder !== parseInt(cpf.substring(9, 10))) {
      return false;
    }

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }

    return remainder === parseInt(cpf.substring(10, 11));
  }
}

export default UserService;
