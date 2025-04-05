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
import { LeagueSeason } from "../../../types/Season";
import { League } from "../../../types/League";
import { Match } from "../../../types/Match";

export const UpdateData = () => {

    const [team, setTeam] = useState<Team>();
    const [seasons, setSeasons] = useState<LeagueSeason[]>([]);
    const [selectedLeagueSeason, setSelectedLeagueSeason] = useState<string>("");
    const [leagues, setLeagues] = useState<Record<string, League>>({});
    const [selectedLeague, setSelectedLeague] = useState("");
    // const [matches, setMatches] = useState<Match[]>([]);
    const [selectedMatch, setSelectedMatch] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState("");
    const [allLoaded, setAllLoaded] = useState<boolean>(false);

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
                            const ssns = res.data.seasons as LeagueSeason[];
                            setSeasons(ssns);
                            const lgs = res.data.leagues as Record<string, League>;
                            setLeagues(lgs);
                            if (ssns.length > 0) {
                                setSelectedLeagueSeason(ssns[0].season_id);
                            }
                            // if (lgs.length > 0) {
                            //     setSelectedLeague(lgs[0].league_id);
                            // }
                            // setSelectedLeague(getFirstLeagueId(lgs));
                        } else {
                            setErrorMessage(res.data.message);
                        }
                        setAllLoaded(true);
                    }
                )
            }
        },
        []
    )

    const getFirstLeagueId = (lgs:Record<string, League>) => {
        for (const lg of Object.values(lgs)) {
            return lg.league_id
        }
        return "";
    }

    if (team) {
        if (team?.data_source_id == DATA_SOURCE.MANUAL) {
            return (
                <ManualDataEntry
                    team={team}
                    leagues={leagues}
                    selectedLeague={selectedLeague}
                    setSelectedLeague={setSelectedLeague}
                    // seasons={seasons}
                    seasons={leagues[selectedLeague]?.league_seasons ?? {}}
                    selectedLeagueSeason={selectedLeagueSeason}
                    setSelectedLeagueSeason={setSelectedLeagueSeason}
                    matches={leagues[selectedLeague]?.league_seasons[selectedLeagueSeason]?.team_season.matches ?? []}
                    selectedMatch={selectedMatch}
                    setSelectedMatch={setSelectedMatch}
                    allLoaded={allLoaded}
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
                    selectedSeason={selectedLeagueSeason}
                    setSelectedSeason={setSelectedLeagueSeason}
                    allLoaded={allLoaded}
                />
            )
        }
    }

    return null;
}