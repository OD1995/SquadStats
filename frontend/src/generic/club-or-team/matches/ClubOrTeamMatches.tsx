import { ClubLinkBar } from "../../../pages/club/generic/ClubLinkBar";
import { TeamLinkBar } from "../../../pages/team/generic/TeamLinkBar";
import { Club } from "../../../types/Club";
import { Team } from "../../../types/Team";
import "./ClubOrTeamMatches.css";
import { MatchesFilter } from "./MatchesFilter";

interface OwnProps {
    club?:Club
    team?:Team
    isClubAdmin:boolean
    errorMessage:string
    setErrorMessage:Function
}

export const ClubOrTeamMatches = (props:OwnProps) => {
    return (
        <div id='cot-matches-parent' className="parent-div">
            <h1 className="big-h1-title">
                {props.team?.team_name ?? props.club?.club_name}
            </h1>
            <div id='cot-matches-content'>
                {
                    props.club ? (
                        <ClubLinkBar
                            isClubAdmin={props.isClubAdmin}
                        />
                    ) : (
                        <TeamLinkBar
                            isClubAdmin={props.isClubAdmin}
                            clubId={props.team?.club_id!}
                        />
                    )
                }
                <MatchesFilter
                    club={props.club}
                    team={props.team}
                    setErrorMessage={props.setErrorMessage}
                />
                <div>
                    {props.errorMessage}
                </div>
            </div>
        </div>
    );
}