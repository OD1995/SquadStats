import { Match } from "./Match";
import { Player } from "./Player";

export interface OverviewTableData {
    title:string,
    column_headers:JSX.Element[],
    rows:JSX.Element[]
}

export interface TeamOverviewTableData {
    title:string,
    column_headers:string[],
    rows:Match[]
}

export interface PlayerOverviewTableData {
    title:string,
    column_headers:string[],
    rows:PlayerOverviewTableRow[]    
}

export interface PlayerOverviewTableRow {
    player:Player,
    val:number
}