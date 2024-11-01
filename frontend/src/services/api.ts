import axios from "axios";
import { BackendResponse } from "../types/BackendResponse";
import { useSelector } from "react-redux";
import { userSelector } from "../store/slices/userSlice";

const instance = axios.create(
    {
        baseURL: import.meta.env.VITE_BACKEND_BASE_URL
    }
);

const getAuthHeader = () => {
    const user = useSelector(userSelector);
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
    body: string
) {
    var backendResponse: BackendResponse;
    try {
        const response = await instance.post(
            url,
            body,
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