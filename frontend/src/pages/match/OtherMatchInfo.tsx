interface OwnProps {
    competitionFullName:string
    time:string
    date:string
    location:string
}

export const OtherMatchInfo = (props:OwnProps) => {
    return (
        <div id='other-match-info' className="match-info-div">            
            <p>{props.competitionFullName}</p>
            <p>{props.time + " - " + props.date}</p>
            <p>{props.location}</p>
        </div>
    )
}