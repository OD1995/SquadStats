import { useParams } from "react-router-dom"
import { LinkBarInfo } from "../../../types/LinkBarInfo";
import { LinkBar } from "../../../generic/LinkBar";
import { Team } from "../../../types/Team";

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
                    label: 'Update Data',
                    to: `/team/${teamId}/update-data`,
                    adminRequired: true
                }
            )
        }
        links = links.concat(
            [
                {
                    label: 'Matches',
                    to: `/team/${teamId}/matches`
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