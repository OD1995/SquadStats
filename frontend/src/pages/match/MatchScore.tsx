import { useEffect, useState } from "react"

interface OwnProps {
    teamName:string
    oppoTeamName:string
    goalsFor:number
    goalsAgainst:number
    pensFor:number|null
    pensAgainst:number|null
    homeAwayNeutral:string
}

export const MatchScore = (props:OwnProps) => {
    
    const [homeTeam, setHomeTeam] = useState<string>("");
    const [awayTeam, setAwayTeam] = useState<string>("");
    const [homeScore, setHomeScore] = useState<number|null>(null);
    const [awayScore, setAwayScore] = useState<number|null>(null);
    const [homePens, setHomePens] = useState<number|null>(null);
    const [awayPens, setAwayPens] = useState<number|null>(null);
    
    useEffect(
        () => {
            if (props.homeAwayNeutral == 'a') {
                setHomeTeam(props.oppoTeamName);
                setHomeScore(props.goalsAgainst);
                setHomePens(props.pensAgainst);
                setAwayTeam(props.teamName);
                setAwayScore(props.goalsFor);
                setAwayPens(props.pensFor);
            } else {
                setHomeTeam(props.teamName);
                setHomeScore(props.goalsFor);
                setHomePens(props.pensFor);
                setAwayTeam(props.oppoTeamName);
                setAwayScore(props.goalsAgainst);
                setAwayPens(props.pensAgainst);
            }
        },
        []
    )

    const generateMiddleColumn = (pens:number|null) => {
        if (pens) {
            return (
                <div id="middle-column" className="match-score-column">
                    <h3>&nbsp;</h3>
                    <h4>&nbsp;</h4>
                    <h6>PENALTIES</h6>
                </div>
            )
        } else {
            return null;
        }
    }

    const generateScoreColumn = (
        type:string,
        teamName:string,
        score:number,
        pens:number|null
    ) => {
        return (
            <div id={type + "-column"} className="match-score-column">
                <h3>{teamName}</h3>
                <h4>{score}</h4>
                {
                    pens && <h6>{pens}</h6>
                }
            </div>
        )
    }
    
    return (
        <div id='match-score' className="match-info-div">
            {generateScoreColumn('home',homeTeam,homeScore!,homePens)}
            {generateMiddleColumn(homePens)}
            {generateScoreColumn('away',awayTeam,awayScore!,awayPens)}
        </div>
    )
}