import { BaseModel } from "./BaseModel";
import { getFromStorage, addToStorage } from "../utils";
import { appState } from "../app";

export class User extends BaseModel {
  constructor(login, password) {
    super();
    this.login = login;
    this.password = password;
    this.storageKey = "users";
  }
  get hasAccess() {
    let users = getFromStorage(this.storageKey);
    console.log(users);
    console.log(users.length);
    if (users.length == 0) return false;
    for (let user of users) {
      if (user.login == this.login && user.password == this.password) {
        appState.currentUser = user;
        return true;
      }
    }
    return false;
  }
  static save(user) {
    try {
      addToStorage(user, user.storageKey);
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }
}
