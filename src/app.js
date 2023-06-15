import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/style.css";
import taskFieldTemplate from "./templates/taskField.html";
import taskFieldFooterTemplate from "./templates/taskFieldFooter.html";
import noAccessTemplate from "./templates/noAccess.html";
import { User } from "./models/User";
import { generateTestUser } from "./utils";
import { State } from "./state";
import { authUser } from "./services/auth";

export const appState = new State();

const loginForm = document.querySelector("#app-login-form");

generateTestUser(User);
// debug start
let fieldHTMLContentMain =taskFieldTemplate

document.querySelector(".main").innerHTML = fieldHTMLContentMain;

let fieldHTMLContentFooter = taskFieldFooterTemplate

document.querySelector(".footer").innerHTML = fieldHTMLContentFooter;
// debug end
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const login = formData.get("login");
  const password = formData.get("password");

  let fieldHTMLContent = authUser(login, password)
    ? taskFieldTemplate
    : noAccessTemplate;

  document.querySelector("#content").innerHTML = fieldHTMLContent;
});
