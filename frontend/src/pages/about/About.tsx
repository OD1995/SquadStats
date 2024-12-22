import { useSelector } from "react-redux";
import { userSelector } from "../../store/slices/userSlice";
import "./About.css";
import { getUserLS } from "../../authentication/auth";

export const About = () => {

    // const user = useSelector(userSelector);
    const user = getUserLS();

    return (
        <div id='about-parent'>
            <div>
                Some text
            </div>
        </div>
    )
}