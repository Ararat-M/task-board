import { User } from "./User"

export class Admin extends User {
  constructor(login, password) {
    super(login, password);
    this.hasAdmin = true;
  }
}