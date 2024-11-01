import { Link } from "react-router-dom"
import "./NavigationBar.css"
import { useState } from "react"
import { User } from "../../types/User"
import { useDispatch, useSelector } from "react-redux"
import { setUser, userSelector } from "../../store/slices/userSlice"
import UserManagementService from "../../services/UserManagementService"

export const NavigationBar = () => {

    const dispatch = useDispatch();
    const user = useSelector(userSelector);

    const handleLogoutClick = () => {
        dispatch(setUser(null))
    }

    return (
        <div id='navigation-bar-parent'>
            <img
                id='navigation-bar-logo'
                src="/logos/rectangle.png"
            />
            <Link to="/about" className="navigation-bar-link">
                About
            </Link>
            {
                (!user) ? (
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
                        <Link to="/about" onClick={() => handleLogoutClick()}  className="navigation-bar-link">
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
        </div>
    )
}