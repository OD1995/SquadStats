import { MatchesOrPlayersFilterOptional } from "./MatchesOrPlayersFilterOptional";
import { useEffect, useState } from "react";
import { isWiderThanHigher } from "../../../helpers/windowDimensions";
import { Modal } from "../../Modal";
import { Club } from "../../../types/Club";
import { Team } from "../../../types/Team";
import { BackendResponse } from "../../../types/BackendResponse";
import { Season } from "../../../types/Season";
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";
import MatchService from "../../../services/MatchService";
import ComboService from "../../../services/ComboService";
import { SplitByFilter } from "../matches/SplitByFilter";
import { SPLIT_BY_TYPE } from "../../../types/enums";


interface OwnProps {
    club?:Club
    team?:Team
    setErrorMessage:Function
    setTableData:Function
    setIsLoading:Function
    filterTitle:string
}

export const MatchesOrPlayersFilter = (props:OwnProps) => {

    const [isExpanded, setIsExpanded] = useState<boolean>(false); 
    const [clubSeasons, setClubSeasons] = useState<Record<string,Season[]>>();
    const [filtersErrorMessage, setFiltersErrorMessage] = useState<string>("");
    const [teamSeasons, setTeamSeasons] = useState<Season[]>([]);
    const [oppositionOptions, setOppositionOptions] = useState<string[]>([]);
    
    const [selectedTeamId, setSelectedTeamId] = useState<string>("");
    const [selectedSeason, setSelectedSeason] = useState("");
    const [selectedSplitBy, setSelectedSplitBy] = useState<string>(SPLIT_BY_TYPE.NA);
    const [selectedOpposition, setSelectedOpposition] = useState<string>("");
    
    const isDesktop = isWiderThanHigher();

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
                        const tmSsns = searchParams.get("selectedTeamId") ?
                            res.data.team_seasons[searchParams.get("selectedTeamId")!] :
                            res.data.team_seasons[''];
                        setTeamSeasons(tmSsns);
                        setOppositionOptions(res.data.oppositions);
                    } else {
                        props.setErrorMessage(res.data.message);
                    }
                }
            )
            if (searchParams.get("type")) {
                setSelectedSplitBy(searchParams.get("type")!);
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
            props.club?.club_id
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

    const content = (
        <>
            <SplitByFilter
                splitBy={selectedSplitBy}
                setSplitBy={setSelectedSplitBy}
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

    if (!isDesktop) {
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
    } else {
        return (
            <div 
                id='desktop-expanded-mop-filter'
                className='expanded-mop-filter'
            >
                {content}
            </div>
        )
    }
}