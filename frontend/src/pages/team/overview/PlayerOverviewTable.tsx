import { getTeamOverviewHeaders } from "../../../helpers/other";
import { PlayerOverviewTableData, PlayerOverviewTableRow } from "../../../types/OverviewTableData"
import { OverviewTable } from "./OverviewTable"

export const PlayerOverviewTable = (props:PlayerOverviewTableData) => {

    const generateRows = (rows:PlayerOverviewTableRow[]) => {
        var return_me = [] as JSX.Element[];
        var ix = 1;
        for (const row_obj of rows) {
            const row = [
                <strong>{ix}</strong>,
                <td><a href={`/player/${row_obj.player.player_id}`}>{row_obj.player.player_name}</a></td>,
                <td>{row_obj.val}</td>
            ] as JSX.Element[];
            return_me.push(<tr>{row}</tr>);
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