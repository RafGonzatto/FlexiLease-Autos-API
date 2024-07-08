import { container } from 'tsyringe'
import { IReserveRepository } from './repositories.interfaces/reserve.repository.interface'
import ReserveRepository from './repositories/reserve.repository'
import { ICarRepository } from './repositories.interfaces/car.repository.interface'
import CarRepository from './repositories/car.repository'
import { IUserRepository } from './repositories.interfaces/user.repository.interface'
import UserRepository from './repositories/user.repository'

container.registerSingleton<IReserveRepository>(
  'ReserveRepository',
  ReserveRepository,
)

container.registerSingleton<ICarRepository>(
  'CarRepository',
  CarRepository,
)
container.registerSingleton<IUserRepository>(
  'UserRepository',
  UserRepository,
)
