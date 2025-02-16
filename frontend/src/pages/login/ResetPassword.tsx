import { useSearchParams } from "react-router-dom";
import UserManagementService from "../../services/UserManagementService";
import { BackendResponse } from "../../types/BackendResponse";
import { ForgottenOrResetPassword } from "./ForgottenOrResetPassword";

export const ResetPassword = () => {

    const [searchParams, setSearchParams] = useSearchParams();

    const handleClick = (
        newPassword:string,
        setButtonDisabled:Function,
        setBackendResponse:Function,
        setBackendResponseColour:Function
    ) => {
        setButtonDisabled(true);
        setBackendResponse("");
        UserManagementService.setNewPassword(
            newPassword,
            searchParams.get("token")!
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
            pageTitle="Reset Password"
            placeholder="Enter new password"
            handleClick={handleClick}
        />
    )
}