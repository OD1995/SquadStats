import { useMemo, useState } from "react";
import { 
    Box, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TablePagination, 
    TableRow, TableSortLabel
} from "@mui/material";
import { GenericTableData } from "../types/GenericTableData";

interface OwnProps extends GenericTableData {
    rowsPerPage:number
    isRanked:boolean
}

export const SortableTable = (props:OwnProps) => {

    const [sortBy, setSortBy] = useState<string>();
    const [sortDirection, setSortDirection] = useState<"asc"|"desc">("asc");
    const [page, setPage] = useState<number>(0);

    const handleSortClick = (columnToSortBy:string) => {
        const direction = columnToSortBy == sortBy ? 
            (sortDirection == "asc" ? "desc" : "asc") : 
            "desc"; 
        setSortDirection(direction);
        setSortBy(columnToSortBy);
    }

    const descendingComparator = (
        a:Record<string, number|string>,
        b:Record<string, number|string>,
        sortBy:string
    ) => {
        if (b[sortBy] < a[sortBy]) {
            return -1;
        }
        if (b[sortBy] > a[sortBy]) {
            return 1;
        }
        return 0;
    }

    const visibleRows = useMemo(
        () =>
            [...props.rows]
            .sort(sortDirection == "desc"
                ? (a, b) => descendingComparator(a, b, sortBy!)
                : (a, b) => -descendingComparator(a, b, sortBy!)
            )
            .slice(page * props.rowsPerPage, page * props.rowsPerPage + props.rowsPerPage),
        [sortBy, sortDirection, page, props.rowsPerPage],
    );

    const handlePageChange = (event:unknown, newPage:number) => {
        setPage(newPage);
    }

    return (
        <Box
            sx={{ width: '100%' }}
        >
            <Paper
                sx={{ width: '100%', mb: 2 }}
            >
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={true ? 'small' : 'medium'}
                    >
                        <TableHead>
                            <TableRow>
                                {
                                    (props.isRanked ? [""].concat(props.column_headers) : props.column_headers).map(
                                        (colHeader:string) => (
                                            <TableCell
                                                key={colHeader}
                                                sx={{fontWeight:"bold"}}
                                                align="center"
                                                padding="normal"
                                                sortDirection={sortDirection}
                                            >
                                                <TableSortLabel
                                                    active={sortBy == colHeader}
                                                    direction={sortBy == colHeader ? sortDirection : "desc"}
                                                    onClick={() => handleSortClick(colHeader)}
                                                >
                                                    {colHeader}
                                                </TableSortLabel>
                                            </TableCell>
                                        )
                                    )
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                visibleRows.map(
                                    (row:Record<string, number|string>, rowNum:number) => (
                                        <TableRow
                                            key={rowNum}
                                        >
                                            {
                                                props.isRanked && (
                                                    <TableCell
                                                        key={rowNum + "-rank"}
                                                        sx={{fontWeight:"bold"}}
                                                        align="center"
                                                    >
                                                        {page * props.rowsPerPage + rowNum + 1}
                                                    </TableCell>
                                                )
                                            }
                                            {
                                                Object.values(row).map(
                                                    (val:number|string, colNum:number) => (
                                                        <TableCell
                                                            key={`${rowNum}-${colNum}`}
                                                            align="center"
                                                        >
                                                            {val}
                                                        </TableCell>
                                                    )
                                                )
                                            }
                                        </TableRow>
                                    )
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={props.rows.length}
                    rowsPerPage={props.rowsPerPage}
                    rowsPerPageOptions={[]}
                    page={page}
                    onPageChange={handlePageChange}
                />
            </Paper>
        </Box>
    );
}