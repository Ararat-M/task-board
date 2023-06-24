import { Task } from "../models/Task";
import { updateAllListSelect } from "./updateAllListSelect";
import { updateAllTaskList } from "./updateAllTaskList";

export function createTaskModalWindow(task) {
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
    const currentTask = findOfId(task.id, "tasks");

    const input = document.createElement("input");
    
    input.classList.add("form-control", "me-2", "task-info__title-change-input");

    input.value = taskInfoTitle.textContent;

    taskInfo.appendChild(input);
    input.focus();
    

    input.addEventListener("blur", () => {
      if (input.value.trim()) {
        taskInfoTitle.textContent = input.value;
        currentTask.title = input.value;
      }
      
      taskInfo.removeChild(input);

      Task.change(currentTask);
      updateAllTaskList();
      updateAllListSelect();
    });
    
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        input.blur();
      }
    })

  })

  taskInfoDescription.addEventListener("click", () => {
    const currentTask = findOfId(task.id, "tasks");

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
        currentTask.description = textarea.value;
      }

      taskInfo.removeChild(textarea);

      taskInfoDescription.style.display ="block"

      Task.change(currentTask);
      updateAllTaskList();
      updateAllListSelect();
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