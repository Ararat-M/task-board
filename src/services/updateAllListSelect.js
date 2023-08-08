import { appState } from "../app";
import { clearNode, getFromStorage } from "../utils";


export function updateAllListSelect() {
  const tasks = getFromStorage("tasks");

  const taskReadyListSelect = document.querySelector("#task-ready-list-select");
  const taskInProgressListSelect = document.querySelector("#task-in-progress-list-select");
  const userListSelect = document.querySelector("#user-list");
  
  const users = getFromStorage("users").filter((item) => !item.hasAdmin)

  clearNode(userListSelect);
  clearNode(taskReadyListSelect);
  clearNode(taskInProgressListSelect);

  users.forEach((item) => {
    const user = document.createElement("option");
    
    user.textContent = item.login;
    user.value = item.id;
    
    userListSelect.appendChild(user)
  })

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

  return [userListSelect, taskReadyListSelect, taskInProgressListSelect]
}