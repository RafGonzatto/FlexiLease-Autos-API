import { Accessorie } from './accessorie.model';

export interface GetAllCarsParams {
  model?: string;
  color?: string;
  year?: string;
  value_per_day?: number;
  email?: string;
  accessories?: Accessorie[];
  number_of_passengers?: number;
  limit?: number;
  offset?: number;
}
