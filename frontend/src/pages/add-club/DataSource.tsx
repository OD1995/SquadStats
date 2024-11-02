import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material"
import { DATA_SOURCE } from "../../types/enums"
import { ChangeEvent } from "react"

interface DataSourceProps {
    dataSource:string
    setDataSource:Function
}

export const DataSource = (props:DataSourceProps) => {

    const handleRadioButtonChange = (event:ChangeEvent<HTMLInputElement>) => {
        props.setDataSource(event.target.value);
    }

    return (
        <div id='data-source-parent'>
            <FormControl>
                <FormLabel disabled={true}>
                    What will your data source be?
                </FormLabel>
                <RadioGroup
                    name="controlled-radio-buttons-group"
                    value={props.dataSource}
                    onChange={handleRadioButtonChange}
                >
                    <FormControlLabel
                        value={DATA_SOURCE.FOOTBALL_ASSOCIATION}
                        control={<Radio/>}
                        label='Football Association website (fulltime.thefa.com)'
                    />
                    <FormControlLabel
                        value={DATA_SOURCE.MANUAL}
                        control={<Radio/>}
                        label='Manual Entry'
                    />
                </RadioGroup>
            </FormControl>
        </div>
    )
}