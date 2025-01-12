import { Club } from "../../../types/Club";
import { Team } from "../../../types/Team";
import { MatchesOrPlayersFilter } from "../filters/MatchesOrPlayersFilter";

interface OwnProps {
    club?:Club
    team?:Team
    setErrorMessage:Function
    setTableData:Function
    setIsLoading:Function
}

export const MatchesFilter = (props:OwnProps) => {

    return (
        <MatchesOrPlayersFilter
            {...props}
            filterTitle="MATCHES"
        />
    )
}