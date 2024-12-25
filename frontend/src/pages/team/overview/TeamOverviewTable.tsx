import { generateId, getTeamOverviewHeaders } from "../../../helpers/other"
import { Match } from "../../../types/Match"
import { TeamOverviewTableData } from "../../../types/OverviewTableData"
import { OverviewTable } from "./OverviewTable"

export const TeamOverviewTable = (props:TeamOverviewTableData) => {    

    const generateRows = (rows:Match[]) => {
        var return_me = [] as JSX.Element[];
        var ix = 1;
        for (const match of rows) {
            const row = [
                <td key={generateId()} className="table-row-rank">{ix}</td>,
                <td key={generateId()}><a href={`/match/${match.match_id}`}>{`${match.opposition_team_name} (${match.home_away_neutral[0]})`}</a></td>,
                <td key={generateId()}>{`${match.goals_for}-${match.goals_against}`}</td>,
                <td key={generateId()}>{match.date}</td>
            ] as JSX.Element[];
            return_me.push(<tr key={generateId()}>{row}</tr>);
            ix += 1;
        }
        return return_me;
    }
    
    return (
        <OverviewTable
            title={props.title}
            column_headers={getTeamOverviewHeaders(props.column_headers)}
            rows={generateRows(props.rows)}
        />
    )
}