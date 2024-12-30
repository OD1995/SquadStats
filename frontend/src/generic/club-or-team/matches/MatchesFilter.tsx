import { useEffect, useState } from "react";
import { MatchTypeFilter } from "./MatchTypeFilter";
import { SeasonFilter } from "./SeasonFilter";
import { TeamFilter } from "./TeamFilter";
import { isWiderThanHigher } from "../../../helpers/windowDimensions";
import { Modal } from "../../Modal";
import SeasonService from "../../../services/SeasonService";
import { Club } from "../../../types/Club";
import { Team } from "../../../types/Team";
import { BackendResponse } from "../../../types/BackendResponse";
import { Season } from "../../../types/Season";

interface OwnProps {
    club?:Club
    team?:Team
    setErrorMessage:Function
}

export const MatchesFilter = (props:OwnProps) => {

    const [isExpanded, setIsExpanded] = useState<boolean>(false); 
    const [selectedSeason, setSelectedSeason] = useState("");
    const [teamSeasons, setTeamSeasons] = useState<Season[]>([]);
    const [clubSeasons, setClubSeasons] = useState<Record<string,Season[]>>();
    
    const [selectedType, setSelectedType] = useState<string>();
    const [selectedTeamId, setSelectedTeamId] = useState<string>("");

    const isDesktop = isWiderThanHigher();

    useEffect(
        () => {
            if (props.team) {
                SeasonService.getTeamSeasons(
                    props.team.team_id
                ).then(
                    (res:BackendResponse) => {
                        if (res.success) {
                            setTeamSeasons(res.data);
                            setSelectedSeason(res.data[0].season_id);
                        } else {
                            props.setErrorMessage(res.data.message);
                        }
                    }
                )
            } else {
                SeasonService.getClubSeasons(
                    props.club?.club_id!
                ).then(
                    (res:BackendResponse) => {
                        if (res.success) {
                            setClubSeasons(res.data);
                            setSelectedSeason(res.data[0].season_id);
                        } else {
                            props.setErrorMessage(res.data.message);
                        }
                    }
                )
            }
        },
        []
    )

    const handleSubmitClick = () => {

    }

    const getSeasons = () => {
        if (props.team) {
            return teamSeasons;
        }
        if (selectedTeamId != "") {
            return clubSeasons![selectedTeamId]
        }
        return []
    }

    if (!isDesktop) {
        if (isExpanded) {
            return (
                <Modal
                    handleModalClose={() => setIsExpanded(false)}
                    content={
                        <div 
                            id='mobile-expanded-matches-filter'
                            className='expanded-matches-filter'
                        >
                            <MatchTypeFilter
                                type={selectedType!}
                                setType={setSelectedType}
                            />
                            {
                                props.club && (
                                    <TeamFilter
                                        club={props.club}
                                        selectedTeamId={selectedTeamId}
                                        setSelectedTeamId={setSelectedTeamId}
                                    />
                                )
                            }
                            <SeasonFilter
                                selectedSeason={selectedSeason}
                                setSelectedSeason={setSelectedSeason}
                                seasonOptions={getSeasons()}
                            />
                            <button className="ss-green-button" onClick={handleSubmitClick}>
                                Submit
                            </button>
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
                <MatchTypeFilter
                    type={selectedType!}
                    setType={setSelectedType}
                />
                
                {
                    props.club && (
                        <TeamFilter
                            club={props.club}
                            selectedTeamId={selectedTeamId}
                            setSelectedTeamId={setSelectedTeamId}
                        />
                    )
                }
                <SeasonFilter
                    selectedSeason={selectedSeason}
                    setSelectedSeason={setSelectedSeason}
                    seasonOptions={getSeasons()}
                />
                <button className="ss-green-button" onClick={handleSubmitClick}>
                    Submit
                </button>
            </div>
        )
    }
}