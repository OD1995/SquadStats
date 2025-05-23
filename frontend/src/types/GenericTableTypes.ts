export interface GenericTableData {
    title?:string
    column_headers:string[]
    rows:GenericTableRow[]
    is_ranked?:boolean
    sort_by?:string
    sort_direction?:"asc"|"desc"
    not_sortable:boolean
    column_ratio:number[]|null
}

export interface GenericTableRow extends Record<string, GenericTableCell> {
}

export interface GenericTableCell {
    value:string|number
    value_for_sorting?:string|number
    link?:string
    class_name?:string
    styles?:Record<string,string>
}