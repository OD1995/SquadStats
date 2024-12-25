import { useParams } from "react-router-dom"
import { ClubOrTeamLinkBar } from "../../../generic/ClubOrTeamLinkBar";
import { LinkBarInfo } from "../../../types/LinkBarInfo";

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