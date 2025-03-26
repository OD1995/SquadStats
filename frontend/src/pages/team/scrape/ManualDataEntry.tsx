import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import { getUserLS } from "../../../authentication/auth";
import { generateId, getBigTitle, getIsClubAdmin } from "../../../helpers/other";
import { Team } from "../../../types/Team";
import { TeamLinkBar } from "../generic/TeamLinkBar";
import { ChangeEvent, useState } from "react";
import { MANUAL_DATA_ENTRY_ACTION_TYPE } from "../../../types/enums";
import "./ManualDataEntry.css";
import { SeasonSelection } from "../../../generic/SeasonSelection";
import { LeagueSeason } from "../../../types/Season";
import { ButtonDiv } from "../../../generic/ButtonDiv";
import SeasonService from "../../../services/SeasonService";
import { BackendResponse } from "../../../types/BackendResponse";
import { useNavigate, useParams } from "react-router-dom";
import { League } from "../../../types/League";
import { LeagueSelection } from "../../../generic/LeagueSelection";
import { Loading } from "../../../generic/Loading";
import { v4 as uuidv4 } from "uuid";
import { MatchSelection } from "../../../generic/MatchSelection";
import { Match } from "../../../types/Match";
import { isWiderThanHigher } from "../../../helpers/windowDimensions";

interface OwnProps {
    team:Team
    seasons:Record<string, LeagueSeason>
    selectedLeagueSeason:string
    setSelectedLeagueSeason:Function
    leagues:Record<string, League>
    selectedLeague:string
    setSelectedLeague:Function
    matches:Match[]
    selectedMatch:string
    setSelectedMatch:Function
    allLoaded:boolean
}

export const ManualDataEntry = (props:OwnProps) => {

    const [manualDataEntryActionType, setManualDataEntryActionType] = useState<string>("");
    const [newSeasonName, setNewSeasonName] = useState<string>("");
    const [newLeagueName, setNewLeagueName] = useState<string>("");
    const [backendResponse, setBackendResponse] = useState<string>("");
    const [backendResponseColour, setBackendResponseColour] = useState<string>("");
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

    const isDesktop = isWiderThanHigher();
    const user = getUserLS();
    let { teamId } = useParams();
    const navigate = useNavigate();

    const handleRadioButtonChange = (event:ChangeEvent<HTMLInputElement>) => {
        setManualDataEntryActionType(event.target.value);
    }

    const getTotalSeasonCount = () => {
        var seasonCount = 0;
        for (const lg of Object.values(props.leagues)) {
            seasonCount += Object.values(lg.league_seasons).length;
        }
        return seasonCount;
    }

    const getTotalMatchCount = () => {
        var matchCount = 0;
        for (const lg of Object.values(props.leagues)) {
            for (const ssn of Object.values(lg.league_seasons)) {
                matchCount += ssn.team_season.matches.length;
            }
        }
        return matchCount;
    }

    const getRadioButtonOptions = () => {
        if (!props.allLoaded) {
            return [];
        }
        var options = [
            MANUAL_DATA_ENTRY_ACTION_TYPE.ADD_NEW_LEAGUE
        ];
        if (Object.values(props.leagues).length > 0) {
            options.push(MANUAL_DATA_ENTRY_ACTION_TYPE.ADD_NEW_SEASON);
        }
        if (getTotalSeasonCount() > 0) {
            options.push(MANUAL_DATA_ENTRY_ACTION_TYPE.ADD_NEW_MATCH);
        }
        if (getTotalMatchCount() > 0) {
            options.push(MANUAL_DATA_ENTRY_ACTION_TYPE.EDIT_MATCH);
        }
        return options.map(
            (option:MANUAL_DATA_ENTRY_ACTION_TYPE) => (
                <FormControlLabel
                    value={option}
                    control={<Radio/>}
                    label={option}
                    key={generateId()}
                    // className="mde-radio-option"
                    sx={{
                        '& .MuiFormControlLabel-label': {
                            fontSize: '0.8rem'
                        },
                        '& .MuiRadio-root': {
                            // fontSize: '0.75rem'
                            height: '5vh'
                        },
                    }}
                />
            )
        )
    }

    const onChangeLeagueText = (e:ChangeEvent<HTMLInputElement>) => {
        setNewLeagueName(e.target.value);
    }

    const onChangeSeasonText = (e:ChangeEvent<HTMLInputElement>) => {
        setNewSeasonName(e.target.value);
    }

    const handleNewSeasonButtonClick = () => {
        if (
            checkIfElementExists(
                newSeasonName,
                Object.values(props.leagues[props.selectedLeague].league_seasons).map(
                    (ssn:LeagueSeason) => ssn.season_name
                )
            )
        ) {
            setBackendResponseColour("red");
            setBackendResponse(`A season with name ${newSeasonName} already exists`);
            return;
        }
        setButtonDisabled(true);
        SeasonService.createNewSeason(
            teamId!,
            props.selectedLeague,
            newSeasonName
        ).then(
            (res:BackendResponse) => {
                if (res.success) {
                    const leagueSeasonId = res.data.league_season_id;
                    const newMatchId = uuidv4();
                    navigate(`/team/${teamId}/update-match/${leagueSeasonId}/${newMatchId}`)
                } else {
                    setBackendResponseColour("red");
                    setBackendResponse(res.data.message);
                }
                setButtonDisabled(false);
            }
        )
    }

    const handleNewLeagueButtonClick = () => {
        if (
            checkIfElementExists(
                newLeagueName,
                Object.values(props.leagues).map((lg:League) => lg.league_name)
            )
        ) {
            setBackendResponseColour("red");
            setBackendResponse(`A league with name ${newLeagueName} already exists`);
            return;
        }
        setButtonDisabled(true);
        SeasonService.createNewLeagueAndSeason(
            newLeagueName,
            newSeasonName,
            teamId!
        ).then(
            (res:BackendResponse) => {
                if (res.success) {
                    const leagueSeasonId = res.data.league_season_id;
                    const newMatchId = uuidv4();
                    navigate(`/team/${teamId}/update-match/${leagueSeasonId}/${newMatchId}`)
                } else {
                    setBackendResponseColour("red");
                    setBackendResponse(res.data.message);
                }
                setButtonDisabled(false);
            }
        )
    }

    const handleNewMatchButtonClick = () => {
        const matchId = uuidv4();
        navigate(`/team/${teamId}/update-match/${props.selectedLeagueSeason}/${matchId}`);
    }

    const handleEditMatchButtonClick = () => {
        navigate(`/team/${teamId}/update-match/${props.selectedLeagueSeason}/${props.selectedMatch}`);
    }

    const checkIfElementExists = (el:string, arr:string[]) => {
        for (const s of arr) {
            if (el.toLowerCase() == s.toLowerCase()) {
                return true;
            }            
        }
        return false;
    }

    const newLeagueNameInput = (
        <input
            className={'new-mde-name-input ' + (isDesktop ? "desktop" : "mobile") + "-new-mde-name-input"}
            placeholder="Enter new league name"
            value={newLeagueName}
            onChange={onChangeLeagueText}
        />
    )

    const newSeasonNameInput = (
        <input
            className={'new-mde-name-input ' + (isDesktop ? "desktop" : "mobile") + "-new-mde-name-input"}
            placeholder="Enter new season name"
            value={newSeasonName}
            onChange={onChangeSeasonText}
        />
    )

    const leagueSelector = (
        <LeagueSelection
            leagues={props.leagues}
            selectedLeague={props.selectedLeague}
            setSelectedLeague={props.setSelectedLeague}
            flexDirection="row"
            justifyContent={isDesktop ? "space-evenly" : "space-around"}
        />
    )

    const matchSelector = (
        <MatchSelection
            matches={props.matches}
            selectedMatch={props.selectedMatch}
            setSelectedMatch={props.setSelectedMatch}
            flexDirection="row"
            justifyContent={isDesktop ? "space-evenly" : "space-around"}
        />
    )

    return (
        <div className='page-parent'>
            {getBigTitle(props.team.team_name)}
            <TeamLinkBar
                team={props.team}
                clubId={props.team.club_id}
                isClubAdmin={getIsClubAdmin(user, props.team.club_id)}
            />
            {
                (props.allLoaded) ? (
                <div id={(isDesktop ? 'desktop' : 'mobile') + '-manual-data-entry-type-option'}>
                    <FormControl>
                        <FormLabel
                            disabled={true}
                            sx={{
                                marginTop: isDesktop ? "5vh" : "0",
                                marginBottom: isDesktop ? "5vh" : "0",
                            }}
                        >
                            What do you want to do?
                        </FormLabel>
                        <RadioGroup
                            name="controlled-radio-buttons-group"
                            value={manualDataEntryActionType}
                            onChange={handleRadioButtonChange}
                        >
                            {getRadioButtonOptions()}
                        </RadioGroup>
                    </FormControl>
                </div>
                ) : <Loading/>
            }
            {
                (manualDataEntryActionType == MANUAL_DATA_ENTRY_ACTION_TYPE.ADD_NEW_LEAGUE) && (
                    <div className='new-mde-input'>
                        {newLeagueNameInput}
                        {newSeasonNameInput}
                        <ButtonDiv
                            buttonText="Submit"
                            onClickFunction={handleNewLeagueButtonClick}
                            buttonDisabled={buttonDisabled}
                        />
                    </div>
                )
            }
            {
                (manualDataEntryActionType == MANUAL_DATA_ENTRY_ACTION_TYPE.ADD_NEW_SEASON) && (
                    <div className='new-mde-input'>
                        {leagueSelector}
                        {newSeasonNameInput}
                        <ButtonDiv
                            buttonText="Submit"
                            onClickFunction={handleNewSeasonButtonClick}
                            buttonDisabled={buttonDisabled}
                        />
                    </div>
                )
            }
            {
                (manualDataEntryActionType == MANUAL_DATA_ENTRY_ACTION_TYPE.ADD_NEW_MATCH) && (
                    <div className='new-mde-input'>
                        {leagueSelector}
                        <SeasonSelection
                            seasons={Object.values(props.seasons)}
                            selectedSeason={props.selectedLeagueSeason}
                            setSelectedSeason={props.setSelectedLeagueSeason}
                            flexDirection="row"
                            justifyContent={isDesktop ? "space-evenly" : "space-around"}
                            showAllSeasons
                        />
                        <ButtonDiv
                            buttonText="Submit"
                            onClickFunction={handleNewMatchButtonClick}
                            buttonDisabled={buttonDisabled}
                        />
                    </div>
                )
            }
            {
                (manualDataEntryActionType == MANUAL_DATA_ENTRY_ACTION_TYPE.EDIT_MATCH) && (
                    <div className='new-mde-input'>
                        {leagueSelector}
                        <SeasonSelection
                            seasons={Object.values(props.seasons)}
                            selectedSeason={props.selectedLeagueSeason}
                            setSelectedSeason={props.setSelectedLeagueSeason}
                            flexDirection="row"
                            justifyContent={isDesktop ? "space-evenly" : "space-around"}
                        />
                        {matchSelector}
                        <ButtonDiv
                            buttonText="Submit"
                            onClickFunction={handleEditMatchButtonClick}
                            buttonDisabled={buttonDisabled}
                        />
                    </div>
                )
            }
            <div
                style={{
                    color:backendResponseColour,
                    textAlign:'center',
                }}
            >
                {backendResponse}
            </div>
        </div>
    );
}