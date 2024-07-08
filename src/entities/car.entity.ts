import {
  Entity,
  BaseEntity,
  Column,
  ObjectIdColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { ICar } from '../interfaces/car.interface';
import { Reserve } from './reserve.entity';
import { ObjectId } from 'mongodb';

@Entity({ name: 'Car' })
export class Car extends BaseEntity implements ICar {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  model: string;

  @Column()
  color: string;

  @Column()
  year: string;

  @Column()
  value_per_day: number;

  @Column()
  number_of_passengers: number;

  @Column({ type: 'json' })
  accessories: Accessorie[];

  @OneToMany(() => Reserve, (reserve) => reserve.car)
  reserves: Reserve[];

  constructor() {
    super();
    this.accessories = [];
  }
}

export class Accessorie {
  _id: ObjectId;
  description: string;

  constructor(description: string) {
    this.description = description;
    this._id = new ObjectId();
  }
}
