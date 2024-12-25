import { OverviewTableData } from "../../../types/OverviewTableData"
import { generateId } from "../../../helpers/other"
import { Table } from "../../../generic/Table"

export const OverviewTable = (props:OverviewTableData) => {

    return (
        <div key={generateId()} className='overview-table-div'>
            <h6 className="overview-table-title">
                {props.title.toUpperCase()}
            </h6>
            <Table
                headers={<tr>{props.column_headers}</tr>}
                rows={props.rows}
            />
        </div>
    )
}