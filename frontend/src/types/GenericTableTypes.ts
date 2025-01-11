export interface GenericTableData {
    title?:string
    column_headers:string[]
    rows:GenericTableRow[]
    is_ranked?:boolean
    sort_by?:string
    sort_direction?:"asc"|"desc"
    not_sortable:boolean
}

export interface GenericTableRow extends Record<string, GenericTableCell> {
}

export interface GenericTableCell {
    value:string|number
    link?:string
    class_name?:string
    styles?:Record<string,string>
}