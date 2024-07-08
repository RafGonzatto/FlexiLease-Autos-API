import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';
import { Car } from '../entities/car.entity';
import { Reserve } from '../entities/reserve.entity';
import { User } from '../entities/user.entity';

dotenv.config();

const { MONGODB_URI, MONGODB_DB, MONGODB_TEST_DB, NODE_ENV } = process.env;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI must be defined in the environment variables');
}

let databaseName = MONGODB_DB;

if (NODE_ENV === 'test' && MONGODB_TEST_DB) {
  databaseName = MONGODB_TEST_DB;
}

const AppDataSource = new DataSource({
  type: 'mongodb',
  url: MONGODB_URI,
  database: databaseName,
  synchronize: false,
  logging: false,
  entities: [User, Reserve, Car],
});

export default AppDataSource;
