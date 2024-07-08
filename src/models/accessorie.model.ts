import { ObjectIdColumn, Column } from 'typeorm';
import { ObjectId } from 'mongodb';

export class Accessorie {
  @ObjectIdColumn()
  _id?: ObjectId;

  @Column()
  description: string;
  constructor(description: string) {
    if (!description) {
      throw new Error('Description is required for Accessorie.');
    }
    this.description = description;
    this._id = new ObjectId();
  }
}