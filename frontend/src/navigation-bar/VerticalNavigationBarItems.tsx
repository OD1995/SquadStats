import { User } from "../types/User"
import { MouseEventHandler } from "react"
import { VerticalNavigationBarTopItems } from "./VerticalNavigationBarTopItems"
import { VerticalNavigationBarBottomItems } from "./VerticalNavigationBarBottomItems"

export interface VerticalNavigationBarItemsProps {
    user:User|null
    handleLogoutClick:MouseEventHandler
    handleItemSelection:MouseEventHandler
    isDesktop?:boolean
}

export const VerticalNavigationBarItems = (props:VerticalNavigationBarItemsProps) => {
    return (
        <div
            id='vertical-navigation-bar'
            style={{height: props.isDesktop ? "83vh" : "82vh"}}
        >
            <VerticalNavigationBarTopItems
                {...props}
            />
            <VerticalNavigationBarBottomItems
                {...props}
            />
        </div>
    )
}