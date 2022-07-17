import { HttpClient } from "./BaseService";

export default class UserService {
  static login(code) {
    return HttpClient.post(`api/login?code=${code}`);
  }

  static getUser() {
    return HttpClient.get("api/user");
  }
}
