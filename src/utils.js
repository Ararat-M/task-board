import { appState } from "./app";
import { Admin } from "./models/Admin";

export const getFromStorage = function (key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
};

export const addToStorage = function (obj, key) {
  const storageData = getFromStorage(key);

  storageData.push(obj);

  localStorage.setItem(key, JSON.stringify(storageData));
};

export const deleteInStorage = function (obj, key) {
  const storageData = getFromStorage(key);

  const storageDataFiltered = storageData.filter((item) => item.id != obj.id);

  localStorage.setItem(key, JSON.stringify(storageDataFiltered));
};

export function findOfId(obj_id, storageKey) {
  const storageData = getFromStorage(storageKey);

  for (let i = 0; i < storageData.length; i++) {
    if (storageData[i].id == obj_id) return storageData[i]
  }
}

export function incrementCounter(counterNode) {
  counterNode.innerHTML = Number(counterNode.textContent) + 1;
}

export function decrementCounter(counterNode) {
  counterNode.innerHTML = Number(counterNode.textContent) + -1;
}

export function clearNode(list) {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
}

export function createFirstAdmin() {
  if (getFromStorage("users").length <= 0) {
    const admin = new Admin("admin", "admin123");
    Admin.save(admin);
  }
}

export function calculateTask() {
  const activeTaskCounterNode = document.querySelector(".item-active__counter");
  const finishedTaskCounterNode = document.querySelector(".item-finished__counter");
   
  let taskListFiltered;

  if (!appState.currentUser.hasAdmin) {
    taskListFiltered = filteredTaskList(appState.currentUser);
  } else {
    taskListFiltered = filteredTaskList();
  }

  activeTaskCounterNode.textContent = taskListFiltered.taskListInProgress.length;
  finishedTaskCounterNode.textContent = taskListFiltered.taskListFinished.length;
}

export function filteredTaskList (user = "") {
  const taskList = getFromStorage("tasks");

  // если запрос для user
  if (user) {
    const taskListReady = taskList.filter(item => {
      return item.executor_id == user.id && item.state == "ready";
    });

    const taskListInProgress = taskList.filter(item => {
      return item.executor_id == user.id && item.state == "in-progress";
    });
    
    const taskListFinished = taskList.filter(item => {
      return item.executor_id == user.id && item.state == "finished";
    });

    return { taskListReady, taskListInProgress, taskListFinished }
  }

  // если запрос для admin
  const taskListReady = taskList.filter(item => {
    return item.state == "ready";
  });
  
  const taskListInProgress = taskList.filter(item => {
    return item.state == "in-progress";
  });
  
  const taskListFinished = taskList.filter(item => {
    return item.state == "finished";
  });

  return { taskListReady, taskListInProgress, taskListFinished }
}

export function buttonErr(btn, errMessage) {
  console.error(errMessage);

  btn.classList.toggle("btn_error");

  setTimeout(() => {
    btn.classList.toggle("btn_error");
  }, 200)
}
