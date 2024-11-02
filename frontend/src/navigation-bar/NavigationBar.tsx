import { useDispatch, useSelector } from "react-redux"
import { setUser, userSelector } from "../store/slices/userSlice"
import { MobileNavigationBar } from "./MobileNaviationBar"
import "./NavigationBar.css"
import { isWiderThanHigher } from "../helpers/windowDimensions"
import { DesktopNavigationBar } from "./DesktopNavigationBar"

interface NavigationBarProps {
    // isDesktop:boolean
}

export const NavigationBar = (props:NavigationBarProps) => {

    const dispatch = useDispatch();
    const user = useSelector(userSelector);

    const handleLogoutClick = () => {
        dispatch(setUser(null))
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