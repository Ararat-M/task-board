import { Task } from "../models/Task";

export function createTask(title, state, user_id) {
  title = title.trim();

  try {
    if (!title) {
      throw new Error("Пожалуйста, введите заголовок задачи");
    }
  } catch (error) {
    console.error(error.message);
    return false
  }
  
  const task = new Task(title, state, user_id);
  Task.save(task);

  return task;
}