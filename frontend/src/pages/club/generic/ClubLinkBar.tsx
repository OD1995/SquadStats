import { useParams } from "react-router-dom"
import { LinkBarInfo } from "../../../types/LinkBarInfo";
import { LinkBar } from "../../../generic/LinkBar";

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
                label: 'Player Leaderboards',
                to: `/club/${clubId}/players`
            }
        ] as LinkBarInfo[];
        return links;
    }

    return (
        <LinkBar
            links={getLinks()}
            isClubAdmin={props.isClubAdmin}
        />
    )
}