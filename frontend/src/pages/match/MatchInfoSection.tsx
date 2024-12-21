import { Match } from "../../types/Match"
import { MatchScore } from "./MatchScore"
import { OtherMatchInfo } from "./OtherMatchInfo"

interface OwnProps {
    match:Match
    teamName:string
    competitionFullName:string
}

export const MatchInfoSection = (props:OwnProps) => {
    return (
        <div id='match-info-section'>
            <MatchScore
                teamName={props.teamName}
                oppoTeamName={props.match.opposition_team_name}
                homeAwayNeutral={props.match.home_away_neutral}
                goalsFor={props.match.goals_for}
                goalsAgainst={props.match.goals_against}
                pensFor={props.match.pens_for}
                pensAgainst={props.match.pens_against}
            />
            <OtherMatchInfo
                competitionFullName={props.competitionFullName}
                date={props.match.date}
                time={props.match.time}
                location={props.match.location}
            />
        </div>
    )
}