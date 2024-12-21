import { Table as MuiTable, TableBody, TableContainer, TableHead } from "@mui/material";
interface TableProps {
    headers:any
    rows:any[]
    className?:string
}

export const Table = (props:TableProps) => {
    if (props.rows.length == 0) {
        return null;
    }
    return (
        <TableContainer className={props.className}>
            <MuiTable>
                <TableHead>
                    {props.headers}
                </TableHead>
                <TableBody>
                    {props.rows}
                </TableBody>
            </MuiTable>
        </TableContainer>
    )
}