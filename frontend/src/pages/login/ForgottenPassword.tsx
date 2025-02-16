// import { ChangeEvent, useState } from "react";
// import { getBigTitle } from "../../helpers/other";
import UserManagementService from "../../services/UserManagementService";
// import "./ForgottenPassword.css";
import { BackendResponse } from "../../types/BackendResponse";
import { ForgottenOrResetPassword } from "./ForgottenOrResetPassword";

export const ForgottenPassword = () => {

    // const [email, setEmail] = useState("");
    // const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
    // const [backendResponse, setBackendResponse] = useState("");
    // const [backendResponseColour, setBackendResponseColour] = useState("");

    const handleClick = (
        email:string,
        setButtonDisabled:Function,
        setBackendResponse:Function,
        setBackendResponseColour:Function
    ) => {
        setButtonDisabled(true);
        setBackendResponse("");
        UserManagementService.sendResetPasswordEmail(
            email
        ).then(
            (res:BackendResponse) => {
                // if (res.success) {
                //     setBackendResponseColour("green");
                // } else {
                //     res.
                // }
                setBackendResponseColour(res.success ? "green" : "red");
                setBackendResponse(res.data.message);
                setButtonDisabled(false);
            }
        )
    }

    // const onChangeEmail = (e:ChangeEvent<HTMLInputElement>) => {
    //     setEmail(e.target.value);
    // }

    return (        
        <ForgottenOrResetPassword
            pageTitle="Forgotten Password"
            placeholder="Enter email address"
            handleClick={handleClick}
        />
    )

    // return (
    //     <div className="page-parent">
    //         {getBigTitle("Forgotten Password")}
    //         <div id='forgotten-password-content'>
    //             <input
    //                 id='fogotten-password-input'
    //                 placeholder="Enter email address"
    //                 value={email}
    //                 onChange={onChangeEmail}
    //             />
    //             <div id='forgotten-password-button-div'>
    //                 <button
    //                     id='forgotten-password-button'
    //                     className={"ss-green-button" + (buttonDisabled ? " disabled-button" : "")}
    //                     onClick={handleClick}
    //                     disabled={buttonDisabled}
    //                 >
    //                     Submit
    //                 </button>
    //             </div>
    //             <div style={{color:backendResponseColour, maxWidth: "100%"}}>
    //                 {backendResponse}
    //             </div>
    //         </div>
    //     </div>
    // );
}