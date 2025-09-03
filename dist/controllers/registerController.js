import { RegisterModel } from "../model/registerModel.js";
import { RegisterView } from "../view/registerView.js";
export class RegisterController {
    model;
    view;
    constructor() {
        this.model = new RegisterModel();
        this.view = new RegisterView();
        this.init();
    }
    init() {
        this.view.beginRegister(this.register.bind(this));
    }
    async register(data) {
        try {
            const res = await this.model.register(data);
            window.location.href = "../../index.html";
        }
        catch (error) {
            this.view.displayMessage(error.message || "Registration failed.", true);
        }
    }
}
//# sourceMappingURL=registerController.js.map