import { Document } from 'mongoose';

export type IUserGoogle = {
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
};

export interface IUserMongo extends Document {
  _id: string;
  email: string;
  username: string;
  password: string;
  createdAt: number;
  updatedAt: number;
}

export interface IUser {
  _id: string;
  email: string;
  username: string;
  token: string;
}
