import axios from "axios";
import { BackendResponse } from "../types/BackendResponse";
import store from "../store/store";
import UserManagementService from "./UserManagementService";
import { setUser } from "../store/slices/userSlice";

const instance = axios.create(
    {
        baseURL: import.meta.env.VITE_BACKEND_BASE_URL
    }
);

instance.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        const originalConfig = err.config;
        if (err.response) {
            if ((err.response.status == 401) && err.response.data) {
                if (err.response.data.error == 'ExpiredAccessError') {
                    const user = store.getState().userSlice.user;
                    UserManagementService.refreshAccessToken(
                        user?.access_token
                    ).then(
                        (res:BackendResponse) => {
                            store.dispatch(setUser(res.data.ss_user))
                        }
                    )
                }
            }
        }
        // if ((originalConfig.url !== "/v1/auth/login") && err.response) {
        //     // Access token has expired
        //     if ((err.response.status === 401) && (!originalConfig._retry)) {
        //         originalConfig._retry = true;
        //         try {
        //             const rs = await instance.post(
        //                 "/v1/auth/refresh-access-token",
        //                 {
        //                     refreshToken: TokenService.getLocalRefreshToken()
        //                 }
        //             );
        //             const { accessToken } = rs.data;
        //             TokenService.updateLocalAccessToken(accessToken);
        //             return instance(originalConfig);
        //         } catch (_error) {
        //             if (_error.response.status === 403) {
        //                 // Refresh token has expired
        //                 // Logout and maybe set message
        //                 EventBus.dispatch(
        //                     "logout",
        //                     {
        //                         message: "Logged out after more than 1 month since last activity"
        //                     }
        //                 );
        //             }
        //             return Promise.reject(_error);
        //         }
        //     }
        // }
        // return Promise.reject(err);
    }
)

const getAuthHeader = () => {
    const user = store.getState().userSlice.user;
    if (user && user.access_token) {
        return {
            Authorization: 'Bearer ' + user.access_token,
            "Content-Type" : "application/json"
        };
    }
    return {
        Authorization: '',
        "Content-Type" : "application/json"
    };
}

export async function makeGetRequest(
    url: string
) {
    var backendResponse: BackendResponse;
    try {
        const response = await instance.get(
            url,
            {
                headers: getAuthHeader()
            }
        );
        backendResponse = {
            success: true,
            data: response.data
        }
    } catch (err:any) {
        backendResponse = {
            success: false,
            data: err.stack
        }
    }
    return backendResponse;
}

export async function makePostRequest(
    url: string,
    data: object
) {
    var backendResponse: BackendResponse;
    try {
        const response = await instance.post(
            url,
            JSON.stringify(data),
            {
                headers: getAuthHeader()
            }
        );
        backendResponse = {
            success: true,
            data: response.data
        }
    } catch (err:any) {
        const errorMessage = err?.response?.data?.message ?? err.message;
        backendResponse = {
            success: false,
            data: { message: errorMessage }
        }
    }
    return backendResponse;
}