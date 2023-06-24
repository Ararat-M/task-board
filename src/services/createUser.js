import { User } from "../models/User";

export function createUser(login, password) { 
  login = login.trim();
  password = password.trim();

  try {
    if (!login || !password) {
      throw new Error("Пожалуйста, введите логин и пароль");
    }

    if (password.includes(" ")) {
      throw new Error("Пароль не может содержать пробелы");
    }  

    const user = new User(login, password);
    User.save(user, user.storageKey)
  } catch (error) {
    console.error(error.message);
    return false
  }

  return true
};