import { useNavigate } from "react-router-dom";
import { getUserLS } from "../../authentication/auth";
import { useEffect, useState } from "react";
import { OverviewOption, OverviewSelector } from "../../generic/OverviewSelector";
import { Club } from "../../types/Club";
import { User } from "../../types/User";
import { getBigTitle } from "../../helpers/other";

export const MyClubs = () => {
    
    const [clubId, setClubId] = useState<string>("");
    const [clubOptions, setClubOptions] = useState<OverviewOption[]>([]);
    const [clubLink, setClubLink] = useState<string>("");
    const [teamId, setTeamId] = useState<string>("");
    const [teamOptions, setTeamOptions] = useState<OverviewOption[]>([]);
    const [teamLink, setTeamLink] = useState<string>("");

    const user = getUserLS();
    const navigate = useNavigate();

    useEffect(
        () => {
            if (!user) {
                navigate("/about");
            } else {
                setClubOptions(getClubOptions(user));
                setTeamOptions(getTeamOptions(user));
            }
        },
        []
    )

    useEffect(
        () => {
            setTeamLink(`/team/${teamId}/overview`)
        },
        [teamId]
    )

    useEffect(
        () => {
            setClubLink(`/club/${clubId}/overview`)
        },
        [clubId]
    )

    const getClubOptions = (user:User) => {
        return user.clubs.map(
            (club:Club) => (
                {
                    label: club.club_name,
                    value: club.club_id
                }
            )
        )
    }

    const getTeamOptions = (user:User) => {
        var options = [] as OverviewOption[];
        for (const club of user.clubs) {
            for (const team of club.teams) {
                options.push(
                    {
                        label: team.team_name,
                        value: team.team_id
                    }
                )
            }
        }
        return options;
    }

    return (
        <div className="page-parent">
            {getBigTitle("Overview Selector")}
            <OverviewSelector
                label="Club"
                overviewId={clubId}
                setOverviewId={setClubId}
                overviewOptions={clubOptions}
                link={clubLink}
            />
            <OverviewSelector
                label="Team"
                overviewId={teamId}
                setOverviewId={setTeamId}
                overviewOptions={teamOptions}
                link={teamLink}
            />
        </div>
    );
}