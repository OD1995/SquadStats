import { useNavigate, useParams } from "react-router-dom";
import { getUserLS } from "../../../authentication/auth";
import { Team } from "../../../types/Team";
import { useEffect, useState } from "react";
import { getTeam } from "../../../helpers/other";
import SeasonService from "../../../services/SeasonService";
import { BackendResponse } from "../../../types/BackendResponse";
import { DATA_SOURCE } from "../../../types/enums";
import { TeamScrape } from "./TeamScrape";
import { ManualDataEntry } from "./ManualDataEntry";
import { Season } from "../../../types/Season";
import { League } from "../../../types/League";

export const UpdateData = () => {

    const [team, setTeam] = useState<Team>();
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [selectedSeason, setSelectedSeason] = useState("");
    const [leagues, setLeagues] = useState<League[]>([]);
    const [selectedLeague, setSelectedLeague] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    let { teamId } = useParams();
    const user = getUserLS();
    const navigate = useNavigate();

    useEffect(
        () => {
            if (!user) {
                navigate("/about");
            } else {
                const _team_ = getTeam(user, teamId);
                setTeam(_team_!);
                SeasonService.getTeamLeaguesAndSeasons(
                    teamId!
                ).then(
                    (res:BackendResponse) => {
                        if (res.success) {
                            const ssns = res.data.seasons as Season[]
                            setSeasons(ssns);
                            const lgs = res.data.leagues as League[]
                            setLeagues(lgs);
                            if (ssns.length > 0) {
                                setSelectedSeason(ssns[0].season_id);
                            }
                            if (lgs.length > 0) {
                                setSelectedSeason(lgs[0].league_id);
                            }
                        } else {
                            setErrorMessage(res.data.message);
                        }
                    }
                )
            }
        },
        []
    )

    if (team) {
        if (team?.data_source_id == DATA_SOURCE.MANUAL) {
            return (
                <ManualDataEntry
                    team={team}
                    seasons={seasons}
                    selectedSeason={selectedSeason}
                    setSelectedSeason={setSelectedSeason}
                    leagues={leagues}
                    selectedLeague={selectedLeague}
                    setSelectedLeague={setSelectedLeague}
                />
            )
        } else {
            return (
                <TeamScrape
                    team={team}
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                    seasons={seasons}
                    setSeasons={setSeasons}
                    selectedSeason={selectedSeason}
                    setSelectedSeason={setSelectedSeason}
                />
            )
        }
    }

    return null;
}