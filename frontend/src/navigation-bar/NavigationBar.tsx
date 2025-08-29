import { useDispatch, useSelector } from "react-redux"
import { refreshSelector, triggerRefresh } from "../store/slices/userSlice"
import { MobileNavigationBar } from "./MobileNaviationBar"
import "./NavigationBar.css"
import { isWiderThanHigher } from "../helpers/windowDimensions"
import { DesktopNavigationBar } from "./DesktopNavigationBar"
import { getUserLS, setUserLS } from "../authentication/auth"


export const NavigationBar = () => {

    const refresh = useSelector(refreshSelector);
    const dispatch = useDispatch();
    const user = getUserLS();

    const handleLogoutClick = () => {
        setUserLS(null);
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