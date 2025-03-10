import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MatchService from "../../services/MatchService";
import { BackendResponse } from "../../types/BackendResponse";
import { Loading } from "../../generic/Loading";
import "./MatchView.css"
import { MatchData } from "../../types/MatchData";
import { MatchInfoSection } from "./MatchInfoSection";
import { BetterTable } from "../../generic/BetterTable";

export const MatchView = () => {

    const [matchData, setMatchData] = useState<MatchData|null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(true);

    let { matchId } = useParams();

    useEffect(
        () => {
            MatchService.getMatchInfo(
                matchId!
            ).then(
                (res:BackendResponse) => {
                    if (res.success) {
                        setMatchData(res.data);
                    } else {
                        setErrorMessage(res.data.message);
                    }
                    setIsLoading(false);
                }
            )
        },
        []
    )

    if (isLoading) {
        return (
            <div id='match-view-parent'>
                <Loading/>
            </div>
        )
    } else if (matchData == null) {
        return (
            <div id='match-view-parent' className="error-message">
                {errorMessage}
            </div>
        )
    } else {
        return (        
            <div id='match-view-parent'>
                <MatchInfoSection
                    match={matchData.match_info}
                    teamName={matchData.team_name}
                    competitionFullName={matchData.competition_full_name}
                />
                <BetterTable
                    {...matchData.player_data}
                    rowsPerPage={1000}
                />
            </div>
        )
    }
}