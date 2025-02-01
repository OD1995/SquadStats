import { ReactNode, useEffect, useState } from "react"
import { Link } from "react-router-dom";
import "./AdviceBar.css"

interface OwnProps {
    noLinkedTeams?:boolean
    noRows?:boolean
}

export const AdviceBar = (props:OwnProps) => {

    const [content, setContent] = useState<ReactNode>(null);

    
    useEffect(
        () => {
            if (props.noLinkedTeams) {
                const clubId = window.location.pathname.split("/")[2];
                const linkUrl = `/club/${clubId}/teams`;
                const addTeams = (
                    <>
                        Looks like you have no teams linked to your club, you can
                        change that on the <Link to={linkUrl}>Teams</Link> page
                    </>
                )
                setContent(addTeams);
            }
        },
        []
    )

    return (
        <div id='advice-bar-parent'>
            <div id='advice-bar'>
                {content}
            </div>
        </div>
    )
}