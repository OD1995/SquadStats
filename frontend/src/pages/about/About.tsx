import { useSelector } from "react-redux";
import { userSelector } from "../../store/slices/userSlice";

export const About = () => {

    const user = useSelector(userSelector);

    return (
        <div>
            {user?.access_token}
        </div>
    )
}