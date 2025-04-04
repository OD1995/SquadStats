import { Dispatch } from "react";
import { BackendResponse } from "../../types/BackendResponse";
import UserManagementService from "../../services/UserManagementService";
import { triggerRefresh } from "../../store/slices/userSlice";
import { UnknownAction } from "@reduxjs/toolkit";
import { LoginOrRegister } from "../../generic/LoginOrRegister";
import { PAGE_TYPE } from "../../types/enums";
import { setUserLS } from "../../authentication/auth";
import { User } from "../../types/User";
import { getAllLinkedTeams } from "../../helpers/other";



export const Login = () => {

    async function loginProcess(
        email:string,
        password:string,
        dispatch:Dispatch<UnknownAction>,
        setUserLS:Function,
        setLoginError:Function,
        setLoginErrorColour:Function,
        navigate:Function
    ) {
        UserManagementService.login(
            email,
            password
        ).then(
            (res:BackendResponse) => {
                if (res.success) {
                    const user = res.data.ss_user as User;
                    setUserLS(user);
                    dispatch(triggerRefresh());
                    const clubLength = user.clubs.length;
                    const linkedTeamArray = getAllLinkedTeams(user);
                    if (clubLength == 0) {
                        navigate("/get-started");
                    } else if (linkedTeamArray.length == 1) {
                        navigate(`/team/${linkedTeamArray[0].team_id}/overview`);
                    } else if (clubLength == 1) {
                        navigate(`/club/${user.clubs[0].club_id}/overview`)
                    } else {
                        navigate("/my-clubs");
                    }
                } else {
                    setLoginErrorColour("red");
                    setLoginError(res.data.message);
                    return false;
                }
            }
        )
    }

    async function handleLogin(
        setButtonDisabled:Function,
        dispatch:Dispatch<UnknownAction>,
        setEmailError:Function,
        setPasswordError:Function,
        email:string,
        password:string,
        setLoginErrorColour:Function,
        setLoginError:Function,
        navigate:Function
    ) {
        setButtonDisabled(true);
        setEmailError("");
        setPasswordError("");
        var email_ok = true;
        if (email.length === 0) {
            setEmailError(
                "Please provide your email"
            );
            email_ok = false;
        }
        var password_ok = true;
        if (password.length === 0) {
            setPasswordError(
                "Please provide your password"
            )
            password_ok = false;
        }
        if (email_ok && password_ok) {
            setLoginErrorColour("black");
            setLoginError("Loading..");
            await loginProcess(
                email,
                password,
                dispatch,
                setUserLS,
                setLoginError,
                setLoginErrorColour,
                navigate
            );            
        }
        setButtonDisabled(false);
    }

    return (
        <LoginOrRegister
            pageType={PAGE_TYPE.LOGIN}
            handleSubmitButton={handleLogin}
        />
    );
};