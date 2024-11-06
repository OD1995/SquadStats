import { FormControl, InputLabel, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const TeamScrape = () => {

    const [seasons, setSeasons] = useState([]);
    let { team_id } = useParams();

    useEffect(
        () => {
            
        }
    )

    return (
        <div id='team-scrape-parent'>
            <div id='team-scrape-input-parent'>
                <FormControl>
                    <InputLabel>
                        Season
                    </InputLabel>
                    <Select>

                    </Select>
                </FormControl>
            </div>
        </div>
    );
}