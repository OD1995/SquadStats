import { useEffect, useState } from "react";
import { Club } from "../../../types/Club";
import { Team } from "../../../types/Team";
import { MatchesOrPlayersFilter } from "../filters/MatchesOrPlayersFilter";
import { LeaderboardTypeFilter } from "./LeaderboardTypeFilter";
import { SPLIT_BY_TYPE } from "../../../types/enums";
import PlayerService from "../../../services/PlayerService";
import { BackendResponse } from "../../../types/BackendResponse";
import { useSearchParams } from "react-router-dom";

interface OwnProps {
    club?:Club
    team?:Team
    setErrorMessage:Function
    setTableData:Function
    setIsLoading:Function
}

export const PlayersFilter = (props:OwnProps) => {

    const [metric, setMetric] = useState<string>("");
    const [playersSplitBy, setPlayersSplitBy] = useState<string>(SPLIT_BY_TYPE.NA);
    const [perGame, setPerGame] = useState<boolean>(false);
    const [minApps, setMinApps] = useState<number>(10);
    const [minGoals, setMinGoals] = useState<number>(10);

    const [searchParams, _] = useSearchParams();

    useEffect(
        () => {
            if (searchParams.get("metric")) {
                setMetric(searchParams.get("metric")!);
                retrieveData(searchParams.toString());
            }
            if (searchParams.get("perGame")) {
                var val = searchParams.get("perGame")!;
                if (val == "True") {
                    setPerGame(true);
                } else if (val == "False") {
                    setPerGame(false);
                }
            }
            if (searchParams.get("minApps")) {
                setMinApps(Number(searchParams.get("minApps")));
            }
            if (searchParams.get("minGoals")) {
                setMinGoals(Number(searchParams.get("minGoals")));
            }
            if (searchParams.get("splitBy")) {
                setPlayersSplitBy(searchParams.get("splitBy")!);
            }
        },
        []
    )

    const retrieveData = (searchParams:string) => {
        props.setIsLoading(true);
        props.setErrorMessage("");
        PlayerService.getLeaderboardData(
            searchParams,
            props.club?.club_id,
            props.team?.team_id
        ).then(
            (res:BackendResponse) => {
                if (res.success) {
                    props.setTableData(res.data);
                } else {
                    props.setErrorMessage(res.data.message);
                }
                props.setIsLoading(false);
            }
        )   
    }

    const firstSelector = (
        <LeaderboardTypeFilter
            metric={metric}
            setMetric={setMetric}
            perGame={perGame}
            setPerGame={setPerGame}
            splitBy={playersSplitBy}
            setSplitBy={setPlayersSplitBy}
            team={props.team}
            club={props.club}
        />
    )

    return (
        <MatchesOrPlayersFilter
            {...props}
            filterTitle="LEADERBOARD"
            firstSelector={firstSelector}
            selectedSplitBy={playersSplitBy}
            metric={metric}
            retrieveData={retrieveData}
            players
            perGame={perGame}
            minApps={minApps}
            setMinApps={setMinApps}
            minGoals={minGoals}
            setMinGoals={setMinGoals}
        />
    )
}