import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/style.css";
import "./styles/addUser.css";
import "./styles/profile.css";
import "./styles/main.css";
import kanbanMain from "./templates/kanbanMain.html";
import kanbanFooter from "./templates/kanbanFooter.html";
import noAccess from "./templates/noAccess.html";
import authForm from "./templates/authForm.html"
import userInfo from "./templates/userInfo.html"
import userCard from "./templates/userCard.html"
import addUserFooter from "./templates/addUserFooter.html"
import adminDropdown from "./templates/adminDropdown.html"
import userDropdown from "./templates/userDropdown.html"
import addUserForm from "./templates/addUserForm.html"
import profile from "./templates/profile.html"
import { State } from "./state";
import { authUser } from "./services/auth";
import { createUser } from "./services/createUser";
import { createTask } from "./services/createTask";
import { updateTaskList } from "./services/updateTaskList";
import { getFromStorage } from "./utils";
import { filteredUserTaskList } from "./utils";
import { Admin } from "./models/Admin"


export const appState = new State();

// const admin = new Admin("admin", "admin123");
// Admin.save(admin);

document.addEventListener("DOMContentLoaded", () => {
  const login = "alex";
  const password = "alex123";
  authUser(login, password)
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
  LoadUserPanel()
  
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
    contentMainElement.innerHTML = kanbanMain;
    contentFooterElement.innerHTML = kanbanFooter;

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

    updateTaskList(readyList, inProgressList, finishedList);
    
    const users = getFromStorage("users").filter((item) => !item.hasAdmin)

    const userListSelect = document.querySelector("#user-list");

    users.forEach((item) => {
      const user = document.createElement("option");

      user.textContent = item.login;
      user.value = item.id;

      userListSelect.appendChild(user)
    })

    addBtnList.forEach((item, index) => {
      const state = item.dataset.state;
      const form = formList[index];
      
      item.addEventListener("click", () => {
        form.classList.toggle("task-content__form_disabled");
        item.classList.toggle("task-content__btn-add_disabled");
      })

      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const taksTitle = formData.get("Task title");

        const user_id = userListSelect.options[userListSelect.selectedIndex].value;
        
        createTask(taksTitle, state, user_id);

        form.classList.toggle("task-content__form_disabled");
        item.classList.toggle("task-content__btn-add_disabled");

        updateTaskList(readyList, inProgressList, finishedList);
      })
    })
  }

  // add user
  if (page === "addUser") {
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

      createUser(login, password);
      loadPageContent("addUser")
    })
  }

  // Profile
  if (page === "profile") {
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
}

function LoadUserPanel() {
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