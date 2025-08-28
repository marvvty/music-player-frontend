import { AuthDto } from "../dto/authDto";

export class LoginModel {
  apiUrl = "http://localhost:2828";

  async login(data: AuthDto) {
    const res = await fetch(`${this.apiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await res.json();

    if (!resData) {
      throw new Error("Login Failed");
    }

    return resData;
  }
}
