import { SubtitleAndButtons } from "./SubtitleAndButtons";
import "./UpdateMatch.css"

interface OwnProps {
    subtitle:string
    sectionContent:JSX.Element
    previousSubtitle:string|null
    nextSubtitle:string|null
    setSectionIndex:Function
}

export const GenericSection = (props:OwnProps) => {
    return (
        <div>
            <SubtitleAndButtons
                subtitle={props.subtitle}
                forwardText={props.nextSubtitle}
                backText={props.previousSubtitle}
                setSectionIndex={props.setSectionIndex}
            />
            {props.sectionContent}
        </div>
    );
}