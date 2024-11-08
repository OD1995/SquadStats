import { useSelector } from "react-redux";
import { userSelector } from "../../store/slices/userSlice";
import "./About.css";
import OtherService from "../../services/OtherService";
import { instance } from "../../services/api";
import axios from "axios";

export const About = () => {

    // const user = useSelector(userSelector);

    const handleButtonPress = () => {
        // OtherService.test()
        instance.post("/other/test")
        .then(
            (res:any) => {
                const a = 1;
            }
        ).catch(
            (err:any) => {
                const b = 1;
            }
        )
    }

    return (
        <div id='about-parent'>
            {/* {user?.access_token} */}
            <button
                onClick={handleButtonPress}
            >
                Test
            </button>
        </div>
    )
}