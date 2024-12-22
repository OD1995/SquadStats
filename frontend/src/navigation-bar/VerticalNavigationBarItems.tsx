import { Link } from "react-router-dom"
import { User } from "../types/User"
import { MouseEventHandler } from "react"

interface VerticalNavigationBarItemsProps {
    user:User|null
    handleLogoutClick:MouseEventHandler
    handleItemSelection:MouseEventHandler
}

export const VerticalNavigationBarItems = (props:VerticalNavigationBarItemsProps) => {
    return (
        <>
            <Link onClick={props.handleItemSelection} to="/about" className="navigation-bar-link">
                About
            </Link>
            {
                (!props.user) ? (
                    <>
                        <Link to="/login" onClick={props.handleItemSelection} className="navigation-bar-link">
                            Login
                        </Link>
                        <Link to="/register" onClick={props.handleItemSelection} className="navigation-bar-link">
                            Register
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to="/about" onClick={props.handleLogoutClick}  className="navigation-bar-link">
                            Logout
                        </Link>
                        <Link to="/my-clubs" onClick={props.handleItemSelection} className="navigation-bar-link">
                            My Clubs
                        </Link>
                        <Link to="/add-club" onClick={props.handleItemSelection} className="navigation-bar-link">
                            Add Club
                        </Link>
                    </>
                )
            }
        </>
    )
}