import { filteredUserTaskList } from "../utils"
import { filteredTaskList } from "../utils"
import { findUserOfId } from "../utils"
import { appState } from "../app";
import { Task } from "../models/Task";

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

  const taskModalWindowList = document.querySelectorAll(".task-info")
  
  taskModalWindowList.forEach((item) => {
    document.querySelector(".kanban__content").appendChild(item)
  })
}

function clearList(list) {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
}

function createTaskElement(task) {
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
    taskExecutor.textContent = findUserOfId(task.executor_id).login;

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
  })

  taskDeleteBtn.addEventListener("mouseout", (e) => {
    e.currentTarget.previousElementSibling.classList.toggle("task-item__content_delete-target")
  })

  return taskItem
}

function createTaskModalWindow(task) {
  const taskInfo = document.createElement("div");
  const taskInfoTitle = document.createElement("span");
  const taskInfoDescription = document.createElement("p");
  const taskInfoExitBtn = document.createElement("button");

  taskInfo.classList.add("task-info")
  taskInfoTitle.classList.add("task-info__title")
  taskInfoDescription.classList.add("task-info__description")
  taskInfoExitBtn.classList.add("task-info__exit-btn")

  taskInfo.dataset.task_id = task.id;

  taskInfoTitle.textContent = task.title;
  taskInfoDescription.textContent = task.description;
  taskInfoExitBtn.innerHTML = `
    <svg width="36" height="36" viewBox="0 0 16 16">
      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
    </svg>
  `

  taskInfo.appendChild(taskInfoTitle);
  taskInfo.appendChild(taskInfoDescription);
  taskInfo.appendChild(taskInfoExitBtn);

  taskInfoTitle.addEventListener("click", () => {
    const input = document.createElement("input");
    
    input.classList.add("form-control", "me-2", "task-info__title-change-input");

    input.value = taskInfoTitle.textContent;

    taskInfo.appendChild(input);
    input.focus();
    
    // taskInfoTitle.style.display ="none"
    
    input.addEventListener("blur", () => {
      if (input.value.trim()) {
        taskInfoTitle.textContent = input.value;
      }

      taskInfo.removeChild(input);
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        input.blur();
      }
    })
  })

  taskInfoDescription.addEventListener("click", () => {
    const textarea = document.createElement("textarea");
    
    textarea.classList.add("form-control", "me-2", "task-info__description-change-textarea");
    
    textarea.textContent = taskInfoDescription.textContent.trim();
    textarea.rows = 14;
    
    taskInfo.appendChild(textarea);

    textarea.focus();
    
    taskInfoDescription.style.display ="none"

    textarea.addEventListener("blur", () => {
      if (textarea.value.trim()) {
        taskInfoDescription.textContent = textarea.value;
      }

      taskInfo.removeChild(textarea);

      taskInfoDescription.style.display ="block"
    });

    textarea.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        textarea.blur();
      }
    })
  })
  
  taskInfoExitBtn.addEventListener("click", () => {
    taskInfo.classList.remove("task-info_active");
  })

  return taskInfo
}