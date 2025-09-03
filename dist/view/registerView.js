export class RegisterView {
    userInput;
    passwordInput;
    submitBtn;
    message;
    constructor() {
        this.userInput = document.getElementById("userInput");
        this.passwordInput = document.getElementById("passwordInput");
        this.submitBtn = document.getElementById("submitBtn");
        this.message = document.getElementById("message");
    }
    beginRegister(handler) {
        this.submitBtn.addEventListener("click", () => {
            const userData = {
                user_name: this.userInput.value,
                password: this.passwordInput.value,
            };
            handler(userData);
        });
    }
    displayMessage(message, isError = true) {
        this.message.style.color = isError ? "red" : "green";
        this.message.textContent = message;
    }
}
//# sourceMappingURL=registerView.js.map