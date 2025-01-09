import { Match } from "../../../types/Match";
import { Table } from "../../../generic/Table";
import { Link, useParams } from "react-router-dom";
import { generateBodyRow, generateHeaderRow } from "../../../helpers/other";
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import { TableCellValue } from "../../../types/TableCellValue";

interface MatchInfoViewProps {
    successMatches:Match[]
    errorMatches:Match[]
    successCols:string[]
    dataLoaded:boolean
}

export const MatchInfoView = (props:MatchInfoViewProps) => {

    let { teamId } = useParams();

    const createTableCellValForErrorTable = (match:Match) => {
        var errorText = "";
        for (const matchError of match.match_errors) {
            errorText += matchError.error_message;
        }
        return [
            {value:match.date},
            {value:match.time},
            {value:match.opposition_team_name},
            {value:errorText, className:"ss-red-text"}
        ] as TableCellValue[];
    }

    const createTableCellValForSuccessTable = (match:Match) => {
        const playerInfoScrapedIcon = match.player_info_scraped ? (
            <DoneIcon style={{color:'green'}}/>
        ) : (
            <CloseIcon style={{color:'red'}}/>
        )
        return [
            {value:match.date},
            {value:match.time},
            {value:match.opposition_team_name},
            {value:match.competition_acronym},
            {value:match.goals_for},
            {value:match.goals_against},
            {value:match.notes},
            {value:playerInfoScrapedIcon}
        ] as TableCellValue[];
    }

    const errorCols = [
        'Date',
        'Time',
        'Opposition',
        'Errors'
    ]
    
    if (props.dataLoaded) {

        return (
            <>
                {
                    (props.errorMatches.length > 0) && (
                            <>
                                <h3
                                    style={{
                                        color: 'red',
                                        alignSelf: 'baseline'
                                    }}
                                >
                                    Match Info - Failure
                                </h3>
                                <i
                                    style={{
                                        color: 'red'
                                    }}
                                >
                                    Most errors will be because neither team name is expected. You can change that <Link target='_blank' to={`/team/${teamId}/team-names`}>here</Link>
                                </i>
                                <Table
                                    headers={generateHeaderRow(errorCols)}
                                    rows={props.errorMatches.map(
                                        (match:Match) => generateBodyRow(createTableCellValForErrorTable(match))
                                    )}
                                    notSsTable={true}
                                />
                            </>
                    )
                }
                {
                    (props.errorMatches.length > 0) && (
                        <h3 style={{color: 'green'}}>
                            Match Info - Success
                        </h3>
                    )
                }
                <Table
                    headers={generateHeaderRow(props.successCols)}
                    rows={props.successMatches.map(
                        (match:Match) => generateBodyRow(createTableCellValForSuccessTable(match))
                    )}
                    notSsTable={true}
                />
            </>
        )
    }
}