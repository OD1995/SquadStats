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

interface OwnProps {
    team:Team
    seasons:LeagueSeason[]
    selectedLeagueSeason:string
    setSelectedLeagueSeason:Function
    leagues:League[]
    selectedLeague:string
    setSelectedLeague:Function
    allLoaded:boolean
}

export const ManualDataEntry = (props:OwnProps) => {

    const [manualDataEntryActionType, setManualDataEntryActionType] = useState<string>("");
    const [newSeasonName, setNewSeasonName] = useState<string>("");
    const [newLeagueName, setNewLeagueName] = useState<string>("");
    const [backendResponse, setBackendResponse] = useState<string>("");
    const [backendResponseColour, setBackendResponseColour] = useState<string>("");
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

    const user = getUserLS();
    let { teamId } = useParams();
    const navigate = useNavigate();

    const handleRadioButtonChange = (event:ChangeEvent<HTMLInputElement>) => {
        setManualDataEntryActionType(event.target.value);
    }

    const getRadioButtonOptions = () => {
        if (!props.allLoaded) {
            return [];
        }
        var options = [
            MANUAL_DATA_ENTRY_ACTION_TYPE.ADD_NEW_LEAGUE
        ];
        if (props.leagues.length > 0) {
            options.push(MANUAL_DATA_ENTRY_ACTION_TYPE.ADD_NEW_SEASON);
        }
        if (props.seasons.length > 0) {
            options.push(MANUAL_DATA_ENTRY_ACTION_TYPE.ADD_NEW_MATCH);
        }
        if (getMatchCount() > 0) {
            options.push(MANUAL_DATA_ENTRY_ACTION_TYPE.EDIT_MATCH);
        }
        return options.map(
            (option:MANUAL_DATA_ENTRY_ACTION_TYPE) => (
                <FormControlLabel
                    value={option}
                    control={<Radio/>}
                    label={option}
                    key={generateId()}
                />
            )
        )
    }

    const getMatchCount = () => {
        var matchCount = 0;
        for (const season of props.seasons) {
            matchCount += season.team_season.matches.length;
        }
        return matchCount;
    }

    const onChangeLeagueText = (e:ChangeEvent<HTMLInputElement>) => {
        setNewLeagueName(e.target.value);
    }

    const onChangeSeasonText = (e:ChangeEvent<HTMLInputElement>) => {
        setNewSeasonName(e.target.value);
    }

    const handleNewSeasonButtonClick = () => {
        setButtonDisabled(true);
        SeasonService.createNewSeason(
            teamId!,
            newSeasonName
        ).then(
            (res:BackendResponse) => {
                if (res.success) {
                    setBackendResponseColour("green");
                    setBackendResponse(res.data.message);
                } else {
                    setBackendResponseColour("red");
                    setBackendResponse(res.data.message);
                }
                setButtonDisabled(false);
            }
        )
    }

    const handleNewLeagueButtonClick = () => {
        setButtonDisabled(true);
        SeasonService.createNewLeagueAndSeason(
            newLeagueName,
            newSeasonName,
            teamId!
        ).then(
            (res:BackendResponse) => {
                if (res.success) {
                    setBackendResponseColour("green");
                    const teamSeasonId = res.data.team_season_id;
                    const newMatchId = uuidv4();
                    // '/team/:teamId/update-match/:teamSeasonId/:matchId'
                    navigate(`/team/${teamId}/update-match/${teamSeasonId}/${newMatchId}`)
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

    const newLeagueNameInput = (
        <input
            className='new-mde-name-input'
            placeholder="Enter new league name"
            value={newLeagueName}
            onChange={onChangeLeagueText}
        />
    )

    const newSeasonNameInput = (
        <input
            className='new-mde-name-input'
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
            justifyContent="space-around"
        />
    )

    const seasonSelector = (
        <SeasonSelection
            seasons={props.seasons}
            selectedSeason={props.selectedLeagueSeason}
            setSelectedSeason={props.setSelectedLeagueSeason}
            flexDirection="row"
            justifyContent="space-around"
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
                <div id='manual-data-entry-type-option'>
                    <FormControl>
                        <FormLabel disabled={true}>
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
                        {seasonSelector}
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
                        {seasonSelector}
                        <ButtonDiv
                            buttonText="Submit"
                            onClickFunction={handleNewSeasonButtonClick}
                            buttonDisabled={buttonDisabled}
                        />
                    </div>
                )
            }
            <div style={{color:backendResponseColour}}>
                {backendResponse}
            </div>
        </div>
    );
}