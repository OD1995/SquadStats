import { User } from "../types/User"
import { VerticalNavigationBarItems } from "./VerticalNavigationBarItems"

interface DesktopNavigationBarProps {
    user:User|null
    handleLogoutClick:Function
}

export const DesktopNavigationBar = (props:DesktopNavigationBarProps) => {
    return (
        <div
            id='desktop-navigation-bar-parent'
            className="navigation-bar-parent"
        >
            <img
                id='desktop-navigation-bar-logo'
                className='navigation-bar-logo'
                src="/logos/rectangle.png"
            />
            <VerticalNavigationBarItems
                user={props.user}
                handleLogoutClick={props.handleLogoutClick}
            />
        </div>
    )
}