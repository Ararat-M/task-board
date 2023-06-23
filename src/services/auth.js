import { User } from "../models/User";
import { appState } from "../app";

export const authUser = function (login, password) {
  const user = new User(login, password);

  if (!user.hasAccess) {
    appState.auth = false;
    return appState.auth;
  }

  appState.auth = true;
  return appState.auth;
};
