import { filteredUserTaskList } from "../utils"
import { filteredTaskList } from "../utils"
import { findUserOfId } from "../utils"
import { appState } from "../app";

export function updateAllTaskList(readyList, inProgressList, finishedList) {
  let list;

  if (appState.currentUser.hasAdmin) {
    list = filteredTaskList();
  } else {
    list = filteredUserTaskList(appState.currentUser);
  }

  clearList(readyList);
  clearList(inProgressList);
  clearList(finishedList);
  
  list.taskListReady.forEach((item) => {
    const taskItem = createTaskElement(item);
    readyList.appendChild(taskItem);
  })

  list.taskListInProgress.forEach((item) => {
    const taskItem = createTaskElement(item);
    inProgressList.appendChild(taskItem);
  })

  list.taskListFinished.forEach((item) => {
    const taskItem = createTaskElement(item);
    finishedList.appendChild(taskItem);
  })
}

function clearList(list) {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
}

function createTaskElement(task) {
  const taskItem = document.createElement("li");
  const taskTitle = document.createElement("span");
  
  taskItem.classList.add("task-item");
  taskTitle.classList.add("task-item__title")

  taskTitle.textContent = task.title;

  taskItem.appendChild(taskTitle);

  if (appState.currentUser.hasAdmin) {
    const taskExecutor = document.createElement("span");

    taskExecutor.classList.add("task-item__task-executor")
    taskExecutor.textContent = findUserOfId(task.executor_id).login;

    taskItem.appendChild(taskExecutor);
  }

  taskItem.addEventListener("click", () => {
    document.querySelector(".task-info__title").textContent = task.title;
    document.querySelector(".task-info__description").textContent = task.description;
    document.querySelector(".task-info").classList.add("task-info_active");
  })

  return taskItem
}