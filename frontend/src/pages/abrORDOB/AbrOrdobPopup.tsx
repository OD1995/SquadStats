import './AbrOrdobPopup.css';

interface AbrOrdobPopupProps {
    markerId: string
    text: string
    setShowPopup: Function
}

export const AbrOrdobPopup = (props:AbrOrdobPopupProps) => {

    const buildText = (text:string) => {
        const paragraphs = text.split(/\r?\n/);
        var returnMe = [];
        var key = 0;
        for (const para of paragraphs) {
            returnMe.push(
                <p key={key}>
                    {para}
                </p>
            );
            key += 1;
        }
        return returnMe;
    }

    return (
        <div
            id='abrordob-popup-parent'
            onClick={() => props.setShowPopup(false)}
        >
            <div
                id='abrordob-popup-content'
                onClick={(e) => e.stopPropagation()}
            >
                <div id='abrordob-top'>
                    <span
                        id='abrordob-popup-close'
                        onClick={() => props.setShowPopup(false)}
                    >
                        &times;
                    </span>
                </div>
                <div id='abrordob-bottom'>
                    <div
                        className='abrorodb-popup-obj'
                    >
                        <img
                            id='abrordob-popup-img'
                            src={"/abrORDOB/" + props.markerId + ".jpeg"}
                        />
                    </div>
                    <div
                        id='abrordob-popup-text'
                        className='abrorodb-popup-obj'
                    >
                        {buildText(props.text)}
                    </div>
                </div>
            </div>
        </div>
    )
}