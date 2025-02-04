import { ChangeEvent, useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { PAGE_TYPE } from "../types/enums";
import { useDispatch } from "react-redux";
import './LoginOrRegster.css';
import { getUserLS } from "../authentication/auth";
import { getBigTitle } from "../helpers/other";

interface LoginOrRegisterProps {
    pageType:PAGE_TYPE
    handleSubmitButton:Function
}

export const LoginOrRegister = (props:LoginOrRegisterProps) => {

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [submitError, setSubmitError] = useState("")
    const [submitErrorColour, setSubmitErrorColour] = useState("black");
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();   
    const navigate = useNavigate(); 
    const dispatch = useDispatch();
    const user = getUserLS();
    
    useEffect(
        () => {
            // document.title = props.pageType;
            const keyEnter = (ev:KeyboardEvent) => {
                if (ev.key === 'Enter') {
                    props.handleSubmitButton();
                }
            }
            document.addEventListener('keydown',keyEnter);
            return () => {
                document.removeEventListener('keydown',keyEnter);
            }
        }
    )

    const onChangeEmail = (e:ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const onChangePassword = (e:ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    if (user) {
        // Navigate once the login is successful
        const nextVal = searchParams.get("next");
        if (nextVal !== null) {
            return <Navigate to={nextVal}/>
        }
        // Navigate if already logged in
        return <Navigate to="my-clubs"/>
    }

    const handleButtonPress = () => {
        props.handleSubmitButton(
            setButtonDisabled,
            dispatch,
            setEmailError,
            setPasswordError,
            email,
            password,
            setSubmitErrorColour,
            setSubmitError,
            navigate
        )
    }

    return (
        <div className="page-parent">
            {/* <h1 className="big-h1-title">
                {props.pageType}
            </h1> */}
            {getBigTitle(props.pageType)}
            <div id="lor-input-parent-div">
                <div id="lor-input-grid">
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
                        className="lor-input"
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
                        className="lor-input"
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
                    {
                        (props.pageType == PAGE_TYPE.LOGIN) && (
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
                        )
                    }
                </div>
                <button
                    id="submit-button"
                    className={"ss-black-button" + (buttonDisabled ? " disabled-button" : "")}
                    onClick={() => handleButtonPress()}
                    disabled={buttonDisabled}
                >
                    {props.pageType}
                </button>
                <p
                    id="submit-error"
                    style={{
                        color: submitErrorColour
                    }}
                >
                    {submitError}
                </p>
            </div>
        </div>
    );
};