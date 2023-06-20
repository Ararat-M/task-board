import { User } from "../models/User";

export function addUser(login, password) {
  const user = new User(login, password);
  
};