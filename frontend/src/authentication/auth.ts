import { User } from "../types/User";

export const setUserLS = (user:User|null) => {
    if (user) {
        localStorage.setItem("ss_user", JSON.stringify(user));
    } else {
        localStorage.removeItem("ss_user");
    }
}

export const getUserLS = () : User|null => {
    const userStr = localStorage.getItem("ss_user");
    if (userStr) {
        return JSON.parse(userStr);
    }
    return null;
}

export const setNewAccessToken = (newAccessToken:string) => {
    var user = getUserLS();
    if (user) {
        user.access_token = newAccessToken;
        setUserLS(user);
    }
}