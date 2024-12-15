import { OverviewTableData } from "../../../types/OverviewTableData"

export const OverviewTable = (props:OverviewTableData) => {

    const generateRow = (row:string[],ix:number) => {
        var arrayToReturn = [
            <td><strong>{ix+1}</strong></td>
        ];
        for (const val of row) {
            arrayToReturn.push(
                <td>{val}</td>
            )
        }
        return arrayToReturn;
    }

    return (
        <div className='overview-table-div'>
            <h6 className="overview-table-title">
                {props.title.toUpperCase()}
            </h6>
            <table className="overview-table-table">
                <thead>
                    <tr>
                        {
                            [""].concat(props.column_headers).map(
                                (header:string) => {
                                    return <th>{header}</th>
                                }
                            )
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        props.rows.map(
                            (row:string[],ix:number) => {
                                return (
                                    <tr>
                                        {generateRow(row, ix)}
                                    </tr>
                                )
                            }
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}