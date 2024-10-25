import { ChangeEvent, useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import './Login.css';
import { getUserFromLocalStorage } from "../../services/api";
import { BackendResponse } from "../../types/BackendResponse";
import UserManagementService from "../../services/UserManagementService";



export const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loginError, setLoginError] = useState("")
    const [loginErrorColour, setLoginErrorColour] = useState("black");
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const isLoggedIn = getUserFromLocalStorage() != null;
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(
        () => {
            document.title = "Login";
            const keyEnter = (ev:KeyboardEvent) => {
                if (ev.key === 'Enter') {
                    handleLogin();
                }
            }
            document.addEventListener('keydown',keyEnter);
            return () => {
                document.removeEventListener('keydown',keyEnter);
            }
        }
    )
    
    // const dispatch = useDispatch();

    async function loginProcess() {
        UserManagementService.login(
            email,
            password
        ).then(
            (res:BackendResponse) => {
                if (res.success) {
                    localStorage.setItem("ss_user",res.data.ss_user);
                } else {
                    setLoginError(res.data);
                    return false;
                }
            }
        )
    }

    async function handleLogin() {
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
            await loginProcess();            
        }
        setButtonDisabled(false);
    }

    const onChangeEmail = (e:ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const onChangePassword = (e:ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    // This is the part that does the navigation once the login is successful
    if (isLoggedIn) {
        const nextVal = searchParams.get("next");
        if (nextVal !== null) {
            return <Navigate to={nextVal}/>
        } else {
            return <Navigate to="/qb-predictions"/>
        }
    }

    return (
        <div id="login-parent-div">
            <h1 className="big-h1-title">
                Login
            </h1>
            <div id="login-input-parent-div">
                <div id="login-input-grid">
                    <h5
                        style={{
                            gridRow: 1,
                            gridColumn: 1
                        }}
                    >
                        Email
                    </h5>
                    <input
                        onChange={onChangeEmail}
                        className="login-input"
                        style={{
                            gridRow: 1,
                            gridColumn: 2
                        }}
                    />
                    <p
                        className="ss-red-error"
                        style={{
                            gridRow: 2,
                            gridColumnStart: 1,
                            gridColumnEnd: 3
                        }}
                    >
                        {emailError}
                    </p>
                    <h5
                        style={{
                            gridRow: 3,
                            gridColumn: 1
                        }}
                    >
                        Password
                    </h5>
                    <input
                        onChange={onChangePassword}
                        className="login-input"
                        style={{
                            gridRow: 3,
                            gridColumn: 2
                        }}
                        type='password'
                    />
                    <p
                        className="ss-red-error"
                        style={{
                            gridRow: 4,
                            gridColumnStart: 1,
                            gridColumnEnd: 3
                        }}
                    >
                        {passwordError}
                    </p>
                    <a
                        href="/forgotten-password/email-entry"
                        style={{
                            gridRow: 5,
                            gridColumnStart: 1,
                            gridColumnEnd: 3
                        }}
                    >
                        Forgotten Password?
                    </a>

                </div>
                <button
                    id="login-button"
                    className={"ss-black-button" + (buttonDisabled ? " disabled-button" : "")}
                    onClick={() => handleLogin()}
                    disabled={buttonDisabled}
                >
                    Login
                </button>
                <p
                    id="login-error"
                    // className="tqbc-red-error"
                    style={{
                        color: loginErrorColour
                    }}
                >
                    {loginError}
                </p>
            </div>
        </div>
    );
};