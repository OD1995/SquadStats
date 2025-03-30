import { isWiderThanHigher } from "../../../../helpers/windowDimensions";
import { Match } from "../../../../types/Match";
import { SubtitleAndButtons } from "./SubtitleAndButtons";

interface OwnProps {
    subtitle:string
    sectionContent:JSX.Element
    previousSubtitle:string|null
    nextSubtitle:string|null
    setSectionIndex:Function
    match:Match
    setErrorMessage:Function
    potm:string
    saveMatch:Function
    newCompName:string
    newCompAcronym:string
    newLocation:string
}

export const GenericSection = (props:OwnProps) => {

    const isDesktop = isWiderThanHigher();

    return (
        <div
            id={(isDesktop ? "desktop" : "mobile") + "-generic-section-parent"}
            className="generic-section-parent"
        >
            <div
                id={(isDesktop ? "desktop" : "mobile") + "-generic-section"}
                className="generic-section"
            >
                <SubtitleAndButtons
                    subtitle={props.subtitle}
                    forwardText={props.nextSubtitle}
                    backText={props.previousSubtitle}
                    setSectionIndex={props.setSectionIndex}
                    match={props.match}
                    setErrorMessage={props.setErrorMessage}
                    potm={props.potm}
                    saveMatch={props.saveMatch}
                    newCompName={props.newCompName}
                    newCompAcronym={props.newCompAcronym}
                    newLocation={props.newLocation}
                />
                <div className="generic-section-content">
                    {props.sectionContent}
                </div>
            </div>
        </div>
    );
}