import { useEffect, useState } from "react";
import { Team } from "../../types/Team";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { userSelector } from "../../store/slices/userSlice";
import TeamService from "../../services/TeamService";
import { BackendResponse } from "../../types/BackendResponse";
import { getTeam } from "../../helpers/other";

export const TeamOverview = () => {

    const [team, setTeam] = useState<Team>();
    const [errorMessage, setErrorMessage] = useState("");

    let { teamId } = useParams();
    const user = useSelector(userSelector);

    useEffect(
        () => {
            var _team_ = getTeam(user, teamId);
            if (_team_) {
                setTeam(_team_);
            } else {
                TeamService.getTeamInformation(
                    teamId!
                ).then(
                    (res:BackendResponse) => {
                        if (res.success) {
                            setTeam(res.data);
                        } else {
                            setErrorMessage(res.data.message);
                        }
                    }
                )
            }
        },
        []
    )

    return (
        <div id='team-overview-parent'>
            <h1 className="big-h1-title">
                {team?.team_name}
            </h1>
            <div id='team-overview-content'>
                <div>
                    {errorMessage}
                </div>
                <Link
                    to={`/team/${teamId}/scrape`}
                >
                    Scrape
                </Link>
            </div>
        </div>
    );
}