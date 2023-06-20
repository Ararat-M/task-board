import { User } from "./User"

export class Admin extends User {
  constructor(login, password) {
    super(login, password);
    this.hasAdmin = true;
  }

  createUser(login, password) {
    const user = new User(login, password);
    user.creator = this.id;
    User.save(user)
  }
}