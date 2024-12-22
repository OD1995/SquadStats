import { useSelector } from "react-redux";
import { userSelector } from "../../store/slices/userSlice";
import { Link } from "react-router-dom";
import { getUserLS } from "../../authentication/auth";

export const Home = () => {
    
    // const user = useSelector(userSelector);
    const user = getUserLS();
    
    if (user) {
        return null;
    } else {
        return (
            <Link
                to='/about'
            />
        )
    }
}