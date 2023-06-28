import { changeTaskStateOfId } from "./changeTaskStateOfId";
import { updateAllListSelect } from "./updateAllListSelect";
import { updateAllTaskList } from "./updateAllTaskList";

export function dragstartHandler(e) {
  e.dataTransfer.setData("application/my-app", e.currentTarget.id);

  e.dataTransfer.effectAllowed = "move";
}

export function dragoverHandler(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move"
}

export function dropHandler(e) {
  e.preventDefault();
  // Получить id целевого элемента и изменить state
  const taskId = e.dataTransfer.getData("application/my-app");

  changeTaskStateOfId(taskId, e.currentTarget.dataset.state);
  
  updateAllTaskList();
  updateAllListSelect();
}