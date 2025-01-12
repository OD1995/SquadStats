import { useState } from "react";
import { Club } from "../../../types/Club";
import { Team } from "../../../types/Team";
import { MatchesOrPlayersFilter } from "../filters/MatchesOrPlayersFilter";
import { LeaderboardTypeFilter } from "./LeaderboardTypeFilter";

interface OwnProps {
    club?:Club
    team?:Team
    setErrorMessage:Function
    setTableData:Function
    setIsLoading:Function
}

export const PlayersFilter = (props:OwnProps) => {

    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [filtersErrorMessage, setFiltersErrorMessage] = useState<string>("");

    const [selectedMetric, setSelectedMetric] = useState<string>("");
    const [perGame, setPerGame] = useState<boolean>(false);
    const [splitBy, setSplitBy] = useState<string>("");

    const handleModalClose = () => {

    }

    const handleSubmitClick = () => {

    }

    const content = (
        <>
            <LeaderboardTypeFilter
                metric={selectedMetric}
                setMetric={setSelectedMetric}
                perGame={perGame}
                setPerGame={setPerGame}
                splitBy={splitBy}
                setSplitBy={setSplitBy}
            />
            <div id='mop-filter-button-div'>
                <button
                    className="ss-green-button"
                    onClick={handleSubmitClick}
                >
                    Submit
                </button>
            </div>
            {
                (filtersErrorMessage.length > 0) && (
                    <div style={{color:"red"}}>{filtersErrorMessage}</div>
                )
            }
        </>
    )

    return (
        <MatchesOrPlayersFilter
            {...props}
            filterTitle="LEADERBOARD"
            handleModalClose={handleModalClose}
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
            content={content}
        />
    )
}