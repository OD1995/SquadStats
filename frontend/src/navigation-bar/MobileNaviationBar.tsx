import { Menu, MenuOpen } from "@mui/icons-material";
import { User } from "../types/User";
import { useState } from "react";
import { VerticalNavigationBarItems } from "./VerticalNavigationBarItems";

interface MobileNavigationBarProps {
    user:User|null
    handleLogoutClick:Function
}

export const MobileNavigationBar = (props:MobileNavigationBarProps) => {

    const [folded, setFolded] = useState(true);

    const logoutClick = () => {
        setFolded(true);
        props.handleLogoutClick();
    }

    const itemClick = () => {
        setFolded(true);
    }

    return (
        <>
            <div
                id='mobile-navigation-bar-parent'
                className="navigation-bar-parent"
            >
                <img
                    id='mobile-navigation-bar-logo'
                    className='navigation-bar-logo'
                    src="/logos/rectangle.png"
                />
                {
                    folded ? (
                        <Menu
                            id='closed-hamburger-menu'
                            className="hamburger-menu"
                            onClick={() => setFolded(false)}
                        />
                    ) : (
                        <MenuOpen
                            id='opened-hamburger-menu'
                            className="hamburger-menu"
                            onClick={() => setFolded(true)}
                        />
                    )
                }
            </div>
            {
                (!folded) && (
                    <div id='unfolded-mobile-navigation-bar'>
                        <VerticalNavigationBarItems
                            user={props.user}
                            handleLogoutClick={logoutClick}
                            handleItemSelection={itemClick}
                        />
                    </div>
                )
            }
        </>
    )
}