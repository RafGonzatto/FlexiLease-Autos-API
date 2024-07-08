import { Reserve } from '../entities/reserve.entity';
import { Accessorie } from '../models/accessorie.model';
import { ObjectId } from 'mongodb';
export interface ICar {
  _id?: ObjectId;
  model: string;
  color: string;
  year: string;
  value_per_day: number;
  accessories: Accessorie[];
  number_of_passengers: number;
  reserves?: Reserve[];
}
