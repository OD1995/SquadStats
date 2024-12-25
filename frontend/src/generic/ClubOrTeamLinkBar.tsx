import { Link } from "react-router-dom"
import { LinkBarInfo } from "../types/LinkBarInfo"
import "./ClubOrTeamLinkBar.css"
import { isWiderThanHigher } from "../helpers/windowDimensions"
import { generateId } from "../helpers/other"

interface OwnProps {
    links:LinkBarInfo[]
}

export const ClubOrTeamLinkBar = (props:OwnProps) => {

    const isDesktop = isWiderThanHigher();

    return (
        <div className={'cot-link-bar' + (isDesktop ? "" : " mobile-cot-link-bar")}>
            {
                props.links.map(
                    (link:LinkBarInfo) => {
                        return (
                            <Link
                                key={generateId()}
                                to={link.to}
                                className="cot-link"
                            >
                                {link.label}
                            </Link>
                        )
                    }
                )
            }
        </div>
    )
}