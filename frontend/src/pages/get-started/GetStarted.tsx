import { useSelector } from "react-redux";
import { AddClub } from "../add-club/AddClub";
import { userSelector } from "../../store/slices/userSlice";
import { Link } from "react-router-dom";
import { getUserLS } from "../../authentication/auth";

export const GetStarted = () => {

    // const user = useSelector(userSelector);
    const user = getUserLS();

    if (user) {
        return (
            <AddClub
                includeHeirachy={true}
            />
        );
    } else {
        return (
            <Link
                to='/about'
            />
        )
    }
}