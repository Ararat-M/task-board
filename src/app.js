import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/style.css";
import kanbanMain from "./templates/kanbanMain.html";
import kanbanFooter from "./templates/kanbanFooter.html";
import noAccess from "./templates/noAccess.html";
import authForm from "./templates/authForm.html"
import userInfo from "./templates/userInfo.html"
import addUserMain from "./templates/addUserMain.html"
import addUserFooter from "./templates/addUserFooter.html"
import adminDropdown from "./templates/adminDropdown.html"
import userDropdown from "./templates/userDropdown.html"
import { State } from "./state";
import { authUser } from "./services/auth";
import { Task } from "./models/Task";

export const appState = new State();

document.addEventListener("DOMContentLoaded", () => {
  loadPageContent("auth");
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
  
  // Загружаем контент главной страницы
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

  // Загружаем контент админ панели
  if (page === "main") {
    contentMainElement.innerHTML = kanbanMain;
    contentFooterElement.innerHTML = kanbanFooter;
  }

  if (page === "addUser") {
    contentMainElement.innerHTML = addUserMain;
    contentFooterElement.innerHTML = addUserFooter;
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
      
      console.log(e.currentTarget.dataset.content);
      loadPageContent(e.currentTarget.dataset.content);
    })
  })
  
  LogOut.addEventListener("click", (e) => {
    appState.currentUser = null;
    appState.auth = false;
    
    loadPageContent("auth");
  })
}