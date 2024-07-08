import { ObjectId } from 'mongodb'; 
export interface IReserve {
    _id?: ObjectId
    start_date: string
    end_date: string
    id_user: string
    id_car: string
    final_value?: string
  }
  