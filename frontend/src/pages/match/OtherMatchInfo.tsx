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
            return <p>{props.time + " - " + props.date}</p>
        }
        return (
            <div id='date-time-div'>
                <i>{props.time}</i>
                <i>{props.date}</i>
            </div>
        )
    }

    return (
        <div id='other-match-info' className="match-info-div">            
            <p>{props.competitionFullName}</p>
            {getDateTimeElement()}
            <p>{props.location}</p>
        </div>
    )
}