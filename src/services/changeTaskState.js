import { getFromStorage } from "../utils";

export function changeTaskState(task_id, newState) {
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