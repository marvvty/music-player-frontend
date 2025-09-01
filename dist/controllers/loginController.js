import { LoginModel } from "../model/loginModel.js";
import { LoginView } from "../view/loginView.js";
export class LoginController {
    model;
    view;
    constructor() {
        this.model = new LoginModel();
        this.view = new LoginView();
        this.init();
    }
    init() {
        this.view.beginLogin(this.login.bind(this));
    }
    async login(userData) {
        if (!userData.user_name || !userData.password) {
            this.view.displayMessage("please fill fields");
            return;
        }
        try {
            const data = await this.model.login(userData);
            localStorage.setItem("token", data.token);
            window.location.href = "../../index.html";
        }
        catch (error) {
            this.view.displayMessage(error.message);
        }
    }
}
//# sourceMappingURL=loginController.js.map