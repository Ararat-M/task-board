import { User } from "../models/User";

export function createUser(login, password) {
  const user = new User(login, password);
  User.save(user, user.storageKey)
};