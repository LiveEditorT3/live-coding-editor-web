import { HttpClient } from "./serviceBase";

class UserService {
    Login = async (code) =>
        await HttpClient.Post(`api/login?code=${code}`)

    GetUser = async () => 
        await HttpClient.Get('api/user')
}

export default new UserService()