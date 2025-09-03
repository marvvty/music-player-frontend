export class RegisterModel {
    apiUrl = "http://localhost:2828";
    async register(data) {
        const res = await fetch(`${this.apiUrl}/auth/register`, {
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
//# sourceMappingURL=registerModel.js.map