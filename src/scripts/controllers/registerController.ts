import { AuthDto } from "../dto/authDto.js";
import { RegisterModel } from "../model/registerModel.js";
import { RegisterView } from "../view/registerView.js";

export class RegisterController {
  model: RegisterModel;
  view: RegisterView;

  constructor() {
    this.model = new RegisterModel();
    this.view = new RegisterView();
    this.init();
  }

  private init() {
    this.view.beginRegister(this.register.bind(this));
  }

  async register(data: AuthDto) {
    try {
      const res = await this.model.register(data);
      window.location.href = "../../index.html";
    } catch (error: any) {
      this.view.displayMessage(error.message || "Registration failed.", true);
    }
  }
}
