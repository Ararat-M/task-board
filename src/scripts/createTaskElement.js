import { appState } from "../app";
import { findOfId, calculateTask } from "../utils"
import { Task } from "../models/Task";
import { createTaskModalWindow } from "./createTaskModalWindow"
import { updateAllListSelect } from "./updateAllListSelect";

export function createTaskElement(task) {
  const taskInfo = createTaskModalWindow(task);

  const taskItem = document.createElement("li");
  const taskContent = document.createElement("div");
  const taskTitle = document.createElement("span");
  const taskDeleteBtn = document.createElement("button");
  
  taskItem.classList.add("task-item");
  taskContent.classList.add("task-item__content");
  taskTitle.classList.add("task-item__title");
  taskDeleteBtn.classList.add("task-item__delete-btn");
  taskDeleteBtn.textContent = "remove";

  taskTitle.textContent = task.title;

  taskContent.appendChild(taskTitle);
  taskItem.appendChild(taskContent);
  taskItem.appendChild(taskDeleteBtn);
  taskItem.appendChild(taskInfo);
  
  if (appState.currentUser.hasAdmin) {
    const taskExecutor = document.createElement("span");

    taskExecutor.classList.add("task-item__task-executor")
    taskExecutor.textContent = findOfId(task.executor_id, "users").login;

    taskContent.appendChild(taskExecutor);
  }
  
  taskContent.addEventListener("click", () => {
    taskInfo.classList.add("task-info_active");
  })

  taskDeleteBtn.addEventListener("mouseenter", (e) => {
    e.currentTarget.previousElementSibling.classList.toggle("task-item__content_delete-target")
  })

  taskDeleteBtn.addEventListener("click", (e) => {
    e.currentTarget.previousElementSibling.classList.toggle("task-item__content_delete-target")
    
    const taskNode = e.currentTarget.parentNode;
    taskNode.parentNode.removeChild(taskNode);

    Task.delete(task);

    updateAllListSelect();

    calculateTask();
  })

  taskDeleteBtn.addEventListener("mouseout", (e) => {
    e.currentTarget.previousElementSibling.classList.toggle("task-item__content_delete-target")
  })

  return taskItem
}