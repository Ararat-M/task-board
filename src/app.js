import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/style.css";
import "./styles/addUser.css";
import "./styles/profile.css";
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
import { Task } from "./models/Task";
import { getFromStorage } from "./utils";
import { filteredUserTaskList } from "./utils";


export const appState = new State();

document.addEventListener("DOMContentLoaded", () => {
  const login = "admin";
  const password = "admin123";
  authUser(login, password)
  loadPageContent("addUser");
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
  }

  // add user
  if (page === "addUser") {
    const containerUsers = document.createElement('div');
    containerUsers.classList.add("user-container");
    containerUsers.innerHTML = addUserForm;

    contentMainElement.appendChild(containerUsers);
    
    const users = getFromStorage("users")
    
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
    CreateUserForm.addEventListener("submit", () => {

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