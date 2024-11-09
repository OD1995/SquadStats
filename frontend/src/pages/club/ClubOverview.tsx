import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { userSelector } from "../../store/slices/userSlice";
import { useEffect, useState } from "react";
import { User } from "../../types/User";
import { Club } from "../../types/Club";
import ClubService from "../../services/ClubService";
import { BackendResponse } from "../../types/BackendResponse";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Team } from "../../types/Team";

interface ClubOverviewProps {
    // club_id:string
}

export const ClubOverview = (props:ClubOverviewProps) => {

    const [club, setClub] = useState<Club>();
    const [errorMessage, setErrorMessage] = useState("");

    let { clubId } = useParams();
    const user = useSelector(userSelector);

    useEffect(
        () => {
            var _club_ = getClub(user, clubId);
            if (_club_) {
                setClub(_club_);
            } else {
                ClubService.getClubInformation(
                    clubId!
                ).then(
                    (res:BackendResponse) => {
                        if (res.success) {
                            setClub(res.data);
                        } else {
                            setErrorMessage(res.data.message);
                        }
                    }
                )
            }
        },
        []
    )

    const getClub = (user:User|null, clubId:string|undefined) : Club|null => {
        if (user == null) {
            return null;
        }
        for (const club of user.clubs) {
            if (club.club_id == clubId) {
                return club
            }
        }
        return null;
    }

    return (
        <div id='club-overview-parent-div'>
            <h1 className="big-h1-title">
                {club?.club_name}
            </h1>
            <div id='club-overview-content'>
                <div>
                    {errorMessage}
                </div>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow className="ss-table-head">
                                <TableCell
                                    className="club-overview-cell"
                                >
                                    Team
                                </TableCell>
                                <TableCell
                                    className="club-overview-cell"
                                >
                                    League
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                club?.teams.map(
                                    (team:Team) => {
                                        const rows = [];
                                        const teamVal = (
                                            <Link to={`/team/${team.team_id}/overview`}>
                                                {team.team_name}
                                            </Link>
                                        );
                                        rows.push(
                                            <TableRow
                                                key={team.team_name + "-" + Math.random()}
                                            >
                                                <TableCell
                                                    className="club-overview-cell"
                                                >
                                                    {teamVal}
                                                </TableCell>
                                            </TableRow>
                                        )
                                        return rows;
                                    }
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
}