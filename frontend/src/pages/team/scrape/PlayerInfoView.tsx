import { Table } from "../../../generic/Table";
import { generateBodyRow, generateHeaderRow } from "../../../helpers/other";
import { Match } from "../../../types/Match";
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import { TableCellValue } from "../../../types/TableCellValue";
import { useEffect } from "react";
import { Checkbox } from "@mui/material";

interface PlayerInfoViewProps {
    successMatches:Match[]
    cols:string[]
    tickedBoxes:boolean[]
    setTickedBoxes:Function
}

export const PlayerInfoView = (props:PlayerInfoViewProps) => {

    useEffect(
        () => {
            var tb = [];
            for (const match of props.successMatches) {
                tb.push(!match.player_info_scraped);
            }
            props.setTickedBoxes(tb);
        },
        []
    )

    const handleChecking = (ix:number) => {
        props.setTickedBoxes(
            (oldTickedBoxes:boolean[]) => {
                var newTickedBoxes = [...oldTickedBoxes];
                newTickedBoxes[ix] = !newTickedBoxes[ix];
                return newTickedBoxes;
            }
        )
    }

    const createTableCellVal = (match:Match, ix:number) => {
        const playerInfoScrapedIcon = match.player_info_scraped ? (
            <DoneIcon style={{color:'green'}}/>
        ) : (
            <CloseIcon style={{color:'red'}}/>
        )
        const checkbox = (
            <Checkbox
                checked={props.tickedBoxes[ix]}
                onChange={() => handleChecking(ix)}
            />
        )
        return [
            {value:match.date},
            {value:match.time},
            {value:match.opposition_team_name},
            {value:match.competition_acronym},
            {value:match.goals_for},
            {value:match.goals_against},
            {value:playerInfoScrapedIcon},
            {value:checkbox}
        ] as TableCellValue[];
    }

    if (props.tickedBoxes.length > 0) {
        return (
            <>
                <i style={{textAlign:'center', marginBottom:'2vh'}}>
                    All matches without scraped player performance data automatically has its box ticked in the Queued To Scrape column.
                    <br/>
                    Tick any other boxes if you want to re-scrape and update the match's data. 
                    <br/>
                    Then hit the Update button above.
                </i>
                <Table
                    headers={generateHeaderRow(props.cols.concat('Queued To Scrape'))}
                    rows={props.successMatches.map(
                        (match:Match, ix:number) => generateBodyRow(createTableCellVal(match,ix))
                    )}
                />            
            </>
        );
    } else {
        return null;
    }
}