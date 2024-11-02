import { useSelector } from "react-redux";
import { userSelector } from "../../store/slices/userSlice";
import "./About.css";

export const About = () => {

    const user = useSelector(userSelector);

    return (
        <div id='about-parent'>
            {/* {user?.access_token} */}
            <div className="test-class">

            </div>
            <div id='od' className="test-class">

            </div>
            <div className="test-class">

            </div>
        </div>
    )
}