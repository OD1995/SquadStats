import { OverviewTableData } from "../../../types/OverviewTableData"

export const OverviewTable = (props:OverviewTableData) => {
    return (
        <div className='overview-table-div'>
            {props.title}
            <table>
                <thead>
                    <tr>
                        {
                            props.column_headers.map(
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
                            (row:string[]) => {
                                return (
                                    <tr>
                                        {
                                            row.map(
                                                (val:string) => {
                                                    return <td>{val}</td>
                                                }
                                            )
                                        }
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