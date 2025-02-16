interface OwnProps {
    buttonDisabled?:boolean
    buttonText:string
    onClickFunction:Function
}

export const ButtonDiv = (props:OwnProps) => {
    return (
        <div id='for-password-button-div'>
            <button
                id='for-password-button'
                className={"ss-green-button" + (props.buttonDisabled ? " disabled-button" : "")}
                onClick={() => props.onClickFunction()}
                disabled={props.buttonDisabled}
            >
                {props.buttonText}
            </button>
        </div>
    )
}