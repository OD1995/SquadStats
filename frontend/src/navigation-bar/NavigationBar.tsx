import { useDispatch, useSelector } from "react-redux"
import { refreshSelector, setUser, triggerRefresh, userSelector } from "../store/slices/userSlice"
import { MobileNavigationBar } from "./MobileNaviationBar"
import "./NavigationBar.css"
import { isWiderThanHigher } from "../helpers/windowDimensions"
import { DesktopNavigationBar } from "./DesktopNavigationBar"
import { getUserLS, setUserLS } from "../authentication/auth"
import { useState } from "react"

interface NavigationBarProps {
    // isDesktop:boolean
}

export const NavigationBar = (props:NavigationBarProps) => {

    // const [refresh, setRefresh] = useState<number>(0);
    const dispatch = useDispatch();
    // const user = useSelector(userSelector);
    const user = getUserLS();
    const refreshCounter = useSelector(refreshSelector);

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