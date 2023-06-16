import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/style.css";
import kanbanMain from "./templates/kanbanMain.html";
import kanbanFooter from "./templates/kanbanFooter.html";
import noAccess from "./templates/noAccess.html";
import authForm from "./templates/authForm.html"
import userInfo from "./templates/userInfo.html"
import { User } from "./models/User";
import { generateTestUser } from "./utils";
import { State } from "./state";
import { authUser } from "./services/auth";
import { Task } from "./models/Task";
import { usersList } from "./usersList";

export const appState = new State();


document.querySelector(".user-panel").innerHTML = authForm;
const loginForm = document.querySelector("#app-login-form");

// usersList.forEach(i => {
//   User.save(i)
// })

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let auth = false;

  const formData = new FormData(loginForm);
  const login = formData.get("login");
  const password = formData.get("password");

  if (authUser(login, password)) {
    document.querySelector(".main").innerHTML = kanbanMain;
    document.querySelector(".footer").innerHTML = kanbanFooter;
    auth = true;
    console.log(appState);
  } else {
    document.querySelector(".main").innerHTML = noAccess;
    auth = false;
  }

  if (auth) {
    document.querySelector(".user-panel").innerHTML = userInfo;

    const addButton = document.querySelectorAll(".task-content__btn-add");
    const addButtonContent = 
    `
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 6H8V1C8 0.448 7.552 0 7 0C6.448 0 6 0.448 6 1V6H1C0.448 6 0 6.448 0 7C0 7.552 0.448 8 1 8H6V13C6 13.552 6.448 14 7 14C7.552 14 8 13.552 8 13V8H13C13.552 8 14 7.552 14 7C14 6.448 13.552 6 13 6Z" fill="#5E6C84"/>
      </svg> 
      Add card
    `
   
    
    addButton.forEach((item) => {
      item.addEventListener("click", () => {
        const ul = item.previousElementSibling;
        const input = document.createElement("input");
        
        ul.appendChild(input);
        input.focus();
        
        input.addEventListener("blur", () => {
          const newItem = document.createElement('li');

          const newTask = new Task(input.value, appState.currentUser.id);

          newItem.textContent = newTask.title;
          newItem.classList.add("task-item");
          
          ul.appendChild(newItem);
          ul.removeChild(input);

          item.classList.toggle("task-content__btn-submit");
          item.classList.toggle("task-content__btn-add");
          item.innerHTML = addButtonContent;

          Task.save(newTask);
          console.log(newTask);
          console.log("-----------------------");
          console.log(JSON.parse(localStorage.getItem(newTask.storageKey)));
        })

        item.classList.toggle("task-content__btn-add");

        if (item.classList.toggle("task-content__btn-submit")) {
          item.textContent = "Sumbit";
        }
        
      })
    })

  }
});


