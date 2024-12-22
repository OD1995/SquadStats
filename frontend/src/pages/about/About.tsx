import { useSelector } from "react-redux";
import { userSelector } from "../../store/slices/userSlice";
import "./About.css";

export const About = () => {

    const user = useSelector(userSelector);

    return (
        <div id='about-parent'>
            <div>
                Some text
            </div>
        </div>
    )
}