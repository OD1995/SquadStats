import { Match } from "../../types/Match"
import { CompetitionDetails } from "./CompetitionDetails"
import { MatchScore } from "./MatchScore"
import { SchedulingInformation } from "./SchedulingInformation"

interface OwnProps {
    match:Match
    teamName:string
    competitionFullName:string
    leagueName:string
    seasonName:string
}

export const MatchInfoSection = (props:OwnProps) => {
    return (
        <div id='match-info-section'>
            <CompetitionDetails
                leagueName={props.leagueName}
                seasonName={props.seasonName}
                competitionFullName={props.competitionFullName}
            />
            <MatchScore
                teamName={props.teamName}
                oppoTeamName={props.match.opposition_team_name}
                homeAwayNeutral={props.match.home_away_neutral}
                goalsFor={props.match.goals_for}
                goalsAgainst={props.match.goals_against}
                pensFor={props.match.pens_for}
                pensAgainst={props.match.pens_against}
            />
            <SchedulingInformation
                date={props.match.date}
                time={props.match.time}
                location={props.match.location}
            />
        </div>
    )
}