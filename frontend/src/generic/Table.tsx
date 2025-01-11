import { Table as MuiTable, TableBody, TableContainer, TableHead } from "@mui/material";
import { generateId } from "../helpers/other";
interface TableProps {
    headers:any
    rows:any[]
    className?:string
    notSsTable?:boolean
}

export const Table = (props:TableProps) => {
    // if (props.rows.length == 0) {
    //     return null;
    // }

    const createEmptyRow = () => {
        var colWidth = 1;
        if (props.headers) {
            colWidth = props.headers.props.children.length;
        }
        return (
            <tr
                key={generateId()}
                style={{'textAlign': 'center'}}
            >
                <td
                    colSpan={colWidth}
                    // style={{
                    //     'columnSpan': props.headers.props.children.length,
                    //     // 'textAlign': 'center'
                    // }}
                >
                    <i>
                        No data available
                    </i>
                </td>
            </tr>
        );
    }

    const createClassName = () => {
        var cn = "";
        if (props.className) {
            cn += props.className;
        }
        if (!props.notSsTable) {
            cn += " ss-table";
        }
        return cn;
    }

    return (
        <TableContainer className={createClassName()}>
            <MuiTable>
                <TableHead>
                    {props.headers}
                </TableHead>
                <TableBody>
                    {
                        (props.rows.length == 0) ? createEmptyRow() : props.rows
                    }
                </TableBody>
            </MuiTable>
        </TableContainer>
    )
}