import { isWiderThanHigher } from "../../helpers/windowDimensions"

interface OwnProps {
    time:string
    date:string
    location:string
}

export const SchedulingInformation = (props:OwnProps) => {

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
        const formattedMinutes = minutes.toString().padStart(2, "0");
        return minutes === 0 ? `${formattedHours}${period}` : `${formattedHours}.${formattedMinutes}${period}`;
    }

    return (
        <div id='scheduling-info' className="match-info-div match-details">
            <p>{props.location}</p>
            {getDateTimeElement()}
        </div>
    )
}