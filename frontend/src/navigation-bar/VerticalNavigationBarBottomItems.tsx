import { Link } from "react-router-dom"
import { VerticalNavigationBarItemsProps } from "./VerticalNavigationBarItems"

export const VerticalNavigationBarBottomItems = (props:VerticalNavigationBarItemsProps) => {
    return (
        <div id='vertical-navigation-bar-top' className="vertical-navigation-bar-section">
            <Link onClick={props.handleItemSelection} to="/change-log" className="navigation-bar-link">
                Change Log
            </Link>
            <Link onClick={props.handleItemSelection} to="/contact" className="navigation-bar-link">
                Contact
            </Link>
        </div>
    )
}