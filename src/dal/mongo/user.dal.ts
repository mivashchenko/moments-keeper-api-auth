import userSchemaModel from '../../models/mongo/user.schema';
import { IUserMongo } from '../../types/user.type';

class UserDal {
  async findByEmail(email: string) {
    return userSchemaModel.findOne({ email: email });
  }

  async create(email: string, username: string, password: string) {
    const user = new userSchemaModel({ email, username, password });
    return user.save();
  }

  async update(user: IUserMongo, email: string, username: string, password: string) {
    return user.updateOne(
      { email, username, password },
      {
        new: true
      }
    );
  }
}

export default new UserDal();
