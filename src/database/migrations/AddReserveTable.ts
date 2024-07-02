import { MigrationInterface } from 'typeorm';
import { MongoQueryRunner } from 'typeorm/driver/mongodb/MongoQueryRunner';
import { Reserve } from '../../entities/reserve.entity';
import AppDataSource from '../connection'; 

export class AddReserveTable1625071603720 implements MigrationInterface {
  public async up(queryRunner: MongoQueryRunner): Promise<void> {
    const mongoRunner = queryRunner as MongoQueryRunner;

    const database = AppDataSource.options.database as string; 

    await mongoRunner
      .databaseConnection
      .db(database)
      .createCollection(Reserve.name); 

    const reserveRepository = mongoRunner.connection.getMongoRepository(Reserve);
    await reserveRepository.createCollectionIndex({ _id: 1 });
  }

  public async down(queryRunner: MongoQueryRunner): Promise<void> {
    const mongoRunner = queryRunner as MongoQueryRunner;

    const database = AppDataSource.options.database as string; 

    await mongoRunner
      .databaseConnection
      .db(database)
      .dropCollection(Reserve.name); 
  }
}
