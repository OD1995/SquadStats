import { Table, TableBody, TableCell, TableHead, TableContainer, TableRow } from "@mui/material";
import { useSelector } from "react-redux";
import { userSelector } from "../../store/slices/userSlice";
import { Club } from "../../types/Club";
import "./MyClubs.css"
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const MyClubs = () => {

    const navigate = useNavigate();
    const user = useSelector(userSelector);

    useEffect(
        () => {
            if (!user) {
                navigate("/about")
            }
        }
    )

    return (
        <div id='my-clubs-parent-div'>
            <h1 className="big-h1-title">
                My Clubs
            </h1>
            <div id='my-clubs-content'>
                <TableContainer id='my-clubs-table-container'>
                    <Table>
                        <TableHead>
                            <TableRow className="ss-table-head">
                                <TableCell
                                    className="my-clubs-cell"
                                >
                                    Club
                                </TableCell>
                                <TableCell
                                    className="my-clubs-cell"
                                >
                                    Team
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                user?.clubs.map(
                                    (club:Club) => {
                                        const rows = [];
                                        var isFirstRow = true;
                                        var ix = 0;
                                        for (const team of club.teams) {
                                            var clubVal = null;
                                            if (isFirstRow) {
                                                clubVal = (
                                                    <Link to={`/club/${club.club_id}/overview`}>
                                                        {club.club_name}
                                                    </Link>
                                                );
                                                isFirstRow = false;
                                            }
                                            const teamVal = (
                                                <Link to={`/team/${team.team_id}/overview`}>
                                                    {team.team_name}
                                                </Link>
                                            );
                                            rows.push(
                                                <TableRow
                                                    key={team.team_name + "-" + ix}
                                                >
                                                    <TableCell
                                                        className="my-clubs-cell"
                                                    >
                                                        {clubVal}
                                                    </TableCell>
                                                    <TableCell
                                                        className="my-clubs-cell"
                                                    >
                                                        {teamVal}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                            ix += 1;
                                        }
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