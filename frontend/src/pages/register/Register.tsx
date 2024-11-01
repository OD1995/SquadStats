import { useState, useEffect, ChangeEvent } from "react";
import { BackendResponse } from "../../types/BackendResponse";
import { isEmail } from "validator";
import "./Register.css";
import UserManagementService from "../../services/UserManagementService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/slices/userSlice";


export const Register = () => {

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("")
    const [registerResult, setRegisterResult] = useState("");
    const [registerResultColour, setRegisterResultColour] = useState("black");
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    useEffect(() => {
        document.title = "Register";
    },[])

    const onChangeEmail = (e:ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const onChangePassword = (e:ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleRegister = () => {
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
                        navigate("/about");
                    } else {
                        setRegisterResult("red");    
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
        <div id="register-parent-div">
            <h1 className="big-h1-title">
                Register
            </h1>
            <div id="register-input-parent-div">
                <div id="register-input-grid">
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
                        className="register-input"
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
                        className="register-input"
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
                </div>
                <button
                    id="register-button"
                    className={"ss-black-button" + (buttonDisabled ? " disabled-button" : "")}
                    onClick={handleRegister} 
                    disabled={buttonDisabled}                   
                >
                    Register
                </button>
                <div
                    id="register-result-div"
                >
                    <p
                        style={{
                            color: registerResultColour
                        }}
                    >
                        {registerResult}
                    </p>
                </div>

            </div>
        </div>
    );
};