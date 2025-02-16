import { ChangeEvent, MouseEventHandler, useState } from "react";
import { getBigTitle } from "../../helpers/other";
import UserManagementService from "../../services/UserManagementService";
import "./ForgottenOrResetPassword.css";
import { BackendResponse } from "../../types/BackendResponse";

interface OwnProps {
    pageTitle:string
    placeholder:string
    handleClick:Function
}

export const ForgottenOrResetPassword = (props:OwnProps) => {

    const [text, setText] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
    const [backendResponse, setBackendResponse] = useState<string>("");
    const [backendResponseColour, setBackendResponseColour] = useState<string>("");

    const onChangeText = (e:ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    }

    return (
        <div className="page-parent">
            {getBigTitle(props.pageTitle)}
            <div id='for-password-content'>
                <input
                    id='for-password-input'
                    placeholder={props.placeholder}
                    value={text}
                    onChange={onChangeText}
                />
                <div id='for-password-button-div'>
                    <button
                        id='for-password-button'
                        className={"ss-green-button" + (buttonDisabled ? " disabled-button" : "")}
                        onClick={
                            () => props.handleClick(
                                text,
                                setButtonDisabled,
                                setBackendResponse,
                                setBackendResponseColour
                            )
                        }
                        disabled={buttonDisabled}
                    >
                        Submit
                    </button>
                </div>
                <div style={{color:backendResponseColour, maxWidth: "100%"}}>
                    {backendResponse}
                </div>
            </div>
        </div>
    );
}