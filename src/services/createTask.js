import { Task } from "../models/Task";

export function createTask(title, state, user_id) {
  const task = new Task(title, state, user_id);
  Task.save(task);
}