import { filteredTaskList } from "../utils"
import { clearNode, calculateTask } from "../utils";
import { appState } from "../app";
import { createTaskElement } from "./createTaskElement";

export function updateAllTaskList() {
  const readyList = document.querySelector(".task-list__ready");
  const inProgressList = document.querySelector(".task-list__in-progress");
  const finishedList = document.querySelector(".task-list__finished");

  let list;

  if (appState.currentUser.hasAdmin) {
    list = filteredTaskList();
  } else {
    list = filteredTaskList(appState.currentUser);
  }

  clearNode(readyList);
  clearNode(inProgressList);
  clearNode(finishedList);
  
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

  const taskModalWindowList = document.querySelectorAll(".task-info")
  
  taskModalWindowList.forEach((item) => {
    document.querySelector(".kanban__content").appendChild(item)
  })

  calculateTask()
}