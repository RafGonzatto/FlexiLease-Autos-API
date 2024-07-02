import { DataSource } from 'typeorm'
import dotenv from 'dotenv'
import path from 'path'
import { Car } from '../entities/car.entity'
import { Reserve } from '../entities/reserve.entity'
import { User } from '../entities/user.entity'

dotenv.config()

const { MONGODB_URI , MONGODB_DB} = process.env

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI must be defined in the environment variables')
}
const srcDir = path.resolve(__dirname, '..', '..', 'src')

const AppDataSource = new DataSource({
  type: 'mongodb',
  url: MONGODB_URI,
  database: MONGODB_DB,
  synchronize: false,
  logging: true,
  entities: [User, Reserve, Car],
  migrations: ['dist/src/database/migrations/*.js'],
})

export default AppDataSource
