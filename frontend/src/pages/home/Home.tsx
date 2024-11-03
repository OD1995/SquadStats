import { useSelector } from "react-redux";
import { userSelector } from "../../store/slices/userSlice";
import { Link } from "react-router-dom";

export const Home = () => {
    
    const user = useSelector(userSelector);
    
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