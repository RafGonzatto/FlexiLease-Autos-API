
import { ObjectId } from 'mongodb'; 
export interface IUser {
    _id?: ObjectId;
    name: string
    cpf: string
    birth: string
    email: string
    password: string,
    cep: string,
    qualified: string
    patio?: string
    complement?: string
    neighborhood?: string
    locality?: string
    uf?: string
  }
  