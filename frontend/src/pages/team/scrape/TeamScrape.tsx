import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Team } from "../../../types/Team";
import { useSelector } from "react-redux";
import { userSelector } from "../../../store/slices/userSlice";
import { getTeam } from "../../../helpers/other";
import TeamService from "../../../services/TeamService";
import { BackendResponse } from "../../../types/BackendResponse";
import { Season } from "../../../types/Season";
import "./TeamScrape.css";
import { Match } from "../../../types/Match";
import { MatchInfoView } from "./MatchInfoView";
import { PlayerInfoView } from "./PlayerInfoView";
import MatchService from "../../../services/MatchService";

export const TeamScrape = () => {

    const [team, setTeam] = useState<Team>();
    const [errorMessage, setErrorMessage] = useState("");
    const [getMatchesButtonDisabled, setGetMatchesButtonDisabled] = useState(false);
    const [scrapeMatchesButtonDisabled, setScrapeMatchesButtonDisabled] = useState(true);
    const [startScrapeButtonDisabled, setStartScrapeButtonDisabled] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState("");
    const [seasons, setSeasons] = useState([]);
    const [isPlayerInfoView, setIsPlayerInfoView] = useState<boolean>(false);
    const [successMatches, setSuccessMatches] = useState<Match[]>([]);
    const [errorMatches, setErrorMatches] = useState<Match[]>([]);
    const [tickedBoxes, setTickedBoxes] = useState<boolean[]>([]);

    let { teamId } = useParams();
    const user = useSelector(userSelector);
    const navigate = useNavigate();

    useEffect(
        () => {
            if (!user) {
                navigate("/about");
            } else {
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
            }
        },
        []
    )

    const handleGetMatchesButtonPress = () => {
        setGetMatchesButtonDisabled(true);
        setErrorMessage("");
        TeamService.getTeamMatches(
            teamId!,
            selectedSeason
        ).then(
            (res:BackendResponse) => {
                if (res.success) {
                    const matches:Match[] = res.data;
                    handlePostScrape(matches);
                    setScrapeMatchesButtonDisabled(false);
                } else {
                    setErrorMessage(res.data.message);
                }
                setGetMatchesButtonDisabled(false);
            }
        )
    }

    const handlePostScrape = (matches:Match[]) => {
        var goods = []
        var bads = [];
        for (const match of matches) {
            if (match.match_errors.length == 0) {
                goods.push(match);
            } else {
                bads.push(match);
            }
        }
        setSuccessMatches(goods);
        setErrorMatches(bads);
    }

    const handleScrapeMatchesButtonPress = () => {
        setIsPlayerInfoView(true);
    }

    const handleSeasonSelect = (event:SelectChangeEvent) => {
        setSelectedSeason(event.target.value as string);
    }

    const handleStartScrapeButtonPress = () => {
        setStartScrapeButtonDisabled(true);
        var matchIds = [];
        for (const [idx, match] of successMatches.entries()) {
            if (tickedBoxes[idx]) {
                matchIds.push(match.match_id)
            }
        }
        MatchService.saveTeamNames(
            matchIds
        ).then(
            (response:BackendResponse) => {
                if (response.success) {
                    const matches:Match[] = response.data;
                    handlePostScrape(matches);
                } else {
                    setErrorMessage(response.data.message);
                }
            }
        )
    }

    const successCols = [
        'Date',
        'Time',
        'Opposition',
        'Competition',
        'Goals For',
        'Goals Against',
        'Player Info Already Scraped'
    ]

    return (
        <div id='team-scrape-parent'>
            <h1 className="big-h1-title">
                {team?.team_name}
            </h1>
            <div id='team-scrape-content'>
                <div id='team-scrape-input-parent'>
                    <div id='team-scrape-season-div' className="team-scrape-input-row">
                        <strong id='team-scrape-season-label'>
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
                                className={"ss-green-button" + (getMatchesButtonDisabled ? " disabled-button" : "")}
                                onClick={handleGetMatchesButtonPress}
                                disabled={getMatchesButtonDisabled}
                            >
                                Get Match Info
                            </button>
                            <button
                                className={"ss-green-button" + (scrapeMatchesButtonDisabled ? " disabled-button" : "")}
                                onClick={handleScrapeMatchesButtonPress}
                                disabled={scrapeMatchesButtonDisabled}
                            >
                                Scrape Player Info
                            </button>
                            {
                                isPlayerInfoView && (                                    
                                    <button
                                        className={"ss-green-button" + (startScrapeButtonDisabled ? " disabled-button" : "")}
                                        onClick={handleStartScrapeButtonPress}
                                        disabled={startScrapeButtonDisabled}
                                    >
                                        Start Scrape
                                    </button>
                                )
                            }
                    </div>
                </div>
                <p>
                    {errorMessage}
                </p>
                {
                    isPlayerInfoView ? (
                        <PlayerInfoView
                            successMatches={successMatches}
                            cols={successCols}
                            tickedBoxes={tickedBoxes}
                            setTickedBoxes={setTickedBoxes}
                        />
                    ) : (
                        <MatchInfoView
                            successMatches={successMatches}
                            errorMatches={errorMatches}
                            successCols={successCols}
                        />
                    )
                }
            </div>
        </div>
    );
}