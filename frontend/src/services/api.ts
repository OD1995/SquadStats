import axios from "axios";
import { BackendResponse } from "../types/BackendResponse";
import store from "../store/store";
import UserManagementService from "./UserManagementService";
import { triggerRefresh } from "../store/slices/userSlice";
import { getUserLS, setNewAccessToken } from "../authentication/auth";

const instance = axios.create(
    {
        baseURL: import.meta.env.VITE_BACKEND_BASE_URL
    }
);

let isRefreshing = false;
let failedQueue: any[] = [];

instance.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        const originalConfig = err.config;

        if (err.response) {
            if (err.response.status === 401 && err.response.data) {
                if (err.response.data.error === 'ExpiredAccessError') {
                    const user = getUserLS();
                    
                    // Check if refresh is already in progress
                    if (!isRefreshing) {
                        isRefreshing = true;
                        
                        try {
                            // Refresh the access token
                            const refreshResponse = await UserManagementService.refreshAccessToken(user?.access_token);

                            // Set the new access token
                            setNewAccessToken(refreshResponse.data.new_token);

                            // Dispatch refresh action
                            store.dispatch(triggerRefresh());
                            
                            // Retry all the failed requests with the new token
                            failedQueue.forEach((callback) => callback(refreshResponse.data.new_token));
                            failedQueue = [];

                            // Return the original request with new token
                            originalConfig.headers['Authorization'] = `Bearer ${refreshResponse.data.new_token}`;
                            return instance(originalConfig);
                        } catch (refreshError) {
                            // Handle error in refreshing token, e.g., logout user or redirect
                            return Promise.reject(refreshError);
                        } finally {
                            isRefreshing = false;
                        }
                    } else {
                        // If refresh is in progress, queue the failed request to retry later
                        return new Promise((resolve, _) => {
                            failedQueue.push((newToken: string) => {
                                originalConfig.headers['Authorization'] = `Bearer ${newToken}`;
                                resolve(instance(originalConfig));
                            });
                        });
                    }
                }
            }
        }
        return Promise.reject(err);
    }
)

const getAuthHeader = () => {
    const user = getUserLS();
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
        // const err = err1 as AxiosError;
        // console.log(JSON.stringify(err));
        // const errorMessage = "132";
        const errorMessage = err?.response?.data?.message ?? err.message;
        backendResponse = {
            success: false,
            data: { message: errorMessage }
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

export async function makeFormDataPostRequest(
    url: string,
    data: FormData
) {
    var backendResponse: BackendResponse;
    try {
        const response = await instance.post(
            url,
            data,
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