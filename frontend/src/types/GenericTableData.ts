export interface GenericTableData {
    title:string
    column_headers:string[]
    rows:Record<string, number|string>[]
}