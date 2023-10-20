import UserSchemaModel from '../../models/mongo/user.schema';
import { IUserMongo } from '../../types/user.type';

class UserDal {
  async findByEmail(email: string) {
    return UserSchemaModel.findOne({ email: email });
  }

  async findById(id: string) {
    return UserSchemaModel.findOne({ _id: id });
  }

  async create(email: string, username: string, password: string) {
    const user = new UserSchemaModel({ email, username, password });
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
