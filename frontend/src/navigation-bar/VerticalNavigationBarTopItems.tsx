import { Link } from "react-router-dom"
import { VerticalNavigationBarItemsProps } from "./VerticalNavigationBarItems"

export const VerticalNavigationBarTopItems = (props:VerticalNavigationBarItemsProps) => {
    return (
        <div id='vertical-navigation-bar-top' className="vertical-navigation-bar-section">
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
                        {
                            (props.user.clubs.length > 0) && (
                                <Link to="/my-clubs" onClick={props.handleItemSelection} className="navigation-bar-link">
                                    My Clubs
                                </Link>
                            )
                        }
                        <Link to="/add-club" onClick={props.handleItemSelection} className="navigation-bar-link">
                            Add Club
                        </Link>
                    </>
                )
            }
        </div>
    )
}