import { makePostRequest } from "./api"

class UserManagementService {

    base_url = "/user_management"

    register(email:string, password:string) {
        return makePostRequest(
            this.base_url + "/register",
            {
                email,
                password
            }
        )        
    }

    login(email:string, password:string) {
        return makePostRequest(
            this.base_url + "/login",
            {
                email,
                password
            }
        )
    }
}

export default new UserManagementService();