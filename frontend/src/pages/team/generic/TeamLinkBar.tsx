import { useParams } from "react-router-dom"
import { LinkBarInfo } from "../../../types/LinkBarInfo";
import { LinkBar } from "../../../generic/LinkBar";
import { Team } from "../../../types/Team";
import { SPLIT_BY_TYPE } from "../../../types/enums";

interface OwnProps {
    isClubAdmin:boolean
    clubId:string
    team:Team
}

export const TeamLinkBar = (props:OwnProps) => {

    let { teamId } = useParams();
    
    const getLinks = () => {
        var links = [
            {
                label: 'Club Overview',
                to: `/club/${props.clubId}/overview`
            },
            {
                label: 'Team Overview',
                to: `/team/${teamId}/overview`
            },
            {
                label: 'Players',
                to: `/team/${teamId}/players`
            }
        ] as LinkBarInfo[];
        if (props.isClubAdmin) {
            links.push(
                {
                    label: 'Update Matches',
                    to: `/team/${teamId}/update-data`,
                    adminRequired: true
                }
            )
        }
        links = links.concat(
            [
                {
                    label: 'Matches',
                    to: `/team/${teamId}/matches?splitBy=${SPLIT_BY_TYPE.NA}`
                },
                {
                    label: 'Player Leaderboards',
                    to: `/team/${teamId}/player-leaderboards`
                }
            ]
        )
        return links;
    }
    
    return (
        <LinkBar
            links={getLinks()}
            isClubAdmin={props.isClubAdmin}
        />
    )
}