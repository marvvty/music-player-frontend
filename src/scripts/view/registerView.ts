export class RegisterView {
  userInput: HTMLInputElement;
  passwordInput: HTMLInputElement;
  submitBtn: HTMLElement;
  message: HTMLElement;

  constructor() {
    this.userInput = document.getElementById("userInput") as HTMLInputElement;
    this.passwordInput = document.getElementById(
      "passwordInput"
    ) as HTMLInputElement;

    this.submitBtn = document.getElementById("submitBtn") as HTMLButtonElement;
    this.message = document.getElementById("message") as HTMLElement;
  }

  beginRegister(
    handler: (data: { user_name: string; password: string }) => void
  ) {
    this.submitBtn.addEventListener("click", () => {
      const userData = {
        user_name: this.userInput.value,
        password: this.passwordInput.value,
      };

      handler(userData);
    });
  }

  displayMessage(message: string, isError: boolean = true) {
    this.message.style.color = isError ? "red" : "green";
    this.message.textContent = message;
  }
}
