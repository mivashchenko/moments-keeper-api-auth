import repo from './../dal/mongo/user.dal';

class User {
  private readonly repo;

  constructor() {
    this.repo = repo;
  }

  async findByEmail(email: string) {
    return this.repo.findByEmail(email);
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
      const user2 = this.repo.update(user, email, username, password);
      return user2;
    }

    return this.repo.create(email, username, password);
  }
}

export default new User();
