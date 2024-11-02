import { Link } from "react-router-dom"
import { User } from "../types/User"

interface VerticalNavigationBarItemsProps {
    user:User|null
    handleLogoutClick:Function
}

export const VerticalNavigationBarItems = (props:VerticalNavigationBarItemsProps) => {
    return (
        <>
            <Link to="/about" className="navigation-bar-link">
                About
            </Link>
            {
                (!props.user) ? (
                    <>
                        <Link to="/login" className="navigation-bar-link">
                            Login
                        </Link>
                        <Link to="/register" className="navigation-bar-link">
                            Register
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to="/about" onClick={() => props.handleLogoutClick()}  className="navigation-bar-link">
                            Logout
                        </Link>
                        <Link to="/my-clubs" className="navigation-bar-link">
                            My Clubs
                        </Link>
                        <Link to="/add-club" className="navigation-bar-link">
                            Add Club
                        </Link>
                    </>
                )
            }
        </>
    )
}