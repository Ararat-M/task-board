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
    return item.user_id == currentUser.id && item.state == "ready"
  });
  const taskListInProgress = taskList.filter(item => {
    return item.user_id == currentUser.id && item.state == "in-progress"
  });
  const taskListFinished = taskList.filter(item => {
    return item.user_id == currentUser.id && item.state == "finished"
  });
  
  return { taskListReady, taskListInProgress, taskListFinished }
}
