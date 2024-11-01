import { setUser } from "../store/slices/userSlice"
import { User } from "../types/User"
import { makePostRequest } from "./api"

class UserManagementService {

    base_url = "/user_management"

    register(email:string, password:string) {
        return makePostRequest(
            this.base_url + "/register",
            JSON.stringify({
                email,
                password
            })
        )        
    }

    login(email:string, password:string) {
        return makePostRequest(
            this.base_url + "/login",
            JSON.stringify({
                email,
                password
            })
        )
    }
}

export default new UserManagementService();