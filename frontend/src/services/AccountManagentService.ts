import { BackendResponse } from "../types/BackendResponse"
import { makePostRequest } from "./api"

class AccountManagementSerice {

    base_url = "/account_management"

    register(email:string, password:string) {
        return makePostRequest(
            this.base_url + "/register",
            {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password
                })
            }
        )        
    }

    login(email:string, password:string) {
        return makePostRequest(
            this.base_url + "/login",
            {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password
                })
            }
        )
    }

    logout() {
        localStorage.removeItem("ss_user");
    }
}

export default new AccountManagementSerice();