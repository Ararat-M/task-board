import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/style.css";
import "./styles/addUser.css";
import "./styles/profile.css";
import "./styles/main.css";
import { getFromStorage } from "./utils";
import { filteredUserTaskList } from "./utils";
import { createFirstAdmin, taskRealoder } from "./utils";
import { incrementCounter } from "./utils";
import { decrementCounter } from "./utils";
import kanbanMain from "./templates/kanbanMain.html";
import kanbanFooter from "./templates/kanbanFooter.html";
import noAccess from "./templates/noAccess.html";
import authForm from "./templates/authForm.html";
import userInfo from "./templates/userInfo.html";
import userCard from "./templates/userCard.html";
import addUserFooter from "./templates/addUserFooter.html";
import adminDropdown from "./templates/adminDropdown.html";
import userDropdown from "./templates/userDropdown.html";
import addUserForm from "./templates/addUserForm.html";
import profile from "./templates/profile.html";
import { State } from "./state";
import { authUser } from "./services/auth";
import { createUser } from "./services/createUser";
import { createTask } from "./services/createTask";
import { updateAllTaskList } from "./services/updateAllTaskList";
import { changeTaskState } from "./services/changeTaskState";

export const appState = new State();

document.addEventListener("DOMContentLoaded", () => {
  // taskRealoder()
  createFirstAdmin();
  const login = "admin";
  const password = "admin123";
  authUser(login, password);
  loadPageContent("main");
})

const contentUserPanelElement = document.querySelector(".user-panel");
const contentMainElement = document.querySelector(".main");
const contentFooterElement = document.querySelector(".footer");

// Функция для загрузки контента страницы
function loadPageContent(page) {
  // Очищаем существующий контент
  contentUserPanelElement.innerHTML = "";
  contentMainElement.innerHTML = "";
  contentFooterElement.innerHTML = "";

  // User panel загрузиться только при appState.auth == true
  loadUserPanel()
  
  // Загружаем контент страницы авторизации
  if (page === "auth") {
    contentUserPanelElement.innerHTML = authForm;
    contentMainElement.innerHTML = "<h2>Log In</h2>";

    const appLoginForm = document.querySelector("#app-login-form");

    appLoginForm.addEventListener("submit", (e) => {
      e.preventDefault();
    
      const formData = new FormData(appLoginForm)
      const login = formData.get("login");
      const password = formData.get("password");
    
      if ( authUser(login, password) ) {
        page = "main"
        appState.auth = true;
      } else {
        contentMainElement.innerHTML = noAccess;
        appState.auth = false;
        return
      }

      loadPageContent(page);
    })
  }
  
  // task board
  if (page === "main") {
    loadMainPage();
  }

  // add user
  if (page === "addUser") {
    loadAddUserPage();
  }

  // Profile
  if (page === "profile") {
    loadProfilePage();
  }
}

function loadUserPanel() {
  if (!appState.auth) {
    return
  }

  contentUserPanelElement.innerHTML = userInfo;
    
  const contentDropdown = document.querySelector(".dropdown__content");
  const LogOut = document.querySelector(".logout-btn");
  
  appState.currentUser.hasAdmin
  ? contentDropdown.innerHTML = adminDropdown
  : contentDropdown.innerHTML = userDropdown;
  
  document.querySelectorAll(".dropdown__link").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();

      loadPageContent(e.currentTarget.dataset.content);
    })
  })
  
  LogOut.addEventListener("click", (e) => {
    appState.currentUser = null;
    appState.auth = false;

    loadPageContent("auth");
  })
}

function loadMainPage() {
  if (!appState.auth) {
    loadPageContent("auth");
    
    return
  }
  
  contentMainElement.innerHTML = kanbanMain;
  contentFooterElement.innerHTML = kanbanFooter;

  const activeTaskCounterNode = document.querySelector(".item-active__counter");
  const finishedTaskCounterNode = document.querySelector(".item-finished__counter");

  const readyList = document.querySelector(".task-list__ready");
  const inProgressList = document.querySelector(".task-list__in-progress");
  const finishedList = document.querySelector(".task-list__finished");
  
  const formList = document.querySelectorAll(".task-content__form");
  const addBtnList = document.querySelectorAll(".task-content__btn-add");
  
  if (!appState.currentUser.hasAdmin) {
    addBtnList.forEach((item) => {
      if (item.dataset.state == "ready") item.classList.toggle("task-content__btn-add_disabled");
    })
  }

  updateAllTaskList(readyList, inProgressList, finishedList);

  const users = getFromStorage("users").filter((item) => !item.hasAdmin)

  const userListSelect = document.querySelector("#user-list");
  
  users.forEach((item) => {
    const user = document.createElement("option");
    
    user.textContent = item.login;
    user.value = item.id;
    
    userListSelect.appendChild(user)
  })
  
  const tasks = getFromStorage("tasks");

  const taskReadyListSelect = document.querySelector("#task-ready-list-select")
  const taskInProgressListSelect = document.querySelector("#task-in-progress-list-select")
  

  tasks.forEach((item) => {
    if (item.executor_id == appState.currentUser.id || appState.currentUser.hasAdmin) {
      if (item.state == "ready") {
        const task = document.createElement("option");

        task.textContent = item.title;
        task.value = item.id;

        taskReadyListSelect.appendChild(task)
      }
      
      if (item.state == "in-progress") {
        const task = document.createElement("option");

        task.textContent = item.title;
        task.value = item.id;

        taskInProgressListSelect.appendChild(task);

        incrementCounter(activeTaskCounterNode);
      }
      
      if (item.state == "finished") {
        incrementCounter(finishedTaskCounterNode);
      }
    }
  })

  addBtnList.forEach((item, index) => {
    const state = item.dataset.state;
    const form = formList[index];
    
    item.addEventListener("click", () => {
      if (state == "in-progress" && taskReadyListSelect.options.length <= 0) {
        console.error("Список Ready пуст");
        item.classList.toggle("task-content__btn-add_error");

        setTimeout(() => {
          item.classList.toggle("task-content__btn-add_error");
        }, 200)

        return
      }

      if (state == "finished" && taskInProgressListSelect.options.length <= 0) {
        console.error("Список In Progress пуст");

        item.classList.toggle("task-content__btn-add_error");

        setTimeout(() => {
          item.classList.toggle("task-content__btn-add_error");
        }, 200)

        return
      }

      form.classList.toggle("task-content__form_disabled");
      item.classList.toggle("task-content__btn-add_disabled");
    })
    
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (state == "ready") {
        const formData = new FormData(form);
        const taksTitle = formData.get("Task title");

        const user_id = userListSelect.options[userListSelect.selectedIndex].value;
        
        const task = createTask(taksTitle, state, user_id);
        
        if (task) {
          const taskOption = document.createElement("option");
          taskOption.textContent = task.title;
          taskOption.value = task.id;
          taskReadyListSelect.appendChild(taskOption)
        }
      }

      if (state == "in-progress" && taskReadyListSelect.options.length > 0) {
        const currentOption = taskReadyListSelect.options[taskReadyListSelect.selectedIndex];

        changeTaskState(currentOption.value, state);

        incrementCounter(activeTaskCounterNode);

        taskInProgressListSelect.appendChild(currentOption);
      }

      if (state == "finished" && taskInProgressListSelect.options.length > 0) {
        const currentOption = taskInProgressListSelect.options[taskInProgressListSelect.selectedIndex];

        changeTaskState(currentOption.value, state);

        decrementCounter(activeTaskCounterNode);

        incrementCounter(finishedTaskCounterNode);

        taskInProgressListSelect.removeChild(currentOption);
      }

      form.classList.toggle("task-content__form_disabled");
      item.classList.toggle("task-content__btn-add_disabled");

      updateAllTaskList(readyList, inProgressList, finishedList);
    })
  })
}

function loadAddUserPage() {
  if (!appState.auth) {
    loadPageContent("auth");
    return
  }

  const containerUsers = document.createElement('div');
  containerUsers.classList.add("user-container");
  containerUsers.innerHTML = addUserForm;

  contentMainElement.appendChild(containerUsers);
  
  const users = getFromStorage("users").filter((item) => !item.hasAdmin)
  
  users.reverse().forEach((item, index) => {
    containerUsers.innerHTML += userCard;
    
    const login = document.querySelectorAll(".user-content__info")[index];
    const taskCounterReady = document.querySelectorAll(".task-counter-list__item-ready")[index];
    const taskCounterInProgress = document.querySelectorAll(".task-counter-list__item-in-progress")[index];
    const taskCounterFinished = document.querySelectorAll(".task-counter-list__item-finished")[index];
    
    const tasks = filteredUserTaskList(item);
    
    login.textContent = item.login;
    taskCounterReady.textContent = `Ready: ${tasks.taskListReady.length}`;
    taskCounterInProgress.textContent = `In Progress: ${tasks.taskListInProgress.length}`;
    taskCounterFinished.textContent = `Finished: ${tasks.taskListFinished.length}`;
  });
  
  contentFooterElement.innerHTML = addUserFooter;

  document.querySelector(".active-user__counter").textContent = users.length;
  
  const CreateUserForm = document.querySelector(".add-user-form");

  CreateUserForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(CreateUserForm)
    const login = formData.get("new-user-login");
    const password = formData.get("new-user-password");

    if ( createUser(login, password) ) {
      loadPageContent("addUser")
    };
  })
}

function loadProfilePage() {
  if (!appState.auth) {
    loadPageContent("auth");
    return
  }
  
  contentMainElement.innerHTML = profile;

  const profileIdArea = document.querySelector(".profile__info-id");
  const profileLoginArea = document.querySelector(".profile__info-login");
  const profileRoleArea = document.querySelector(".profile__info-role");

  profileIdArea.textContent = `id: ${appState.currentUser.id}`;
  profileLoginArea.textContent = `Login: ${appState.currentUser.login}`;

  appState.currentUser.hasAdmin 
    ? profileRoleArea.textContent = "Role: admin"
    : profileRoleArea.textContent = "Role: user";
}