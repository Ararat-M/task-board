import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/style.css";
import kanbanMain from "./templates/kanbanMain.html";
import kanbanFooter from "./templates/kanbanFooter.html";
import noAccess from "./templates/noAccess.html";
import authForm from "./templates/authForm.html"
import userInfo from "./templates/userInfo.html"
import adminDropdown from "./templates/adminDropdown.html"
import userDropdown from "./templates/userDropdown.html"
import { State } from "./state";
import { authUser } from "./services/auth";
import { Task } from "./models/Task";

export const appState = new State();

document.addEventListener("DOMContentLoaded", () => {
  const login = 'admin';
  const password = 'admin123';

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
      } else {
        contentMainElement.innerHTML = noAccess;
        return
      }

      loadPageContent(page);
    })
  }

  // Загружаем контент админ панели
  if (page === "main") {
    contentUserPanelElement.innerHTML = userInfo;
    contentMainElement.innerHTML = kanbanMain;
    contentFooterElement.innerHTML = kanbanFooter;
    
    const contentDropdown = document.querySelector(".dropdown__content");
    const LogOut = document.querySelector(".logout-btn");
    
    appState.currentUser.hasAdmin
      ? contentDropdown.innerHTML = adminDropdown
      : contentDropdown.innerHTML = userDropdown;


    LogOut.addEventListener("click", (e) => { 
      loadPageContent("auth");
    })
  }

}