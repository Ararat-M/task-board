import { BaseModel } from "./BaseModel";
import { addToStorage } from "../utils";

export class Task extends BaseModel {
  constructor(title, state, user_id) {
    super();
    this.title = title;
    this.state = state;
    this.user_id = user_id;
    this.storageKey = "tasks";
  }

  static save(task) {
    try {
      addToStorage(task, task.storageKey);
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }
}