import { LoginController } from "./controllers/loginController.js";

const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");

loginBtn?.addEventListener("click", () => {
  window.location.href = "../src/pages/login.html";
});

registerBtn?.addEventListener("click", () => {
  window.location.href = "../src/pages/register.html";
});

function play() {
  var resume = document.getElementById("play-btn");

  var resumeOn = resume?.classList.contains("fa-play");

  if (resumeOn) {
    resume?.classList.remove("fa-play");
    resume?.classList.add("fa-pause");
  } else {
    resume?.classList.remove("fa-pause");
    resume?.classList.add("fa-play");
  }
}
const loginController = new LoginController();
