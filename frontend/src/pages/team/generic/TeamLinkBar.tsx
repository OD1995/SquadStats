import { Link, useParams } from "react-router-dom"
import "./TeamLinkBar.css"

interface OwnProps {
    isClubAdmin:boolean
}

export const TeamLinkBar = (props:OwnProps) => {

    let { teamId } = useParams();

    return (
        <div id='team-link-bar'>
            <Link
                to={`/team/${teamId}/scrape`}
                className="team-link"
            >
                Scrape
            </Link>
            <Link
                to={`/team/${teamId}/scrape`}
                className="team-link"
            >
                Team Stats
            </Link>
            <Link
                to={`/team/${teamId}/scrape`}
                className="team-link"
            >
                Player Stats
            </Link>
        </div>
    )
}