export class State {
  constructor() {
    this.currentUser = null;
    this.auth = false;
  }
  set currentUser(user) {
    this._currentUser = user;
  }
  get currentUser() {
    return this._currentUser;
  }
}
