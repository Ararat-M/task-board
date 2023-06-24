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

export const filteredUserTaskList = function (user) {
  const taskList = getFromStorage("tasks");

  const taskListReady = taskList.filter(item => {
    return item.executor_id == user.id && item.state == "ready"
  });

  const taskListInProgress = taskList.filter(item => {
    return item.executor_id == user.id && item.state == "in-progress"
  });
  
  const taskListFinished = taskList.filter(item => {
    return item.executor_id == user.id && item.state == "finished"
  });
  
  return { taskListReady, taskListInProgress, taskListFinished }
}

export const filteredTaskList = function () {
  const taskList = getFromStorage("tasks");
  
  const taskListReady = taskList.filter(item => {
    return item.state == "ready"
  });
  
  const taskListInProgress = taskList.filter(item => {
    return item.state == "in-progress"
  });
  
  const taskListFinished = taskList.filter(item => {
    return item.state == "finished"
  });
  
  return { taskListReady, taskListInProgress, taskListFinished }
}

export function findUserOfId(user_id) {
  const users = getFromStorage("users");

  for (let i = 0; i < users.length; i++) {
    if (users[i].id == user_id) return users[i]
  }
}

export function taskRealoder() {
  const taskList = getFromStorage("tasks");

  const newTaskList = [];

  for (let i = 0; i < taskList.length; i++) {
    const currentTask = taskList[i];

    currentTask.state = "ready"
    currentTask.description = `
    Это был темный лес, издали казавшийся непроходимым. Там Пахапиль охотился, глушил рыбу, спал на еловых ветках. Короче – жил, пока русские не выгнали оккупантов. А когда немцы ушли, Пахапиль вернулся. Он появился в Раквере, где советский капитан наградил его медалью. Медаль была украшена четырьмя непонятными словами, фигурой и восклицательным знаком.
    `;
    
    newTaskList.push(currentTask);
  }

  localStorage.setItem('tasks', JSON.stringify(newTaskList));
}

export function createFirstAdmin() {
  if (getFromStorage("users").length <= 0) {
    const admin = new Admin("admin", "admin123");
    Admin.save(admin);
  }
}

export function incrementCounter(counterNode) {
  counterNode.innerHTML = Number(counterNode.textContent) + 1;
}

export function decrementCounter(counterNode) {
  counterNode.innerHTML = Number(counterNode.textContent) + -1;
}