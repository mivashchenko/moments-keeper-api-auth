import repo from './../dal/mongo/user.dal';

class User {
  private readonly repo;

  constructor() {
    this.repo = repo;
  }

  async findByEmail(email: string) {
    return this.repo.findByEmail(email);
  }

  async findById(email: string) {
    return this.repo.findById(email);
  }

  async create(email: string, username: string, password: string) {
    const user = await this.repo.findByEmail(email);

    if (user) {
      return user;
    }

    return this.repo.create(email, username, password);
  }

  async createOrUpdate(email: string, username: string, password: string) {
    const user = await this.repo.findByEmail(email);

    if (user) {
      return this.repo.update(user, email, username, password);
    }

    return this.repo.create(email, username, password);
  }
}

export default new User();
