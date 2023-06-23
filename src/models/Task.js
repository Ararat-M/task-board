import { BaseModel } from "./BaseModel";
import { addToStorage } from "../utils";

export class Task extends BaseModel {
  constructor(title, state, user_id, description = "") {
    super();
    this.title = title;
    this.state = state;
    this.executor_id = user_id;
    this.description = description;
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