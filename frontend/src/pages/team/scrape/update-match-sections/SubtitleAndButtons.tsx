interface OwnProps {
    subtitle:string
    backText?:string
    forwardText?:string
}

export const SubtitleAndButtons = (props:OwnProps) => {
    return (
        <div id='subtitle-and-buttons-div'>
            {
                (props.backText) ? (
                    <button
                        className="sab-text"
                    >
                        {props.backText}
                    </button>
                ) : (
                    <button
                        className="sab-text"
                        disabled={true}
                    >
                        Placeholder
                    </button>
                )
            }
            <b
                className="sab-text"
            >
                {props.subtitle}
            </b>
            {
                (props.forwardText) ? (
                    <button
                        className="sab-text"
                    >
                        {props.forwardText}
                    </button>
                ) : (
                    <button
                        className="sab-text"
                        disabled={true}
                    >
                        Placeholder
                    </button>
                )
            }
        </div>
    );
}