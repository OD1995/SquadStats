import { makePostRequest, transform } from "./api"
import { BackendResponse } from "../types/BackendResponse"
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

    // login(email:string, password:string) {
    //     return makePostRequest(
    //         this.base_url + "/login",
    //         {
    //             email,
    //             password
    //         }
    //     )
    // }

    async login(email:string, password:string) {
        const response = await makePostRequest(
            this.base_url + "/login",
            {
                email,
                password
            }
        ).then(transform);
        return response as BackendResponse;
    }

    refreshAccessToken(access_token:string|undefined) {
        return makePostRequest(
            this.base_url + "/refresh",
            {
                access_token
            }
        )
    }
}

export default new UserManagementService();