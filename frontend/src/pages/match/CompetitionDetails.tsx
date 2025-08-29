interface OwnProps {
    leagueName:string
    seasonName:string
    competitionFullName:string
}

export const CompetitionDetails = (props:OwnProps) => {

    const improveSeasonName = (seasonName:string) => {
        if (/^\d+$/.test(seasonName)) {
            return `Season ${seasonName}`;
        }
        return seasonName;
    }

    return (
        <div id='competition-details' className="match-info-div match-details">
            <p>{props.leagueName}</p>
            <p>{props.competitionFullName}</p>
            <p>{improveSeasonName(props.seasonName)}</p>
        </div>
    )
}