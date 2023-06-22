export const getFromStorage = function (key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
};

export const addToStorage = function (obj, key) {
  const storageData = getFromStorage(key);
  storageData.push(obj);
  localStorage.setItem(key, JSON.stringify(storageData));
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

export function TaskListUpdate(taskList) {
  taskList
}

export function findUserOfId(user_id) {
  const users = getFromStorage("users");

  for (let i = 0; i < users.length; i++) {
    if (users[i].id == user_id) return users[i]
  }
}