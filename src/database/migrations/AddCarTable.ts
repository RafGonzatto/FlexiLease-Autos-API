import { MigrationInterface } from 'typeorm';
import { MongoQueryRunner } from 'typeorm/driver/mongodb/MongoQueryRunner';
import { Car } from '../../entities/car.entity';
import AppDataSource from '../connection'; 

export class AddCarTable1625071603720 implements MigrationInterface {
  public async up(queryRunner: MongoQueryRunner): Promise<void> {
    const mongoRunner = queryRunner as MongoQueryRunner;

    const database = AppDataSource.options.database as string; 

    await mongoRunner
      .databaseConnection
      .db(database)
      .createCollection(Car.name); 

    const carRepository = mongoRunner.connection.getMongoRepository(Car);
    await carRepository.createCollectionIndex({ _id: 1 });
  }

  public async down(queryRunner: MongoQueryRunner): Promise<void> {
    const mongoRunner = queryRunner as MongoQueryRunner;

    const database = AppDataSource.options.database as string; 

    await mongoRunner
      .databaseConnection
      .db(database)
      .dropCollection(Car.name); 
  }
}
