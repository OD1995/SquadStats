import { OverviewTableData } from "../../../types/OverviewTableData"

export const OverviewTable = (props:OverviewTableData) => {

    return (
        <div className='overview-table-div'>
            <h6 className="overview-table-title">
                {props.title.toUpperCase()}
            </h6>
            <table className="overview-table-table">
                <thead>
                    <tr>
                        {props.column_headers}
                    </tr>
                </thead>
                <tbody>
                    {props.rows}
                </tbody>
            </table>
        </div>
    )
}