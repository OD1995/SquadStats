import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Team } from "../../types/Team";
import { useSelector } from "react-redux";
import { userSelector } from "../../store/slices/userSlice";
import { getTeam } from "../../helpers/other";
import TeamService from "../../services/TeamService";
import { BackendResponse } from "../../types/BackendResponse";
import { Season } from "../../types/Season";
import "./TeamScrape.css";

export const TeamScrape = () => {

    const [team, setTeam] = useState<Team>();
    const [errorMessage, setErrorMessage] = useState("");
    const [getMatchesButtonDisabled, setGetMatchesButtonDisabled] = useState(false);
    const [scrapeMatchesButtonDisabled, getScrapeMatchesButtonDisabled] = useState(true);
    const [selectedSeason, setSelectedSeason] = useState("");
    const [seasons, setSeasons] = useState([]);

    let { teamId } = useParams();
    const user = useSelector(userSelector);


    useEffect(
        () => {
            var _team_ = getTeam(user, teamId);
            if (_team_) {
                setTeam(_team_);
            } else {
                TeamService.getTeamInformation(
                    teamId!
                ).then(
                    (res:BackendResponse) => {
                        if (res.success) {
                            setTeam(res.data);
                        } else {
                            setErrorMessage(res.data.message);
                        }
                    }
                )
            }
            TeamService.getTeamSeasons(
                teamId!
            ).then(
                (res:BackendResponse) => {
                    if (res.success) {
                        setSeasons(res.data);
                        setSelectedSeason(res.data[0].season_id);
                    } else {
                        setErrorMessage(res.data.message);
                    }
                }
            )
        },
        []
    )

    const handleGetMatchesButtonPress = () => {
        TeamService.getTeamMatches(
            teamId!,
            selectedSeason
        ).then(
            (res:BackendResponse) => {

            }
        )
    }

    const handleScrapeMatchesButtonPress = () => {

    }

    const handleSeasonSelect = (event:SelectChangeEvent) => {
        setSelectedSeason(event.target.value as string);
    }

    return (
        <div id='team-scrape-parent'>
            <h1 className="big-h1-title">
                {team?.team_name}
            </h1>
            <div id='team-scrape-content'>
                <div id='team-scrape-input-parent'>
                    <div id='team-scrape-season-div' className="team-scrape-input-row">
                        <strong>
                            Season
                        </strong>
                        <FormControl>
                            <Select
                                value={selectedSeason}
                                onChange={handleSeasonSelect}
                            >
                                {
                                    seasons.map(
                                        (season:Season) => {
                                            return (
                                                <MenuItem
                                                    key={season.season_id}
                                                    value={season.season_id}
                                                >
                                                    {season.season_name}
                                                </MenuItem>
                                            )
                                        }
                                    )
                                }
                            </Select>
                        </FormControl>
                    </div>
                    <div id='team-scrape-buttons-div' className="team-scrape-input-row">
                            <button
                                className={"ss-grey-button" + (getMatchesButtonDisabled ? " disabled-button" : "")}
                                onClick={() => handleGetMatchesButtonPress()}
                                disabled={getMatchesButtonDisabled}
                            >
                                Get Matches
                            </button>
                            <button
                                className={"ss-green-button" + (scrapeMatchesButtonDisabled ? " disabled-button" : "")}
                                onClick={() => handleScrapeMatchesButtonPress()}
                                disabled={scrapeMatchesButtonDisabled}
                            >
                                Scrape Matches
                            </button>
                    </div>
                </div>
            </div>
        </div>
    );
}