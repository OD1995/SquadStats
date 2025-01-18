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
    // const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [matchesSplitBy, setMatchesSplitBy] = useState<string>(SPLIT_BY_TYPE.NA);
    const [selectedTeamId, setSelectedTeamId] = useState<string>("");
    const [selectedSeason, setSelectedSeason] = useState("");
    const [selectedOpposition, setSelectedOpposition] = useState<string>("");
    

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();


    useEffect(
        () => {
            if (searchParams.get("splitBy")) {
                setMatchesSplitBy(searchParams.get("splitBy")!);
                retrieveData(searchParams.toString());
            }
        },
        []
    )

    // const handleSubmitClick = () => {
    //     setFiltersErrorMessage("");
    //     const params = {} as Record<string,string>;
    //     if (selectedSplitBy) {
    //         params['splitBy'] = selectedSplitBy;
    //     } else {
    //         setFiltersErrorMessage("You must select a value for 'Type'");
    //         return;
    //     }
    //     if (selectedTeamId) {
    //         params['selectedTeamId'] = selectedTeamId;
    //     }
    //     if (selectedSeason) {
    //         params['selectedSeason'] = selectedSeason;
    //     }
    //     if (selectedOpposition) {
    //         params['selectedOpposition'] = selectedOpposition;
    //     }
    //     const newSearchParams = createSearchParams(params);
    //     const options = {
    //         search: `?${newSearchParams}`,
    //     };
    //     navigate(options, { replace: true });
    //     setIsExpanded(false);
    //     props.setTableData([]);
    //     retrieveData(newSearchParams.toString())
    // }

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

    const splitByOptions = [
        SPLIT_BY_TYPE.NA,
        SPLIT_BY_TYPE.OPPOSITION,
        SPLIT_BY_TYPE.PLAYER_COUNT,
        SPLIT_BY_TYPE.SEASON
    ];

    const firstSelector = (
        <SplitByFilter
            splitBy={matchesSplitBy}
            setSplitBy={setMatchesSplitBy}
            splitByOptions={splitByOptions}
        />
    )

    return (
        <MatchesOrPlayersFilter
            {...props}
            filterTitle="MATCHES"
            // handleSubmitClick={handleSubmitClick}
            // isExpanded={isExpanded}
            // setIsExpanded={setIsExpanded}
            firstSelector={firstSelector}
            // filtersErrorMessage={filtersErrorMessage}
            selectedSplitBy={matchesSplitBy}
            // setSelectedSplitBy={setSelectedSplitBy}
            // selectedSeason={selectedSeason}
            // setSelectedSeason={}
            retrieveData={retrieveData}
            matches
        />
    )
}