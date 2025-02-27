interface OwnProps {
    subtitle:string
    backText:string|null
    forwardText:string|null
    setSectionIndex:Function
}

export const SubtitleAndButtons = (props:OwnProps) => {
    return (
        <div id='subtitle-and-buttons-div'>
            {
                (props.backText) ? (
                    <button
                        className="sab-button-text ss-red-button"
                        onClick={() => props.setSectionIndex((prevVal:number) => prevVal - 1)}
                    >
                        {"<< " + props.backText}
                    </button>
                ) : (
                    <button
                        className="sab-button-text empty-button"
                        disabled={true}
                    >
                        .
                    </button>
                )
            }
            <b
                className="sab-subtitle-text"
            >
                {props.subtitle}
            </b>
            {
                (props.forwardText) ? (
                    <button
                        className="sab-button-text ss-green-button"
                        onClick={() => props.setSectionIndex((prevVal:number) => prevVal + 1)}
                    >
                        {props.forwardText + " >>"}
                    </button>
                ) : (
                    <button
                        className="sab-button-text ss-green-button"
                        disabled={true}
                    >
                        Save
                    </button>
                )
            }
        </div>
    );
}