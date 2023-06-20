import { User } from "../models/User";
import { addToStorage } from "../utils"; 

export const authUser = function (login, password) {
  const user = new User(login, password);
  if (!user.hasAccess) return false;
  return true;
};
