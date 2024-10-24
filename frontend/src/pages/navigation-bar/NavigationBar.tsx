import { Link } from "react-router-dom"
import "./NavigationBar.css"
import { useState } from "react"

export const NavigationBar = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <div id='navigation-bar-parent'>
            <img
                id='navigation-bar-logo'
                src="/logos/rectangle.png"
            />
            <Link to="/how-it-works" className="navigation-bar-link">
                How It Works
            </Link>
            {
                (!isLoggedIn) ? (
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
                        <Link to="/my-teams" className="navigation-bar-link">
                            My Teams
                        </Link>
                    </>
                )
            }
        </div>
    )
}