import { Entity, BaseEntity, Column, ObjectIdColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Car } from './car.entity'; 
import { User } from './user.entity';
import { IReserve } from '../interfaces/reserve.interface';
import { ObjectId } from 'mongodb'; 


@Entity({ name: 'Reserve' })
export class Reserve extends BaseEntity implements IReserve {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  start_date: string;

  @Column()
  end_date: string;

  @Column()
  id_user: string; 

  @ManyToOne(() => User, user => user.reserves, { eager: true }) 
  @JoinColumn({ name: 'id_user', referencedColumnName: '_id' }) 
  user: User;

  @Column()
  id_car: string; 

  @ManyToOne(() => Car, car => car.reserves, { eager: true }) 
  @JoinColumn({ name: 'id_car', referencedColumnName: '_id' }) 
  car: Car;
  
  @Column()
  final_value: string; 
}
