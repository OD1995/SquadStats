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
import { MatchesOrPlayersFilter } from "../filters/MatchesOrPlayersFilter";

interface OwnProps {
    club?:Club
    team?:Team
    setErrorMessage:Function
    setTableData:Function
    setIsLoading:Function
}

export const MatchesFilter = (props:OwnProps) => {

    return (
        <MatchesOrPlayersFilter
            {...props}
            filterTitle="MATCHES"
        />
    )
}