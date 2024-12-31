import { generateId } from "../helpers/other"
import { Table } from "./Table"
import "./TableWithTitle.css"

interface OwnProps {
    title:string
    columnHeadersStr?:string[]
    columnHeadersJsx?:JSX.Element[]
    rowsStr?:string[][]
    rowsJsx?:JSX.Element[]
    tableClassName?:string
}

export const TableWithTitle = (props:OwnProps) => {

    const getHeaders = () => {
        if (props.columnHeadersJsx) {
            return props.columnHeadersJsx
        }
        return props.columnHeadersStr!.map(
            (header:string) => {
                return <th key={generateId()}>{header}</th>
            }
        )
    }

    const getRows = () => {
        if (props.rowsJsx) {
            return props.rowsJsx
        }
        return props.rowsStr!.map(
            (row:string[]) => {
                return (
                    <tr key={generateId()}>
                        {
                            row.map(
                                (val:string) => {
                                    return <td key={generateId()}>{val}</td>
                                }
                            )
                        }
                    </tr>
                )
            }
        )
    }

    return (
        <div key={generateId()} className='twt-parent'>
            <h6 className="twt-title">
                {props.title.toUpperCase()}
            </h6>
            <Table
                headers={<tr>{getHeaders()}</tr>}
                rows={getRows()}
                className={props.tableClassName}
            />
        </div>
    )
}