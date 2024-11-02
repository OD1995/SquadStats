import { Dispatch } from "react";
import { BackendResponse } from "../../types/BackendResponse";
import { isEmail } from "validator";
import UserManagementService from "../../services/UserManagementService";
import { setUser } from "../../store/slices/userSlice";
import { LoginOrRegister } from "../../generic/LoginOrRegister";
import { PAGE_TYPE } from "../../types/enums";
import { UnknownAction } from "@reduxjs/toolkit";


export const Register = () => {

    const handleRegister = (
        setButtonDisabled:Function,
        dispatch:Dispatch<UnknownAction>,
        setEmailError:Function,
        setPasswordError:Function,
        email:string,
        password:string,
        setRegisterResultColour:Function,
        setRegisterResult:Function
    ) => {
        setButtonDisabled(true);
        setEmailError("");
        setPasswordError("");
        setRegisterResult("Loading..")
        // Email
        var email_ok = false;
        if (email.length === 0) {
            setEmailError("Please provide an email address");
        } else if (!isEmail(email)) {
            setEmailError("This is not a valid email address");
        } else {
            email_ok = true;
        }
        // Password
        var password_ok = false;
        if (password.length === 0) {
            setPasswordError("Please provide a password");
        } else if (password.length < 6 || password.length > 40) {
            setPasswordError("Your password must be between 6 and 40 characters");
        } else {
            password_ok = true;
        }
        if (email_ok && password_ok) {
            UserManagementService.register(
                email,
                password
            ).then(
                (res:BackendResponse) => {
                    if (res.success) {
                        setRegisterResultColour("green");
                        dispatch(setUser(res.data.ss_user));
                    } else {
                        setRegisterResultColour("red");    
                    }
                    setRegisterResult(res.data.message);                    
                }
            ).catch(
                (err:Error) => {
                    setRegisterResultColour("red");
                    setRegisterResult(err.message);
                }
            )
        }
        setButtonDisabled(false);
    }

    return (
        <LoginOrRegister
            pageType={PAGE_TYPE.REGISTER}
            handleSubmitButton={handleRegister}
        />
    );
};