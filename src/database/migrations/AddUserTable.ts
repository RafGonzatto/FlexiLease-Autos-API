import { MigrationInterface } from 'typeorm';
import { MongoQueryRunner } from 'typeorm/driver/mongodb/MongoQueryRunner';
import { User } from '../../entities/user.entity';
import AppDataSource from '../connection'; 

export class AddUserTable1625071603720 implements MigrationInterface {
  public async up(queryRunner: MongoQueryRunner): Promise<void> {
    const mongoRunner = queryRunner as MongoQueryRunner;

    const database = AppDataSource.options.database as string; 

    await mongoRunner
      .databaseConnection
      .db(database)
      .createCollection(User.name); 

    const userRepository = mongoRunner.connection.getMongoRepository(User);
    await userRepository.createCollectionIndex({ _id: 1 });
  }

  public async down(queryRunner: MongoQueryRunner): Promise<void> {
    const mongoRunner = queryRunner as MongoQueryRunner;

    const database = AppDataSource.options.database as string; 

    await mongoRunner
      .databaseConnection
      .db(database)
      .dropCollection(User.name); 
  }
}
