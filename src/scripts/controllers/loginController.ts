import { AuthDto } from "../dto/authDto";
import { LoginModel } from "../model/loginModel";
import { LoginView } from "../view/loginView";

export class LoginController {
  model: LoginModel;
  view: LoginView;

  constructor() {
    this.model = new LoginModel();
    this.view = new LoginView();
  }

  async login(userData: AuthDto) {
    if (!userData) {
      throw new error();
    }
  }
}
