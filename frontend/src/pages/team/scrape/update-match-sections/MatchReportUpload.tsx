import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import { Match } from "../../../../types/Match";
import { ChangeEvent, useEffect, useState } from "react";
import { MATCH_REPORT_TYPES } from "../../../../types/enums";
import { MatchReportImageUpload } from "./MatchReportImageUpload";
import { MatchReportTextUpload } from "./MatchReportTextUpload";
import { UploadedImage } from "../../../../types/UploadedImage";
import { generateId } from "../../../../helpers/other";

interface OwnProps {
    match:Match
    setMatch:Function
    images:UploadedImage[]
    setImages:Function
}

export const MatchReportUpload = (props:OwnProps) => {

    const [selectedVal, setSelectedVal] = useState<string>(MATCH_REPORT_TYPES.NO);

    useEffect(
        () => {
            if (props.match.match_report_image_ids) {
                setSelectedVal(MATCH_REPORT_TYPES.NO_ALREADY_EXISTS);
            } else if (props.match.match_report_text) {
                setSelectedVal(MATCH_REPORT_TYPES.YES_TEXT);
            }
        },
        []
    )

    const handleRadioButtonChange = (event:ChangeEvent<HTMLInputElement>) => {
        const newVal = event.target.value
        setSelectedVal(newVal);
        switch (newVal) {
            case MATCH_REPORT_TYPES.YES_IMAGE:
                props.setMatch(
                    (oldMatch:Match) => ({
                        ...oldMatch,
                        match_report_text: null,
                    })
                );
                break;
            case MATCH_REPORT_TYPES.YES_TEXT:
                props.setMatch(
                    (oldMatch:Match) => ({
                        ...oldMatch,
                        match_report_image_ids: null,
                    })
                );
                break;
            case MATCH_REPORT_TYPES.NO:
                props.setMatch(
                    (oldMatch:Match) => ({
                        ...oldMatch,
                        match_report_text: null,
                        match_report_image_ids: null,
                    })
                );
                break;
        }
    }

    return (
        <div>
            <FormControl
                sx={{
                    // width: "90vw"
                }}
            >
                <FormLabel disabled={true}>
                    Do you want to upload a match report?
                </FormLabel>
                <RadioGroup
                    name="controlled-radio-buttons-group"
                    value={selectedVal}
                    onChange={handleRadioButtonChange}
                >
                    {
                        [
                            MATCH_REPORT_TYPES.NO_ALREADY_EXISTS,
                            MATCH_REPORT_TYPES.YES_IMAGE,
                            MATCH_REPORT_TYPES.YES_TEXT,
                            MATCH_REPORT_TYPES.NO
                        ].map(
                            (option:MATCH_REPORT_TYPES) => (
                                <FormControlLabel
                                    key={generateId()}
                                    value={option}
                                    control={<Radio/>}
                                    label={option}
                                />
                            )
                        )
                    }
                </RadioGroup>
            </FormControl>
            <div id='match-report-uploader'>
                {
                    (selectedVal == MATCH_REPORT_TYPES.YES_IMAGE) && (
                        <MatchReportImageUpload
                            images={props.images}
                            setImages={props.setImages}
                        />
                    )
                }
                {
                    (selectedVal == MATCH_REPORT_TYPES.YES_TEXT) && (
                        <MatchReportTextUpload
                            match={props.match}
                            setMatch={props.setMatch}
                        />
                    )
                }
            </div>
        </div>
    );
}