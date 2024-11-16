import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TableRow, TableCell } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Team } from "../../types/Team";
import { useSelector } from "react-redux";
import { userSelector } from "../../store/slices/userSlice";
import { getTeam } from "../../helpers/other";
import TeamService from "../../services/TeamService";
import { BackendResponse } from "../../types/BackendResponse";
import { Season } from "../../types/Season";
import "./TeamScrape.css";
import { Match } from "../../types/Match";
import { Table } from "../../generic/Table";

export const TeamScrape = () => {

    const [team, setTeam] = useState<Team>();
    const [errorMessage, setErrorMessage] = useState("");
    const [getMatchesButtonDisabled, setGetMatchesButtonDisabled] = useState(false);
    const [scrapeMatchesButtonDisabled, getScrapeMatchesButtonDisabled] = useState(true);
    const [selectedSeason, setSelectedSeason] = useState("");
    const [seasons, setSeasons] = useState([]);
    const [matches, setMatches] = useState<Match[]>([]);
    const [successMatches, setSuccessMatches] = useState<Match[]>([]);
    const [errorMatches, setErrorMatches] = useState<Match[]>([]);

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
                if (res.success) {
                    const matches:Match[] = res.data;
                    setMatches(matches);
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
            }
        )
    }

    const handleScrapeMatchesButtonPress = () => {

    }

    const handleSeasonSelect = (event:SelectChangeEvent) => {
        setSelectedSeason(event.target.value as string);
    }

    const generateSuccessHeader = () => {
        return (
            <TableRow className="ss-table-head">
                <TableCell>
                    Date
                </TableCell>
                <TableCell>
                    Time
                </TableCell>
                <TableCell>
                    Opposition
                </TableCell>
                <TableCell>
                    Competition
                </TableCell>
                <TableCell>
                    Goals For
                </TableCell>
                <TableCell>
                    Goals Against
                </TableCell>
            </TableRow>
        )
    }

    const generateErrorHeader = () => {
        return (
            <TableRow className="ss-table-head">
                <TableCell>
                    Date
                </TableCell>
                <TableCell>
                    Time
                </TableCell>
                <TableCell>
                    Opposition
                </TableCell>
                <TableCell>
                    Errors
                </TableCell>
            </TableRow>
        )
    }

    const generateSuccessRow = (match:Match) => {
        return (
            <TableRow>
                <TableCell>
                    {match.date}
                </TableCell>
                <TableCell>
                    {match.time}
                </TableCell>
                <TableCell>
                    {match.opposition_team_name}
                </TableCell>
                <TableCell>
                    {match.competition_acronym}
                </TableCell>
                <TableCell>
                    {match.goals_for}
                </TableCell>
                <TableCell>
                    {match.goals_against}
                </TableCell>
            </TableRow>
        )
    }

    const generateErrorRow = (match:Match) => {
        var errorText = "";
        for (const matchError of match.match_errors) {
            errorText += matchError.error_message;
        }

        return (
            <TableRow>
                <TableCell>
                    {match.date}
                </TableCell>
                <TableCell>
                    {match.time}
                </TableCell>
                <TableCell>
                    {match.opposition_team_name}
                </TableCell>
                <TableCell>
                    {errorText}
                </TableCell>
            </TableRow>
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
                {
                    (successMatches.length > 0) && (
                            <>
                                <h3 style={{color: 'green'}}>
                                    Match Info - Success
                                </h3>
                                <Table
                                    headers={generateSuccessHeader()}
                                    rows={successMatches.map((match:Match) => generateSuccessRow(match))}
                                />
                            </>
                    )
                }
                {
                    (errorMatches.length > 0) && (
                            <>
                                <h3
                                    style={{
                                        color: 'red',
                                        alignSelf: 'baseline'
                                    }}
                                >
                                    Match Info - Failure
                                </h3>
                                <i
                                    style={{
                                        color: 'red'
                                    }}
                                >
                                    Most errors will be because neither team name is expected. You can change that <Link target='_blank' to={`/team/${teamId}/team-names`}>here</Link>
                                </i>
                                <Table
                                    headers={generateErrorHeader()}
                                    rows={errorMatches.map((match:Match) => generateErrorRow(match))}
                                />
                            </>
                    )
                }
            </div>
        </div>
    );
}