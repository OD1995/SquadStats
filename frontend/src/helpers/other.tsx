import { TableCell, TableRow } from "@mui/material";
import { Club } from "../types/Club";
import { Team } from "../types/Team";
import { User } from "../types/User";
import { TableCellValue } from "../types/TableCellValue";
import { GenericTableData } from "../types/GenericTableTypes";
import { METRIC } from "../types/enums";

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
                            <TableCell
                                className={"ss-table-cell " + val.className}
                                key={generateId()}
                            >
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

export const getFontSize = (
    text:string,
    startingVal:number,
    maxChars:number,
    increment:number
) => {
    var val = startingVal;
    if (text.length > maxChars) {
        val -= (text.length - maxChars) * increment
    }
    return `${val}rem`
}

export const getBigTitle = (title:string|undefined) => {
    if (title == undefined) {
        return;
    }
    // var val = 2;
    // const max_chars = 16
    // if (title.length > max_chars) {
    //     val -= (title.length - max_chars) * 0.0455
    // }
    return (
        <h1
            style={{
                marginLeft: "5vw",
                // fontSize: `${val}rem`,
                fontSize: getFontSize(title, 2, 16, 0.0455),
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

export const generateShareId = (cId:string) => {
    const halfLength = cId.length / 2;
    const firstHalf = cId.substring(0, halfLength);
    const secondHalf = cId.substring(halfLength, halfLength * 2);
    return firstHalf + cId + secondHalf
}

export const reverseEngineerShareId = (shareId:string) => {
    return shareId.substring(18, 18+36);
}

export const getAllLinkedTeams = (user:User) => {
    var linkedTeams = [] as Team[];
    for (const club of user.clubs) {
        for (const team of club.teams) {
            linkedTeams.push(team);
        }
    }
    return linkedTeams;
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

export function getStringUpToChar(str:string, char:string) {
    const index = str.indexOf(char);
    return index !== -1 ? str.slice(0, index) : str;
}

export const getImageSource = (imageId:string) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    return `https://res.cloudinary.com/${cloudName}/image/upload/${imageId}`
}

export const improveSeasonName = (seasonName:string) => {
    return isNumeric(seasonName) ? `Season ${seasonName}` : seasonName;
}

export const isNumeric = (val: string) : boolean => {
    return !isNaN(Number(val));
}

export const minAppsRelevant = (perGame:any, metric:any) => {
    if (perGame) {
        return true;
    }   
    const minAppsMetrics = [
        METRIC.POINTS_PER_GAME,
        METRIC.GOALS_SCORED,
        METRIC.GOALS_CONCEDED,
        METRIC.GOAL_DIFFERENCE
    ].map(
        (met:METRIC) => met.valueOf()
    );
    return minAppsMetrics.includes(metric);
}