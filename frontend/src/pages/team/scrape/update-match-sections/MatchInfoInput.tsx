import { useState, useEffect } from "react";
import { Match } from "../../../../types/Match";
import { generateId, getFontSize } from "../../../../helpers/other";
import { BasicNumberInput } from "../../../../generic/BasicNumberInput";
import { MATCH_COMPETITION_TYPE, MATCH_LOCATION_TYPE } from "../../../../types/enums";
import { Loading } from "../../../../generic/Loading";
import { Competition } from "../../../../types/Competition";
import { GenericTableCell } from "../../../../types/GenericTableTypes";

interface OwnProps {
    match: Match;
    setMatch: (updater: (prevVal: Match) => Match) => void;
    locations: Record<string, string[]>|undefined
    competitions:Competition[]
    newCompName:string
    setNewCompName:Function
    newCompAcronym:string
    setNewCompAcronym:Function
    // newCompId:string
    newLocation:string
    setNewLocation:Function
}

export const MatchInfoInput = (props:OwnProps) => {
    const [showPens, setShowPens] = useState<boolean>(false);
    const [locationDropdownVal, setLocationDropdownVal] = useState<string>("");
    const [competitionDropdownVal, setCompetitionDropdownVal] = useState<string>("");

    // Function to update match properties (supports function updaters)
    const updateMatch = (
        key: keyof Match,
        updater: ((prev: number) => number) | number | string | null
    ) => {
        const isNewComp = (key == 'competition_id') && (updater == MATCH_COMPETITION_TYPE.NEW_COMPETITION);
        const isNewLoc = (key == 'location') && (updater == MATCH_LOCATION_TYPE.NEW_LOCATION);
        if ((!isNewComp) && (!isNewLoc)) {
            props.setMatch((prevMatch) => ({
                ...prevMatch,
                [key]: typeof updater === "function"
                    ? updater(prevMatch[key] as number ?? 0) // Ensure prev is always a number
                    : updater,
            }));
        }
    };

    // Automatically reset penalty values when `showPens` changes
    useEffect(() => {
        updateMatch("pens_for", showPens ? 0 : null);
        updateMatch("pens_against", showPens ? 0 : null);
    }, [showPens]);

    useEffect(
        () => {
            if ((props.newCompName != "") || (props.newCompAcronym != "")) {
                setCompetitionDropdownVal(MATCH_COMPETITION_TYPE.NEW_COMPETITION);
            }
            if (props.newLocation) {
                setLocationDropdownVal(MATCH_LOCATION_TYPE.NEW_LOCATION);
            }
        },
        []
    )


    // Labels for form fields
    const createBoldLabel = (txt:string) => {
        return {
            value: txt,
            styles: {
                fontWeight:'bold',
                fontSize: '0.9rem',
            }
        } as GenericTableCell
    }
    const createItalicLabel = (txt:string) => {
        return {
            value: txt,
            styles: {
                fontStyle: 'italic',
                fontSize: '0.75rem',
                textAlign: 'center'
            }
        } as GenericTableCell
    }
    const labels = [
        createBoldLabel("Competition"),
        ...(
            (competitionDropdownVal == MATCH_COMPETITION_TYPE.NEW_COMPETITION) ? 
            [
                createItalicLabel("New Competition Name"),
                createItalicLabel("New Competition Acronym/Shortening")
            ] : []
        ),
        createBoldLabel("Date"),
        createBoldLabel("Time"),
        createBoldLabel("Home/Away/Neutral"),
        createBoldLabel("Location"),
        ...(
            (locationDropdownVal == MATCH_LOCATION_TYPE.NEW_LOCATION) ?
            [createItalicLabel("New Location")] : []
        ),
        createBoldLabel("Opponent"),
        createBoldLabel("Goals For"),
        createBoldLabel("Goals Against"),
        createBoldLabel("Penalties?"),
        ...(
            showPens ? [
            createBoldLabel("Penalties For"),
            createBoldLabel("Penalties Against")
        ] : []),
    ] as GenericTableCell[];

    const setLoc = (loc:string) => {
        updateMatch('location', loc);
        setLocationDropdownVal(loc);
    }

    const setComp = (comp:string) => {
        updateMatch('competition_id',comp);
        setCompetitionDropdownVal(comp);
    }

    const createDummyComp = (basicVal:string) => {
        return {
            competition_id: basicVal,
            competition_acronym: "",
            competition_name: basicVal
        } as Competition
    }

    if (!props.locations) {
        return <Loading/>
    }

    return (
        <div id="match-info-input">
            <div
                id="match-info-input-labels"
                className="match-info-input-div"
            >
                {
                    labels.map(
                        (cell:GenericTableCell) => (
                            <div
                                className="match-info-input-row"
                                key={generateId()}
                                style={cell.styles}
                            >
                                {cell.value}
                            </div>
                        )
                    )
                }
            </div>
            <div id="match-info-input-inputs" className="match-info-input-div">
                <div className="match-info-input-row">
                    <select
                        id='competition-select'
                        className="mii-select"
                        value={competitionDropdownVal}
                        onChange={(e) => setComp(e.target.value)}
                    >
                        {
                            [createDummyComp("")]
                                .concat(props.competitions)
                                .concat([createDummyComp(MATCH_COMPETITION_TYPE.NEW_COMPETITION)]).map(
                                (comp:Competition) => {
                                    var label = comp.competition_name;
                                    if (comp.competition_acronym) {
                                        label += ` (${comp.competition_acronym})`;
                                    }
                                    return (
                                        <option
                                            key={generateId()}
                                            value={comp.competition_id}
                                            disabled={comp.competition_id == ""}
                                            style={{fontSize:getFontSize(label, 1, 14, 0.02)}}
                                        >
                                            {label}
                                        </option>
                                    )
                                }
                            )
                        }
                    </select>
                </div>
                {
                    (competitionDropdownVal == MATCH_COMPETITION_TYPE.NEW_COMPETITION) && (
                        <>
                            <div className="match-info-input-row">
                                <input
                                    type="text"
                                    value={props.newCompName}
                                    onChange={(e) => props.setNewCompName(e.target.value)}
                                />
                            </div>
                            <div className="match-info-input-row">
                                <input
                                    type="text"
                                    maxLength={5}
                                    value={props.newCompAcronym}
                                    onChange={(e) => props.setNewCompAcronym(e.target.value)}
                                />
                            </div>
                        </>
                    )
                }
                <div className="match-info-input-row">
                    <input
                        type="date"
                        value={props.match.date ?? ""}
                        onChange={(e) => updateMatch("date", e.target.value)}
                    />
                </div>
                <div className="match-info-input-row">
                    <input
                        type="time"
                        value={props.match.time ?? ""}
                        onChange={(e) => updateMatch("time", e.target.value)}
                    />
                </div>
                <div id='han-radios' className="match-info-input-row">
                    {
                        ['H','A','N'].map(
                            (han:string) => (
                                <div
                                    className="han-radio-div"
                                    key={generateId()}
                                >
                                    {han}
                                    <input
                                        type='radio'
                                        name='han'
                                        value={han}
                                        checked={props.match.home_away_neutral == han}
                                        onChange={() => updateMatch("home_away_neutral", han)}
                                    />
                                </div>
                            )
                        )
                    }
                </div>
                <div className="match-info-input-row">
                    <select
                        id='location-select'
                        value={locationDropdownVal}
                        onChange={(e) => setLoc(e.target.value)}
                        disabled={props.match.home_away_neutral == undefined}
                    >
                        {
                            [""]
                                .concat(props.locations[props.match.home_away_neutral] ?? [])
                                .concat([MATCH_LOCATION_TYPE.NEW_LOCATION]).map(
                                (loc:string) => (
                                    <option
                                        key={generateId()}
                                        value={loc}
                                        disabled={loc == ""}
                                    >
                                        {loc}
                                    </option>
                                )
                            )
                        }
                    </select>
                </div>
                {
                    (locationDropdownVal == MATCH_LOCATION_TYPE.NEW_LOCATION) && (
                        <div className="match-info-input-row">
                            <input
                                type="text"
                                value={props.newLocation}
                                onChange={(e) =>  props.setNewLocation(e.target.value)}
                            />
                        </div>
                    )
                }
                <div className="match-info-input-row">
                    <input
                        type="text"
                        value={props.match.opposition_team_name ?? ""}
                        onChange={(e) => updateMatch("opposition_team_name", e.target.value)}
                    />
                </div>
                <div className="match-info-input-row">
                    <BasicNumberInput
                        value={props.match.goals_for}
                        setValue={(updater) => updateMatch("goals_for", updater)}
                    />
                </div>
                <div className="match-info-input-row">
                    <BasicNumberInput
                        value={props.match.goals_against}
                        setValue={(updater) => updateMatch("goals_against", updater)}
                    />
                </div>
                <div className="match-info-input-row">
                    <input
                        type="checkbox"
                        checked={showPens}
                        onChange={() => setShowPens((prev) => !prev)}
                    />
                </div>

                {showPens && (
                    <>
                        <div className="match-info-input-row">
                            <BasicNumberInput
                                value={props.match.pens_for ?? 0}
                                setValue={(updater) => updateMatch("pens_for", updater)}
                            />
                        </div>
                        <div className="match-info-input-row">
                            <BasicNumberInput
                                value={props.match.pens_against ?? 0}
                                setValue={(updater) => updateMatch("pens_against", updater)}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
