import { TableCell, TableRow } from "@mui/material";
import { Club } from "../types/Club";
import { Team } from "../types/Team";
import { User } from "../types/User";
import { TableCellValue } from "../types/TableCellValue";
import { GenericTableData } from "../types/GenericTableTypes";

export const getTeam = (user:User|null, teamId:string|undefined) : Team|null => {
    if (user == null) {
        return null;
    }
    for (const club of user.clubs) {
        for (const team of club.teams) {
            if (team.team_id == teamId) {
                return team;
            }
        }
    }
    return null;
}


export const getClub = (user:User|null, clubId:string|undefined) : Club|null => {
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

export function toEntries<T>(a: T[]) {
    return a.map((value, index) => [index, value] as const);
}

export const generateHeaderRow = (cols:string[]) => {
    return (
        <TableRow className="ss-table-head">
            {cols.map((col:string) => <TableCell className="ss-table-cell">{col}</TableCell>)}
        </TableRow>
    )
}

export const generateBodyRow = (values:TableCellValue[]) => {
    return (
        <TableRow>
            {
                values.map(
                    (val:TableCellValue) => {
                        return (
                            <TableCell className={"ss-table-cell " + val.className}>
                                {val.value}
                            </TableCell>
                        )
                    }
                )
            }
        </TableRow>
    )
}

export const getTeamOverviewHeaders = (columnHeaders:string[]) => {    
    return [""].concat(columnHeaders).map(
        (header:string) => {
            return <th key={generateId()}>{header}</th>
        }
    )
}

export const getIsClubAdmin = (
    user:User|null,
    clubId:string|null
) => {
    if (user && clubId) {
        for (const club of user.clubs) {
            if (club.club_id == clubId) {
                return true;
            }
        }
    }
    return false;
}

export const getClubId = (user:User, teamId:string) => {
    for (const club of user.clubs) {
        for (const team of club.teams) {
            if (team.team_id == teamId) {
                return club.club_id;
            }
        }
    }
    return null;
}

export const generateId = () => {
    return Math.floor(Math.random() * 10000)
}

export const getBigTitle = (title:string|undefined) => {
    if (title == undefined) {
        return;
    }
    var val = 2;
    const max_chars = 16
    if (title.length > max_chars) {
        val -= (title.length - max_chars) * 0.0455
    }
    return (
        <h1
            style={{
                marginLeft: "5vw",
                fontSize: `${val}rem`,
                marginBottom: "3vh",
            }}
        >
            {title}
        </h1>
    )
}

export const getOverviewRowCount = (
    matchesData:GenericTableData[],
    playersData:GenericTableData[]
) => {
    var rowCount = 0;
    for (const tableData of matchesData.concat(playersData)) {
        rowCount += tableData.rows.length;
    }
    return rowCount;
}

// export const wait = (seconds:number) => {
//     return new Promise(res => setTimeout(res, seconds));
// }

// function msleep(secs:number) {
//     Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, secs);
// }
// export const sleep = (secs:number) => {
//     msleep(secs*1000);
// }