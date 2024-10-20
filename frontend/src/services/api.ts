import axios from "axios";
import { BackendResponse } from "../types/BackendResponse";

const instance = axios.create(
    {
        baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
        headers: {
            "Content-Type" : "application/json"
        }
    }
);

export async function makeGetRequest(
    url: string
) {
    var backendResponse: BackendResponse;
    try {
        const response = await instance.get(url);
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
    init?: RequestInit
) {
    const response: Response = await instance.post(url,init);
    var backendResponse: BackendResponse = {
        success: response.ok,
        data: response.ok ? await response.json() : await response.text()
    }
    return backendResponse;
}

// export default instance;