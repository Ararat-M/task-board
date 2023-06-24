import { appState } from "../app";
import { clearNode, getFromStorage } from "../utils";


export function updateAllListSelect() {
  const tasks = getFromStorage("tasks");

  const taskReadyListSelect = document.querySelector("#task-ready-list-select");
  const taskInProgressListSelect = document.querySelector("#task-in-progress-list-select");
  
  clearNode(taskReadyListSelect);
  clearNode(taskInProgressListSelect);

  tasks.forEach((item) => {
    if (item.executor_id == appState.currentUser.id || appState.currentUser.hasAdmin) {
      if (item.state == "ready") {
        const task = document.createElement("option");

        task.textContent = item.title;
        task.value = item.id;

        taskReadyListSelect.appendChild(task)
      }
      
      if (item.state == "in-progress") {
        const task = document.createElement("option");

        task.textContent = item.title;
        task.value = item.id;

        taskInProgressListSelect.appendChild(task);
      }
    }
  })

  return [taskReadyListSelect, taskInProgressListSelect]
}