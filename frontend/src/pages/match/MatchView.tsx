import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MatchService from "../../services/MatchService";
import { BackendResponse } from "../../types/BackendResponse";
import { Loading } from "../../generic/Loading";
import "./MatchView.css"
import { MatchData } from "../../types/MatchData";
import { MatchInfoSection } from "./MatchInfoSection";
import { BetterTable } from "../../generic/BetterTable";
import { getUserLS } from "../../authentication/auth";
import { Team } from "../../types/Team";
import { getBigTitle, getIsClubAdmin } from "../../helpers/other";
import { DATA_SOURCE } from "../../types/enums";
import { TeamLinkBar } from "../team/generic/TeamLinkBar";
import { Modal } from "../../generic/Modal";
import { MatchReportContent } from "./MatchReportContent";

export const MatchView = () => {

    const [matchData, setMatchData] = useState<MatchData|null>(null);
    const [team, setTeam] = useState<Team>();
    // const [leagueSeasonId, setLeagueSeasonId] = useState<string>();
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isEditable, setIsEditable] = useState<boolean>(false);
    const [isClubAdmin, setIsClubAdmin] = useState<boolean>(false);
    const [clubId, setClubId] = useState<string>();
    const [hasMatchReport, setHasMatchReport] = useState<boolean>(false);
    const [showMatchReport, setShowMatchReport] = useState<boolean>(false);

    let { matchId } = useParams();
    const user = getUserLS();

    useEffect(
        () => {
            MatchService.getMatchInfo(
                matchId!
            ).then(
                (res:BackendResponse) => {
                    if (res.success) {
                        const md = res.data as MatchData;
                        setMatchData(md);
                        const ica = getIsClubAdmin(user, md.team.club_id)
                        setIsClubAdmin(ica);
                        setClubId(md.team.club_id);
                        setTeam(md.team);
                        if (ica && (md.team.data_source_id == DATA_SOURCE.MANUAL)) {
                            setIsEditable(true);
                        }
                        if (md.match_info.match_report_image_ids || md.match_info.match_report_text) {
                            setHasMatchReport(true);
                        }
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
            <div className="page-parent">
                {getBigTitle(team?.team_name)}
                <TeamLinkBar
                    isClubAdmin={isClubAdmin}
                    clubId={clubId!}
                    team={team!}
                />
                <div id='match-view-parent'>
                    <MatchInfoSection
                        match={matchData.match_info}
                        teamName={matchData.team_name}
                        competitionFullName={matchData.competition_full_name}
                    />
                    <div id='match-view-links'>
                        {
                            isEditable && (
                                <Link
                                    className="match-view-link"
                                    to={`/team/${matchData.team?.team_id}/update-match/${matchData.league_season_id}/${matchId}`}
                                >
                                    Edit
                                </Link>
                            )
                        }
                        {
                            hasMatchReport && (
                                <a
                                    className="match-view-link"
                                    onClick={() => setShowMatchReport(true)}
                                >
                                    View Match Report
                                </a>
                            )
                        }

                    </div>
                    <BetterTable
                        {...matchData.player_data}
                        rowsPerPage={1000}
                    />
                </div>
                {
                    showMatchReport && (
                        <Modal
                            content={
                                <MatchReportContent
                                    matchData={matchData}
                                />
                            }
                            handleModalClose={() => setShowMatchReport(false)}
                        />
                    )
                }
            </div>
        )
    }
}