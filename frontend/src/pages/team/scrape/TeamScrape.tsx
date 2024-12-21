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
import { TeamScrapeButtonColumn } from "./TeamScrapeButtonColumn";
import { TooltipButtonProps } from "../../../generic/TooltipButton";
import { Loading } from "../../../generic/Loading";
import SeasonService from "../../../services/SeasonService";
import { TeamLinkBar } from "../generic/TeamLinkBar";

export const TeamScrape = () => {

    const [viewCurrentMatchesDisabled, setViewCurrentMatchesDisabled] = useState(false);
    const [updateMatchInfoFromDataSourceDisabled, setUpdateMatchInfoFromDataSourceDisabled] = useState(true);
    const [selectMatchesToUpdateDisabled, setSelectMatchesToUpdateDisabled] = useState(true);
    const [startUpdateDisabled, setStartUpdateDisabled] = useState(true);
    const [updateListDisabled, setUpdateListDisabled] = useState(false);
    
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
                SeasonService.getTeamSeasons(
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
        setSuccessMatches([]);
        setErrorMatches([]);
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
        // setIsLoading(true);
        setIsPlayerInfoView(true);
        setStartUpdateDisabled(false);
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
                setViewCurrentMatchesDisabled(false);
                setUpdateMatchInfoFromDataSourceDisabled(false);
                setSelectMatchesToUpdateDisabled(false);
            }
        )
    }

    const handleUpdateListButtonPress = () => {
        setUpdateListDisabled(true);
        setIsLoading(true);
        setErrorMessage("");
        SeasonService.updateSeasons(
            teamId!
        ).then(
            (response:BackendResponse) => {
                if (response.success) {
                    setSeasons(response.data);
                    setSelectedSeason(response.data[0].season_id);
                } else {
                    setErrorMessage(response.data.message)
                }
                setIsLoading(false);
                setUpdateListDisabled(false);
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

    const matchInfoView = {
        buttonText: "View",
        disabled: viewCurrentMatchesDisabled,
        handleClick: handleViewCurrentMatchesClick,
        tooltipText: "View all the matches which are already in the Squad Stats database",
        placement: "top"
    } as TooltipButtonProps;

    const matchInfoUpdateAll = {
        buttonText: "Update All",
        disabled: updateMatchInfoFromDataSourceDisabled,
        handleClick: handleUpdateMatchInfoFromDataSourceButtonPress,
        tooltipText: "Update the match info and the list of matches from the data source",
        placement: "bottom"
    } as TooltipButtonProps;

    const playersSelectMatches = {
        buttonText: "Select Matches",
        disabled: selectMatchesToUpdateDisabled,
        handleClick: handleSelectMatchesToUpdateButtonPress,
        tooltipText: "Select matches to have their player performance data updated",
        placement: "top"
    } as TooltipButtonProps;

    const playersUpdate = {
        buttonText: "Update",
        disabled: startUpdateDisabled,
        handleClick: handleStartUpdateButtonPress,
        tooltipText: "Update player performance data for selected matches from the data source",
        placement: "bottom"
    } as TooltipButtonProps;

    const seasonsUpdateList = {
        buttonText: "Update List",
        disabled: updateListDisabled,
        handleClick: handleUpdateListButtonPress,
        tooltipText: "Update list of seasons from the data source",
        placement: "bottom"
    } as TooltipButtonProps;

    return (
        <div id='team-scrape-parent'>
            <h1 className="big-h1-title">
                {team?.team_name}
            </h1>
            <div id='team-scrape-content'>
                <TeamLinkBar/>
                <div id='team-scrape-2'>
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
                            <TeamScrapeButtonColumn
                                title="MATCH INFO"
                                buttonProps={[
                                    matchInfoView,
                                    matchInfoUpdateAll
                                ]}
                            />
                            <TeamScrapeButtonColumn
                                title="PLAYERS"
                                buttonProps={[
                                    playersSelectMatches,
                                    playersUpdate
                                ]}
                            />
                            <TeamScrapeButtonColumn
                                title="SEASONS"
                                buttonProps={[
                                    seasonsUpdateList
                                ]}
                            />
                        </div>
                    </div>
                    {
                        isLoading ? <Loading/> : (
                            <>
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
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    );
}