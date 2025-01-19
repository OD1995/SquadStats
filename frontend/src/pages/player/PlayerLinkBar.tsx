import { SplitByFilter } from "../../generic/club-or-team/filters/SplitByFilter"
import { LinkBar } from "../../generic/LinkBar"
import { SPLIT_BY_TYPE } from "../../types/enums"
import { LinkBarInfo } from "../../types/LinkBarInfo"

interface OwnProps {
    isClubAdmin:boolean
    playerId:string
    clubId:string
}

export const PlayerLinkBar = (props:OwnProps) => {

    const getLinks = () => {
        var links = [
            {
                label: 'Player Overview',
                to: `/player/${props.playerId}/overview`
            },
            {
                label: 'Club Overview',
                to: `/club/${props.clubId}/overview`
            },
            {
                label: 'Teams',
                to: `/player/${props.playerId}/teams`
            },
            {
                label: 'Player Matches',
                to: `/club/${props.clubId}/matches?splitBy=${SPLIT_BY_TYPE.NA}&playerIdFilter=${props.playerId}`
            },
            // {
            //     label: 'Player Leaderboards',
            //     to: `/club/${clubId}/players`
            // }
            {
                label: 'Edit Name',
                to: `/player/${props.playerId}/edit-name`
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