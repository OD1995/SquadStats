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
    
    return (
        <div id='match-score' className="match-info-div">
            <table>
                <tr>
                    <td><b>{homeTeam}</b></td>
                    {homePens && <td></td>}
                    <td><b>{awayTeam}</b></td>
                </tr>
                {
                    homePens && (
                        <tr>
                            <td>{homePens}</td>
                            <td className="small-caps-subtitle">PENALTIES</td>
                            <td>{awayPens}</td>
                        </tr>
                    )
                }
                <tr>
                    <td>{homeScore}</td>
                    {homePens && <td></td>}
                    <td>{awayScore}</td>
                </tr>
            </table>
        </div>
    )
}