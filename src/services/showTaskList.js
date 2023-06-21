import { filteredUserTaskList } from "../utils"
import { filteredTaskList } from "../utils"
import { findUserOfId } from "../utils"

export function showTaskList(user, readyList, inProgressList, finishedList) {
  let list;

  if (user.hasAdmin) {
    list = filteredTaskList();
  } else {
    list = filteredUserTaskList(user);
  }
  
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

function createTaskElement(task) {
  const taskItem = document.createElement("li");
  const taskTitle = document.createElement("span");
  const taskExecutor = document.createElement("span");
  
  taskItem.classList.add("task-item");
  taskTitle.classList.add("task-item__title")
  taskExecutor.classList.add("task-item__task-executor")

  taskTitle.textContent = task.title;
  taskExecutor.textContent = findUserOfId(task.executor_id).login;

  taskItem.appendChild(taskTitle);
  taskItem.appendChild(taskExecutor);

  return taskItem
}