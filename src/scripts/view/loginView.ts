export class LoginView {
  userInput: HTMLInputElement;
  passwordInput: HTMLInputElement;
  submitBtn: HTMLElement;

  constructor() {
    this.userInput = document.getElementById("userInput") as HTMLInputElement;
    this.passwordInput = document.getElementById(
      "passwordInput"
    ) as HTMLInputElement;
    this.submitBtn = document.getElementById("submitBtn") as HTMLButtonElement;
  }

  beginLogin(handler: (data: { user_name: string; password: string }) => void) {
    this.submitBtn.addEventListener("click", () => {
      const userData = {
        user_name: this.userInput.value,
        password: this.passwordInput.value,
      };

      handler(userData);
    });
  }
}
