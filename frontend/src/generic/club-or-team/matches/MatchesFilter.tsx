import { useEffect, useState } from "react";
import { MatchTypeFilter } from "./MatchTypeFilter";
import { SeasonFilter } from "./SeasonFilter";
import { TeamFilter } from "./TeamFilter";
import { isWiderThanHigher } from "../../../helpers/windowDimensions";
import { Modal } from "../../Modal";
import { Club } from "../../../types/Club";
import { Team } from "../../../types/Team";
import { BackendResponse } from "../../../types/BackendResponse";
import { Season } from "../../../types/Season";
import { QueryType } from "../../../types/enums";
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";
import MatchService from "../../../services/MatchService";
import { OppositionFilter } from "./OppositionFilter";
import ComboService from "../../../services/ComboService";

interface OwnProps {
    club?:Club
    team?:Team
    setErrorMessage:Function
    setTableData:Function
}

export const MatchesFilter = (props:OwnProps) => {

    const [isExpanded, setIsExpanded] = useState<boolean>(false); 
    const [clubSeasons, setClubSeasons] = useState<Record<string,Season[]>>();
    const [filtersErrorMessage, setFiltersErrorMessage] = useState<string>("");
    const [teamSeasons, setTeamSeasons] = useState<Season[]>([]);
    const [oppositionOptions, setOppositionOptions] = useState<string[]>([]);
    
    const [selectedTeamId, setSelectedTeamId] = useState<string>("");
    const [selectedSeason, setSelectedSeason] = useState("");
    const [selectedType, setSelectedType] = useState<string>("");
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
            ComboService.getMatchesFilterData(
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
                setSelectedType(searchParams.get("type")!);
            }
        },
        []
    )

    const handleSubmitClick = () => {
        setFiltersErrorMessage("");
        const params = {} as Record<string,string>;
        if (selectedType) {
            params['type'] = selectedType;
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
        props.setErrorMessage("");
        MatchService.getMatchesData(
            newSearchParams.toString(),
            props.club?.club_id
        ).then(
            (res:BackendResponse) => {
                if (res.success) {
                    props.setTableData(res.data);
                } else {
                    props.setErrorMessage(res.data.message);
                }
            }
        )
    }

    const getSeasons = () => {
        if (props.team) {
            return teamSeasons;
        }
        if (clubSeasons && (selectedTeamId != "")) {
            return clubSeasons[selectedTeamId]
        }
        return []
    }

    const handleModalClose = () => {
        setIsExpanded(false);
        if (!searchParams.get("selectedTeamId")) {
            setTeamSeasons(clubSeasons![''])
        }
    }

    const content = (
        <>
            <div className="matches-filter-explainer-parent">
                <div className="matches-filter-explainer">
                    * - Mandatory
                </div>
                <div className="matches-filter-explainer">
                    ^ - Optional
                </div>
            </div>
            {
                props.club && (
                    <TeamFilter
                        club={props.club}
                        selectedTeamId={selectedTeamId}
                        setSelectedTeamId={setSelectedTeamId}
                        clubSeasons={clubSeasons!}
                        setTeamSeasons={setTeamSeasons}
                    />
                )
            }
            <SeasonFilter
                selectedSeason={selectedSeason}
                setSelectedSeason={setSelectedSeason}
                seasonOptions={getSeasons()}
            />
            <MatchTypeFilter
                type={selectedType!}
                setType={setSelectedType}
            />
            {
                (selectedType == QueryType.H2H) && (
                    <OppositionFilter
                        selectedOpposition={selectedOpposition}
                        setSelectedOpposition={setSelectedOpposition}
                        oppositionOptions={oppositionOptions}
                    />
                )
            }
            <div id='matches-filter-button-div'>
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
                            id='mobile-expanded-matches-filter'
                            className='expanded-matches-filter'
                        >
                            {content}
                        </div>
                    }
                />
            );
        } else {
            return (
                <div 
                    id='mobile-folded-matches-filter'
                    className="folded-matches-filter"
                    onClick={() => setIsExpanded(true)}>
                    MATCH FILTERS
                </div>
            )
        }
    } else {
        return (
            <div 
                id='desktop-expanded-matches-filter'
                className='expanded-matches-filter'
            >
                {content}
            </div>
        )
    }
}