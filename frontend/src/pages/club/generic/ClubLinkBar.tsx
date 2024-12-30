import { useParams } from "react-router-dom"
import { LinkBarInfo } from "../../../types/LinkBarInfo";
import { ClubOrTeamLinkBar } from "../../../generic/club-or-team/ClubOrTeamLinkBar";

interface OwnProps {
    isClubAdmin:boolean
}

export const ClubLinkBar = (props:OwnProps) => {

    let { clubId } = useParams();

    const getLinks = () => {
        var links = [
            {
                label: 'Club Overview',
                to: `/club/${clubId}/overview`
            },
            {
                label: 'Matches',
                to: `/club/${clubId}/matches`
            },
            {
                label: 'Players',
                to: `/club/${clubId}/players`
            }
        ] as LinkBarInfo[];
        return links;
    }

    return (
        <ClubOrTeamLinkBar
            links={getLinks()}
        />
    )
}