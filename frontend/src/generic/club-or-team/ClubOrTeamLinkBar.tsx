import { Link, useLocation } from "react-router-dom"
import { LinkBarInfo } from "../../types/LinkBarInfo"
import "./ClubOrTeamLinkBar.css"
import { isWiderThanHigher } from "../../helpers/windowDimensions"
import { generateId } from "../../helpers/other"

interface OwnProps {
    links:LinkBarInfo[]
}

export const ClubOrTeamLinkBar = (props:OwnProps) => {

    const isDesktop = isWiderThanHigher();
    const location = useLocation();

    const getClassName = (linkStr:string) => {
        var cn = "cot-link";
        const pathName = location.pathname;
        if (pathName == linkStr) {
            cn += " current-cot-link";
        }
        return cn;
    }

    return (
        <div className={'cot-link-bar' + (isDesktop ? "" : " mobile-cot-link-bar")}>
            {
                props.links.map(
                    (link:LinkBarInfo) => {
                        return (
                            <Link
                                key={generateId()}
                                to={link.to}
                                className={getClassName(link.to)}
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