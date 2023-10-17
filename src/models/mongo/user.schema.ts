import { Schema, model, Model } from 'mongoose';
import { IUserMongo } from '../../types/user.type';

const userSchema: Schema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    createdAt: { type: Number },
    updatedAt: { type: Number }
  },
  { collection: 'users', autoCreate: true }
);

const userSchemaModel: Model<IUserMongo> = model<IUserMongo>('users', userSchema);

export default userSchemaModel;
