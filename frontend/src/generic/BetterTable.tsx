import { useEffect, useMemo, useState } from "react";
import { 
    Box,Table, TableBody, TableCell, 
    TableContainer, TableHead, TablePagination, 
    TableRow, TableSortLabel
} from "@mui/material";
import { GenericTableCell, GenericTableData, GenericTableRow } from "../types/GenericTableTypes";
import "./BetterTable.css"
import { getFontSize, isNumeric } from "../helpers/other";
import { isWiderThanHigher } from "../helpers/windowDimensions";

interface OwnProps extends GenericTableData {
    rowsPerPage:number
    titleClassName?:string
    tableClassName?:string
}

export const BetterTable = (props:OwnProps) => {

    const [sortBy, setSortBy] = useState<string>();
    const [sortDirection, setSortDirection] = useState<"asc"|"desc">("asc");
    const [page, setPage] = useState<number>(0);

    const isDesktop = isWiderThanHigher();

    useEffect(
        () => {
            if (props.sort_by) {
                setSortBy(props.sort_by);
                if (props.sort_direction) {
                    setSortDirection(props.sort_direction);
                }
            }
        },
        []
    )

    const getBetterTableFontSize = () => {
        if (isDesktop) {
            return 1;
        }
        var val = 1.15;
        val -= (0.1 * props.column_headers.length);
        // val = Math.max(val, 0.6);
        val = Math.max(val, 0.8);
        val = Math.round(val * 100) / 100
        return val;
    }

    const handleSortClick = (columnToSortBy:string) => {
        const direction = columnToSortBy == sortBy ? 
            (sortDirection == "asc" ? "desc" : "asc") : 
            "desc"; 
        setSortDirection(direction);
        setSortBy(columnToSortBy);
    }

    const getValueForSorting = (cell:GenericTableCell) => {
        return cell.value_for_sorting ?? cell.value;
    }

    const descendingComparator = (
        a:GenericTableRow,
        b:GenericTableRow,
        sortBy:string
    ) => {
        if (!sortBy) {
            return 1;
        }
        var aVal = getValueForSorting(a[sortBy]);
        var bVal = getValueForSorting(b[sortBy]);
        if (isNumeric(aVal) && isNumeric(bVal)) {
            aVal = Number(aVal);
            bVal = Number(bVal);
        }
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
        <div
            id='better-table-parent'
            className={props.tableClassName ?? ""}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: '1000px',
                    paddingBottom: '2vh',
                    // display: 'flex',
                    // textAlign: 'center'
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
                        aria-labelledby="tableTitle"
                        size={true ? 'small' : 'medium'}
                    >
                        <TableHead>
                            <TableRow>
                                {
                                    (props.is_ranked ? [""].concat(props.column_headers) : props.column_headers).map(
                                        (colHeader:string, ix:number) => {
                                            const fs1 = getBetterTableFontSize();
                                            const fs2 = getFontSize(
                                                colHeader,
                                                fs1,
                                                10,
                                                0.01,
                                                isDesktop
                                            );
                                            var styles = {
                                                fontWeight: "bold",
                                                padding: "0",
                                                fontSize: fs2,
                                            } as Record<string, string>;
                                            if (props.column_ratio) {
                                                styles["width"] = `${props.column_ratio[ix]}vw`
                                            }
                                            return (
                                                <TableCell
                                                    key={colHeader}
                                                    sx={styles}
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
                                        }
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
                                                            var styles = {} as Record<string,string>;
                                                            var val = '';
                                                            var cn = '';
                                                            var link = '';
                                                            if (row[colHeader]) {
                                                                if (row[colHeader].styles) {
                                                                    styles = row[colHeader].styles as Record<string,string>;
                                                                }
                                                                if (row[colHeader].value) {
                                                                    val = row[colHeader].value.toString();
                                                                }
                                                                if (row[colHeader].class_name) {
                                                                    cn = row[colHeader].class_name.toString();
                                                                }
                                                                if (row[colHeader].link) {
                                                                    link = row[colHeader].link;
                                                                }
                                                            }
                                                            // var styles = row[colHeader].styles ?? {} ;
                                                            styles['padding'] = "0";
                                                            styles['maxWidth'] = '20vw';
                                                            const fs1 = getBetterTableFontSize();
                                                            const fs2 = getFontSize(
                                                                val,
                                                                fs1,
                                                                10,
                                                                0.013,
                                                                isDesktop
                                                            );
                                                            styles["fontSize"] = fs2;
                                                            return (
                                                                <TableCell
                                                                    key={`${rowNum}-${colNum}`}
                                                                    className={cn}
                                                                    align="center"
                                                                    sx={styles}
                                                                >
                                                                    {
                                                                        (link) ? (
                                                                            <a href={link}>
                                                                                {val}
                                                                            </a>
                                                                        ) : (
                                                                            <>
                                                                                {val}
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
        </div>
    );
}