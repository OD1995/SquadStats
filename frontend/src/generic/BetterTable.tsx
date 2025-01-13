import { useEffect, useMemo, useState } from "react";
import { 
    Box,Table, TableBody, TableCell, 
    TableContainer, TableHead, TablePagination, 
    TableRow, TableSortLabel
} from "@mui/material";
import { GenericTableData, GenericTableRow } from "../types/GenericTableTypes";
import "./BetterTable.css"

interface OwnProps extends GenericTableData {
    rowsPerPage:number
    titleClassName?:string
}

export const BetterTable = (props:OwnProps) => {

    const [sortBy, setSortBy] = useState<string>();
    const [sortDirection, setSortDirection] = useState<"asc"|"desc">("asc");
    const [page, setPage] = useState<number>(0);

    useEffect(
        () => {
            if (props.sort_by) {
                setSortBy(props.sort_by);
                if (props.sort_direction) {
                    setSortDirection(props.sort_direction);
                }
            }
            // if (props.column_headers.length == 0) {
            //     setSortBy("");
            //     setSortDirection("");
            // }
        },
        []
    )

    const handleSortClick = (columnToSortBy:string) => {
        const direction = columnToSortBy == sortBy ? 
            (sortDirection == "asc" ? "desc" : "asc") : 
            "desc"; 
        setSortDirection(direction);
        setSortBy(columnToSortBy);
    }

    const descendingComparator = (
        a:GenericTableRow,
        b:GenericTableRow,
        sortBy:string
    ) => {
        if (!sortBy) {
            return 1;
        }
        const aVal = a[sortBy].value;
        const bVal = b[sortBy].value;
        if (bVal < aVal) {
            return -1;
        }
        if (bVal> aVal) {
            return 1;
        }
        return 0;
    }

    const visibleRows = useMemo(
        () => {
            if (props.not_sortable) {
                return props.rows
            }
            return [...props.rows]
                .sort(sortDirection == "desc"
                    ? (a, b) => descendingComparator(a, b, sortBy!)
                    : (a, b) => -descendingComparator(a, b, sortBy!)
                )
                .slice(page * props.rowsPerPage, page * props.rowsPerPage + props.rowsPerPage)
        },
        [sortBy, sortDirection, page, props.rowsPerPage],
    );

    const handlePageChange = (_:unknown, newPage:number) => {
        setPage(newPage);
    }

    const getColSpan = () => {
        return props.column_headers.length + (props.is_ranked ? 1 : 0)
    }

    const getEmptyRow = () => {
        return (
            <TableRow>
                <TableCell 
                    sx={{
                        textAlign: 'center',
                        // columnSpan: 10//getColSpan()
                    }}
                    colSpan={getColSpan()}
                >
                    <i>
                        No data available
                    </i>
                </TableCell>
            </TableRow>
        )
    }

    return (
        <Box
            sx={{
                width: '100%',
                paddingBottom: '2vh'
            }}
        >
            {
                props.title && (
                    <h4 
                        className={props.titleClassName ?? "sortable-table-title"}
                    >
                        {props.title}
                    </h4>
                )
            }
            <TableContainer>
                <Table
                    // sx={{ minWidth: 750 }}
                    aria-labelledby="tableTitle"
                    size={true ? 'small' : 'medium'}
                >
                    <TableHead>
                        <TableRow>
                            {
                                (props.is_ranked ? [""].concat(props.column_headers) : props.column_headers).map(
                                    (colHeader:string) => (
                                        <TableCell
                                            key={colHeader}
                                            sx={{
                                                fontWeight: "bold",
                                                padding: "0"
                                            }}
                                            align="center"
                                            sortDirection={sortDirection}
                                        >
                                            {
                                                props.not_sortable ? (
                                                    <span>
                                                        {colHeader}
                                                    </span>
                                                ) : (
                                                    <TableSortLabel
                                                        active={sortBy == colHeader}
                                                        direction={sortBy == colHeader ? sortDirection : "desc"}
                                                        hideSortIcon={true}
                                                        onClick={() => handleSortClick(colHeader)}
                                                    >
                                                        {colHeader}
                                                    </TableSortLabel>
                                                )
                                            }
                                        </TableCell>
                                    )
                                )
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            (visibleRows.length > 0) ? (
                                visibleRows.map(
                                    (row:GenericTableRow, rowNum:number) => (
                                        <TableRow
                                            key={rowNum}
                                        >
                                            {
                                                props.is_ranked && (
                                                    <TableCell
                                                        key={rowNum + "-rank"}
                                                        sx={{
                                                            fontWeight: "bold",
                                                            padding: "0"
                                                        }}
                                                        align="center"
                                                    >
                                                        {page * props.rowsPerPage + rowNum + 1}
                                                    </TableCell>
                                                )
                                            }
                                            {
                                                props.column_headers.map(
                                                    (colHeader:string, colNum:number) => {
                                                        var styles = row[colHeader].styles ?? {} as Record<string,string>;
                                                        styles['padding'] = "0";
                                                        styles['maxWidth'] = '20vw';
                                                        return (
                                                            <TableCell
                                                                key={`${rowNum}-${colNum}`}
                                                                className={row[colHeader].class_name}
                                                                align="center"
                                                                sx={styles}
                                                            >
                                                                {
                                                                    (row[colHeader].link) ? (
                                                                        <a href={row[colHeader].link}>
                                                                            {row[colHeader].value}
                                                                        </a>
                                                                    ) : (
                                                                        <>
                                                                            {row[colHeader].value}
                                                                        </>
                                                                    )
                                                                }
                                                            </TableCell>
                                                        )
                                                    }
                                                )
                                            }
                                        </TableRow>
                                    )
                                )
                            ) : getEmptyRow()
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {
                (props.rowsPerPage < props.rows.length) && (
                    <TablePagination
                        component="div"
                        count={props.rows.length}
                        rowsPerPage={props.rowsPerPage}
                        rowsPerPageOptions={[]}
                        page={page}
                        onPageChange={handlePageChange}
                    />
                )
            }
        </Box>
    );
}