import UserManagementService from "../../services/UserManagementService";
import { BackendResponse } from "../../types/BackendResponse";
import { ForgottenOrResetPassword } from "./ForgottenOrResetPassword";

export const ForgottenPassword = () => {

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
                setBackendResponseColour(res.success ? "green" : "red");
                setBackendResponse(res.data.message);
                setButtonDisabled(false);
            }
        )
    }

    return (        
        <ForgottenOrResetPassword
            pageTitle="Forgotten Password"
            placeholder="Enter email address"
            handleClick={handleClick}
        />
    )
}