import { MusicPlayerController } from "./controllers/musicPlayer.js";

const ff = new MusicPlayerController();

const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");

loginBtn?.addEventListener("click", () => {
  window.location.href = "../src/pages/login.html";
});

registerBtn?.addEventListener("click", () => {
  window.location.href = "../src/pages/register.html";
});
