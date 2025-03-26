import { isWiderThanHigher } from "../../helpers/windowDimensions"

interface OwnProps {
    competitionFullName:string
    time:string
    date:string
    location:string
}

export const OtherMatchInfo = (props:OwnProps) => {

    const isDesktop = isWiderThanHigher();

    const getDateTimeElement = () => {
        if (isDesktop) {
            if (!props.time) {
                return <p>{props.date}</p>
            }
            return <p>{formatTime(props.time) + " - " + props.date}</p>
        }
        return (
            <div id='date-time-div'>
                <i>{formatTime(props.time)}</i>
                <i>{props.date}</i>
            </div>
        )
    }

    const formatTime = (time:string) => {
        const [hours, minutes] = time.split(':').map(Number);
        const period = hours < 12 ? 'am' : 'pm';
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        return minutes === 0 ? `${formattedHours}${period}` : `${formattedHours}.${minutes}${period}`;
    }

    return (
        <div id='other-match-info' className="match-info-div">            
            <p>{props.competitionFullName}</p>
            {getDateTimeElement()}
            <p>{props.location}</p>
        </div>
    )
}