import { FormControl, MenuItem, Select, SelectChangeEvent, Tooltip } from "@mui/material";
import { MouseEventHandler, useEffect, useState } from "react";
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

    const [viewCurrentMatchesDisabled, setViewCurrentMatchesDisabled] = useState(false);
    const [updateMatchInfoFromDataSourceDisabled, setUpdateMatchInfoFromDataSourceDisabled] = useState(true);
    const [selectMatchesToUpdateDisabled, setSelectMatchesToUpdateDisabled] = useState(true);
    const [startUpdateDisabled, setStartUpdateDisabled] = useState(true);
    
    const [team, setTeam] = useState<Team>();
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    
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

    const handleUpdateMatchInfoFromDataSourceButtonPress = () => {
        setUpdateMatchInfoFromDataSourceDisabled(true);
        setErrorMessage("");
        setIsLoading(true);
        MatchService.updateTeamMatches(
            teamId!,
            selectedSeason
        ).then(
            (res:BackendResponse) => {
                if (res.success) {
                    const matches:Match[] = res.data;
                    handleMatchesResponse(matches);
                    // setUpdatePlayerPerformanceDataDisabled(false);
                } else {
                    setErrorMessage(res.data.message);
                }
                setUpdateMatchInfoFromDataSourceDisabled(false);
                setIsLoading(false);
            }
        )
    }

    const handleMatchesResponse = (matches:Match[]) => {
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

    const handleSelectMatchesToUpdateButtonPress = () => {
        setIsPlayerInfoView(true);
    }

    const handleSeasonSelect = (event:SelectChangeEvent) => {
        setSelectedSeason(event.target.value as string);
    }

    const handleStartUpdateButtonPress = () => {
        setStartUpdateDisabled(true);
        setErrorMessage("");
        setIsLoading(true);
        var matchIds = [];
        for (const [idx, match] of successMatches.entries()) {
            if (tickedBoxes[idx]) {
                matchIds.push(match.match_id)
            }
        }
        MatchService.scrapeMatches(
            matchIds
        ).then(
            (response:BackendResponse) => {
                if (response.success) {
                    const matches:Match[] = response.data;
                    handleMatchesResponse(matches);
                    setIsPlayerInfoView(false);
                } else {
                    setErrorMessage(response.data.message);
                }
                setStartUpdateDisabled(false);
                setIsLoading(false);
            }
        )
    }

    const handleViewCurrentMatchesClick = () => {
        setViewCurrentMatchesDisabled(true);
        setIsLoading(true);
        setErrorMessage("");
        MatchService.getCurrentMatches(
            teamId!,
            selectedSeason
        ).then(
            (response:BackendResponse) => {
                if (response.success) {
                    const matches:Match[] = response.data;
                    handleMatchesResponse(matches);
                } else {
                    setErrorMessage(response.data.message)
                }
                setIsLoading(false);
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

    interface ButtonInfo {
        disabled:boolean
        handleClick:MouseEventHandler
        text:string
        title?:string
    }

    const generateButtons = () => {
        const buttonInfoArray = [
            {
                disabled: viewCurrentMatchesDisabled,
                handleClick: handleViewCurrentMatchesClick,
                text: 'View Current Matches',
                title: 'View all the matches which are already in the Squad Stats database'
            },
            {
                disabled: updateMatchInfoFromDataSourceDisabled,
                handleClick: handleUpdateMatchInfoFromDataSourceButtonPress,
                text: 'Update Match Info From Data Source',
                title: 'Update the match info for all the displayed matches from the data source'
            },
            {
                disabled: selectMatchesToUpdateDisabled,
                handleClick: handleSelectMatchesToUpdateButtonPress,
                text: 'Select Matches To Update Player Performance Data From Data Source',
                // title: ''
            },
            {
                disabled: startUpdateDisabled,
                handleClick: handleStartUpdateButtonPress,
                text: 'Start Update'
            }
        ] as ButtonInfo[];
        return (
            <>
                {
                    buttonInfoArray.map(
                        (buttonInfo:ButtonInfo) => {
                            return (
                                <Tooltip title={buttonInfo.title} placement="right">
                                    <button
                                        className={"ss-green-button ts-button" + (buttonInfo.disabled ? " disabled-button" : "")}
                                        onClick={buttonInfo.handleClick}
                                        disabled={buttonInfo.disabled}
                                    >
                                        {buttonInfo.text}
                                    </button>
                                </Tooltip>
                            )
                        }
                    )
                }
            </>
        )
    }

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
                    <div id='team-scrape-buttons-div'>
                        {generateButtons()}
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