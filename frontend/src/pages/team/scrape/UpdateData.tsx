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

export const UpdateData = () => {

    const [team, setTeam] = useState<Team>();
    const [selectedSeason, setSelectedSeason] = useState("");
    const [seasons, setSeasons] = useState<Season[]>([]);
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
                SeasonService.getTeamSeasons(
                    teamId!
                ).then(
                    (res:BackendResponse) => {
                        if (res.success) {
                            setSeasons(res.data);
                            if (res.data.length > 0) {
                                setSelectedSeason(res.data[0].season_id);
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