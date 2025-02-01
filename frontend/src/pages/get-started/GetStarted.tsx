import { AddClub } from "../add-club/AddClub";
import { getUserLS } from "../../authentication/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const GetStarted = () => {

    const user = getUserLS();
    const navigate = useNavigate();

    useEffect(
        () => {
            if (!user) {
                navigate("/about");
            }
        },
        []
    )

    return (
        <AddClub
            includeHeirachy={true}
        />
    );
}