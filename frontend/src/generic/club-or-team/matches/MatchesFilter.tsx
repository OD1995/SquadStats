import { useEffect, useState } from "react";
import { Club } from "../../../types/Club";
import { Team } from "../../../types/Team";
import { MatchesOrPlayersFilter } from "../filters/MatchesOrPlayersFilter";
import { Season } from "../../../types/Season";
import { SPLIT_BY_TYPE } from "../../../types/enums";
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";
import ComboService from "../../../services/ComboService";
import { BackendResponse } from "../../../types/BackendResponse";
import { MatchesOrPlayersFilterOptional } from "../filters/MatchesOrPlayersFilterOptional";
import { SplitByFilter } from "../filters/SplitByFilter";
import MatchService from "../../../services/MatchService";

interface OwnProps {
    club?:Club
    team?:Team
    setErrorMessage:Function
    setTableData:Function
    setIsLoading:Function
}

export const MatchesFilter = (props:OwnProps) => {

    const [clubSeasons, setClubSeasons] = useState<Record<string,Season[]>>();
    const [filtersErrorMessage, setFiltersErrorMessage] = useState<string>("");
    const [teamSeasons, setTeamSeasons] = useState<Season[]>([]);
    const [oppositionOptions, setOppositionOptions] = useState<string[]>([]);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    
    const [selectedTeamId, setSelectedTeamId] = useState<string>("");
    const [selectedSeason, setSelectedSeason] = useState("");
    const [selectedSplitBy, setSelectedSplitBy] = useState<string>(SPLIT_BY_TYPE.NA);
    const [selectedOpposition, setSelectedOpposition] = useState<string>("");
    

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();


    useEffect(
        () => {
            const params = {
                teamId: props.team?.team_id,
                clubId: props.club?.club_id
            } as Record<string,string>;
            ComboService.getMatchesOrPlayersFilterData(
                createSearchParams(params).toString()
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
                    } else {
                        props.setErrorMessage(res.data.message);
                    }
                }
            )
            if (searchParams.get("splitBy")) {
                setSelectedSplitBy(searchParams.get("splitBy")!);
                retrieveData(searchParams.toString());
            }
        },
        []
    )

    const handleSubmitClick = () => {
        setFiltersErrorMessage("");
        const params = {} as Record<string,string>;
        if (selectedSplitBy) {
            params['splitBy'] = selectedSplitBy;
        } else {
            setFiltersErrorMessage("You must select a value for 'Type'");
            return;
        }
        if (selectedTeamId) {
            params['selectedTeamId'] = selectedTeamId;
        }
        if (selectedSeason) {
            params['selectedSeason'] = selectedSeason;
        }
        if (selectedOpposition) {
            params['selectedOpposition'] = selectedOpposition;
        }
        const newSearchParams = createSearchParams(params);
        const options = {
            search: `?${newSearchParams}`,
        };
        navigate(options, { replace: true });
        setIsExpanded(false);
        props.setTableData([]);
        retrieveData(newSearchParams.toString())
    }

    const retrieveData = (searchParams:string) => {
        props.setIsLoading(true);
        props.setErrorMessage("");
        MatchService.getMatchesData(
            searchParams,
            props.club?.club_id,
            props.team?.team_id
        ).then(
            (res:BackendResponse) => {
                if (res.success) {
                    props.setTableData(res.data);
                } else {
                    props.setErrorMessage(res.data.message);
                }
                props.setIsLoading(false);
            }
        )
    }

    const handleModalClose = () => {
        setIsExpanded(false);
        if (!searchParams.get("selectedTeamId")) {
            setTeamSeasons(clubSeasons![''])
        }
    }

    const splitByOptions = [
        SPLIT_BY_TYPE.NA,
        SPLIT_BY_TYPE.OPPOSITION,
        SPLIT_BY_TYPE.PLAYER_COUNT,
        SPLIT_BY_TYPE.SEASON
    ];

    const content = (
        <>
            <SplitByFilter
                splitBy={selectedSplitBy}
                setSplitBy={setSelectedSplitBy}
                splitByOptions={splitByOptions}
            />
            <MatchesOrPlayersFilterOptional
                club={props.club}
                team={props.team}
                selectedTeamId={selectedTeamId}
                setSelectedTeamId={setSelectedTeamId}
                clubSeasons={clubSeasons!}
                teamSeasons={teamSeasons}
                setTeamSeasons={setTeamSeasons}
                selectedSeason={selectedSeason}
                setSelectedSeason={setSelectedSeason}
                selectedOpposition={selectedOpposition}
                setSelectedOpposition={setSelectedOpposition}
                oppositionOptions={oppositionOptions}
                selectedSplitBy={selectedSplitBy}
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

    return (
        <MatchesOrPlayersFilter
            {...props}
            filterTitle="MATCHES"
            handleModalClose={handleModalClose}
            content={content}
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
        />
    )
}