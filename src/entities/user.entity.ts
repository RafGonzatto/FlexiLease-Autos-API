import { Entity, BaseEntity, Column, ObjectIdColumn, OneToOne  } from 'typeorm';
import { IUser } from '../interfaces/user.interface';
import { Reserve } from './reserve.entity';
import { ObjectId } from 'mongodb'; 

@Entity({ name: 'User' })
export class User extends BaseEntity implements IUser {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column()
  cpf: string;

  @Column()
  birth: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  cep: string;

  @Column()
  qualified: string;

  @Column()
  patio: string;

  @Column()
  complement: string;

  @Column()
  neighborhood: string;

  @Column()
  locality: string;

  @Column()
  uf: string;

  @OneToOne(() => Reserve, reserve => reserve.user)
  reserves: Reserve[];
}