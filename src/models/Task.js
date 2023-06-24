import { BaseModel } from "./BaseModel";
import { addToStorage } from "../utils";
import { deleteInStorage, getFromStorage } from "../utils";

export class Task extends BaseModel {
  constructor(title, state, user_id, description = "description") {
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

  static delete(task) {
    try {
      deleteInStorage(task, task.storageKey);
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  static change(task) {
    try {
      const taskList = getFromStorage("tasks");

      const newTaskList = [];

      for (let i = 0; i < taskList.length; i++) {
        const currentTask = taskList[i];

        if (currentTask.id == task.id) {
          newTaskList.push(task)
          continue
        }

        newTaskList.push(currentTask);
      }

      localStorage.setItem('tasks', JSON.stringify(newTaskList));

      return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  static changeStateOfId(task_id, newState) {
    const taskList = getFromStorage("tasks");
  
    const newTaskList = [];
  
    for (let i = 0; i < taskList.length; i++) {
      const currentTask = taskList[i];
  
      if (currentTask.id == task_id) {
        currentTask.state = newState;
      }
  
      newTaskList.push(currentTask);
    }
  
    localStorage.setItem('tasks', JSON.stringify(newTaskList));
  }
}