import { useDispatch } from "react-redux"
import { triggerRefresh } from "../store/slices/userSlice"
import { MobileNavigationBar } from "./MobileNaviationBar"
import "./NavigationBar.css"
import { isWiderThanHigher } from "../helpers/windowDimensions"
import { DesktopNavigationBar } from "./DesktopNavigationBar"
import { getUserLS, setUserLS } from "../authentication/auth"


export const NavigationBar = () => {

    // const [refresh, setRefresh] = useState<number>(0);
    const dispatch = useDispatch();
    const user = getUserLS();

    const handleLogoutClick = () => {
        // dispatch(setUser(null))
        setUserLS(null);
        // setRefresh(refresh + 1);
        dispatch(triggerRefresh())
    }

    const isDesktop = isWiderThanHigher();

    if (isDesktop) {
        return (
            <DesktopNavigationBar
                user={user}
                handleLogoutClick={handleLogoutClick}
            />
        )
    } else {
        return (
            <MobileNavigationBar
                user={user}
                handleLogoutClick={handleLogoutClick}
            />
        )
    }    
}