import { useEffect, useState } from "react";
import { Team } from "../../../types/Team";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { userSelector } from "../../../store/slices/userSlice";
import TeamService from "../../../services/TeamService";
import { BackendResponse } from "../../../types/BackendResponse";
import { getTeam } from "../../../helpers/other";
import { OverviewTableData } from "../../../types/OverviewTableData";
import { OverviewTable } from "./OverviewTable";
import "./TeamOverview.css";

export const TeamOverview = () => {

    const [team, setTeam] = useState<Team>();
    const [errorMessage, setErrorMessage] = useState("");
    const [tableDataArray, setTableDataArray] = useState<OverviewTableData[]>([]);

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
            TeamService.getTeamOverviewStats(
                teamId!
            ).then(
                (res:BackendResponse) => {
                    if (res.success) {
                        setTableDataArray(res.data);
                    } else {
                        setErrorMessage(res.data.message);
                    }
                }
            )
        },
        []
    )

    return (
        <div id='team-overview-parent'>
            <h1 className="big-h1-title">
                {team?.team_name}
            </h1>
            <div id='team-overview-content'>
                <div id='team-overview-link-bar'>
                    <Link
                        to={`/team/${teamId}/scrape`}
                    >
                        Scrape
                    </Link>
                    <Link
                        to={`/team/${teamId}/scrape`}
                    >
                        Team Stats
                    </Link>
                    <Link
                        to={`/team/${teamId}/scrape`}
                    >
                        Player Stats
                    </Link>
                </div>
                <div>
                    {errorMessage}
                </div>
                <div id='team-overview-tables-div'>
                    {
                        tableDataArray.map(
                            (overviewTableData:OverviewTableData) => {
                                return <OverviewTable {...overviewTableData}/>
                            }
                        )
                    }
                </div>
            </div>
        </div>
    );
}