import { isWiderThanHigher } from "../../../helpers/windowDimensions";
import { Modal } from "../../Modal";
import { Club } from "../../../types/Club";
import { Team } from "../../../types/Team";
import { useEffect, useState } from "react";
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";
import { LeagueSeason } from "../../../types/Season";
import ComboService from "../../../services/ComboService";
import { BackendResponse } from "../../../types/BackendResponse";
import { MatchesOrPlayersFilterOptional } from "./MatchesOrPlayersFilterOptional";
import { SPLIT_BY_TYPE } from "../../../types/enums";
import { Player } from "../../../types/Player";
import { minAppsRelevant } from "../../../helpers/other";


interface OwnProps {
    club?:Club
    team?:Team
    setErrorMessage:Function
    setTableData:Function
    setIsLoading:Function
    filterTitle:string
    // handleSubmitClick:Function
    firstSelector:JSX.Element
    // isExpanded:boolean
    // setIsExpanded:Function
    selectedSplitBy:string
    // setSelectedSplitBy:Function
    // selectedSeason:string
    // setSelectedSeason:Function
    // selectedOpposition:string
    // setSelectedOpposition:Function
    // selectedTeamId:string
    // setSelectedTeamId:Function
    // filtersErrorMessage:string
    retrieveData:Function
    metric?:string
    players?:boolean
    matches?:boolean
    // getData:Function
    perGame?:boolean
    minApps?:number
    setMinApps?:Function
}

export const MatchesOrPlayersFilter = (props:OwnProps) => {
   
    const isDesktop = isWiderThanHigher();   
    const [isExpanded, setIsExpanded] = useState<boolean>(false); 
    
    const [filtersErrorMessage, setFiltersErrorMessage] = useState<string>("");
    const [selectedTeamId, setSelectedTeamId] = useState<string>("");
    const [seasonFilter, setSeasonFilter] = useState("");
    const [selectedOpposition, setSelectedOpposition] = useState<string>("");
    const [playerIdFilter, setPlayerIdFilter] = useState<string>("");
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [selectedMonth, setSelectedMonth] = useState<string>("");
    
    const [clubSeasons, setClubSeasons] = useState<Record<string,LeagueSeason[]>>();
    const [teamSeasons, setTeamSeasons] = useState<LeagueSeason[]>([]);
    const [oppositionOptions, setOppositionOptions] = useState<string[]>([]);
    const [playerFilterOptions, setPlayerFilterOptions] = useState<Player[]>([]);
    const [yearOptions, setYearOptions] = useState<string[]>([]);
    const [monthOptions, setMonthOptions] = useState<string[]>([]);
    
    const [searchParams, _] = useSearchParams();
    const navigate = useNavigate();

    useEffect(
        () => {
            const params = {} as Record<string,string>;
            if (props.team?.team_id) {
                params["teamId"] = props.team.team_id;
            }
            if (props.club?.club_id) {
                params["clubId"] = props.club.club_id;
            }
            ComboService.getMatchesOrPlayersFilterData(
                createSearchParams(params).toString(),
                props.players ? "True" : "False"
            ).then(
                (res:BackendResponse) => {
                    if (res.success) {
                        setClubSeasons(res.data.club_seasons);
                        var tmSsns = res.data.club_seasons[''];
                        if (searchParams.get("selectedTeamId")) {
                            tmSsns = res.data.club_seasons[searchParams.get("selectedTeamId")!];
                        } else if (props.team) {
                            tmSsns = res.data.team_seasons;
                        }
                        setTeamSeasons(tmSsns);
                        setOppositionOptions(res.data.oppositions);
                        setPlayerFilterOptions(res.data.players);
                        setYearOptions(res.data.years);
                        setMonthOptions(res.data.months);
                    } else {
                        props.setErrorMessage(res.data.message);
                    }
                }
            )
            if (searchParams.get("seasonFilter")) {
                setSeasonFilter(searchParams.get("seasonFilter")!);
            }
            if (searchParams.get("oppositionFilter")) {
                setSelectedOpposition(searchParams.get("oppositionFilter")!);
            }
            if (searchParams.get("teamIdFilter")) {
                setSelectedTeamId(searchParams.get("teamIdFilter")!);
            }
            if (searchParams.get("playerIdFilter")) {
                setPlayerIdFilter(searchParams.get("playerIdFilter")!);
            }
            if (searchParams.get("yearFilter")) {
                setSelectedYear(searchParams.get("yearFilter")!);
            }
            if (searchParams.get("monthFilter")) {
                setSelectedMonth(searchParams.get("monthFilter")!);
            }
        },
        []
    )

    const handleSubmitClick = () => {
        setFiltersErrorMessage("");
        const params = {} as Record<string,string>;
        if (
            props.selectedSplitBy && 
            ((props.selectedSplitBy != SPLIT_BY_TYPE.NA) || props.matches)
        ) {
            params['splitBy'] = props.selectedSplitBy;
        } else {
            if (props.matches) {
                setFiltersErrorMessage("You must select a value for 'Type'");
                return;
            }
        }
        if (props.matches) {
            params['splitBy'] = props.selectedSplitBy;
        }
        if (props.players) {
            params['perGame'] = props.perGame ? "True" : "False";
            // if (props.perGame) {
            if (minAppsRelevant(props.perGame, props.metric)) {
                params['minApps'] = props.minApps!.toString();
            } else {
                delete params['minApps'];
            }
        }
        if (props.metric) {
            params['metric'] = props.metric;
        } else if (props.players) {
            setFiltersErrorMessage("You must select a value for 'Metric'");
            return;
        }
        if (selectedTeamId) {
            // params['selectedTeamId'] = selectedTeamId;
            params['teamIdFilter'] = selectedTeamId;
        }
        if (playerIdFilter) {
            params['playerIdFilter'] = playerIdFilter;
        }
        if (seasonFilter) {
            // params['selectedSeason'] = selectedSeason;
            params['seasonFilter'] = seasonFilter;
        }
        if (selectedOpposition) {
            params['oppositionFilter'] = selectedOpposition;
        }
        if (selectedYear) {
            params['yearFilter'] = selectedYear;
        }
        if (selectedMonth) {
            params['monthFilter'] = selectedMonth;
        }
        const newSearchParams = createSearchParams(params);
        const options = {
            search: `?${newSearchParams}`,
        };
        navigate(options, { replace: true });
        setIsExpanded(false);
        props.setTableData([]);
        props.retrieveData(newSearchParams.toString())
    }
    
    const content = (
        <>
            {props.firstSelector}
            <MatchesOrPlayersFilterOptional
                club={props.club}
                team={props.team}
                matches={props.matches}
                players={props.players}
                selectedTeamId={selectedTeamId}
                setSelectedTeamId={setSelectedTeamId}
                clubSeasons={clubSeasons!}
                teamSeasons={teamSeasons}
                setTeamSeasons={setTeamSeasons}
                selectedSeason={seasonFilter}
                setSelectedSeason={setSeasonFilter}
                selectedOpposition={selectedOpposition}
                setSelectedOpposition={setSelectedOpposition}
                oppositionOptions={oppositionOptions}
                selectedSplitBy={props.selectedSplitBy}
                perGame={props.perGame}
                minApps={props.minApps!}
                setMinApps={props.setMinApps!}
                playerIdFilter={playerIdFilter}
                setPlayerIdFilter={setPlayerIdFilter}
                playerFilterOptions={playerFilterOptions}
                metric={props.metric}
                yearOptions={yearOptions}
                setSelectedYear={setSelectedYear}
                selectedYear={selectedYear}
                monthOptions={monthOptions}
                setSelectedMonth={setSelectedMonth}
                selectedMonth={selectedMonth}
            />
            <div id='mop-filter-button-div'>
                <button
                    className="ss-green-button"
                    onClick={handleSubmitClick}
                >
                    Submit
                </button>
            </div>
            {
                (filtersErrorMessage.length > 0) && (
                    <div style={{color:"red"}}>{filtersErrorMessage}</div>
                )
            }
        </>
    )
    
    const handleModalClose = () => {
        setIsExpanded(false);
        if ((props.club) && (!searchParams.get("selectedTeamId"))) {
            setTeamSeasons(clubSeasons![''])
        }
    }

    if (isExpanded) {
        return (
            <Modal
                handleModalClose={handleModalClose}
                content={
                    <div 
                        id='mobile-expanded-mop-filter'
                        className='expanded-mop-filter'
                    >
                        {content}
                    </div>
                }
            />
        );
    } else {
        return (
            <div 
                id='mobile-folded-mop-filter'
                className="folded-mop-filter"
                onClick={() => setIsExpanded(true)}>
                {props.filterTitle +  " FILTERS"}
            </div>
        )
    }
}