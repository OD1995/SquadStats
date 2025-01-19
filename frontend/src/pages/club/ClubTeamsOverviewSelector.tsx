import { useParams } from "react-router-dom";
import { getUserLS } from "../../authentication/auth";
import { useEffect, useState } from "react";
import { Loading } from "../../generic/Loading";
import { getBigTitle, getClub, getIsClubAdmin } from "../../helpers/other";
import { ClubLinkBar } from "./generic/ClubLinkBar";
import { OverviewOption, OverviewSelector } from "../../generic/OverviewSelector";
import ClubService from "../../services/ClubService";
import { BackendResponse } from "../../types/BackendResponse";
import { Club } from "../../types/Club";
import { Team } from "../../types/Team";

export const ClubTeamsOverviewSelector = () => {
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [teamId, setTeamId] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState("");
    const [teamOptions, setTeamOptions] = useState<OverviewOption[]>([]);
    const [club, setClub] = useState<Club>();
    const [link, setLink] = useState<string>("");

    let { clubId } = useParams();
    const user = getUserLS();

    useEffect(
        () => {
            var _club_ = getClub(user, clubId);
            if (_club_) {
                setClub(_club_);
                setTeamOptions(getOptions(_club_));
            } else {
                setIsLoading(true);
                ClubService.getClubInformation(
                    clubId!
                ).then(
                    (res:BackendResponse) => {
                        if (res.success) {
                            setClub(res.data);
                            setTeamOptions(getOptions(res.data));
                        } else {
                            setErrorMessage(res.data.message);
                        }
                        setIsLoading(false);
                    }
                )
            }
        },
        []
    )

    useEffect(
        () => {
            setLink(`/team/${teamId}/overview`)
        },
        [teamId]
    )

    const getOptions = (club:Club) => {
        return club.teams.map(
            (team:Team) => (
                {
                    label: team.team_name,
                    value: team.team_id
                }
            )
        )
    }

    if (isLoading) {
        return <Loading/>
    }
    
    return (
        <div className="page-parent">
            {getBigTitle(club?.club_name)}
            <ClubLinkBar
                isClubAdmin={getIsClubAdmin(user, clubId!)}
            />
            <div className="error-message">
                {errorMessage}
            </div>
            <OverviewSelector
                label="Team"
                overviewId={teamId}
                setOverviewId={setTeamId}
                overviewOptions={teamOptions}
                link={link}
            />
        </div>
    );
}