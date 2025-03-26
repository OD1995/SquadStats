import { useEffect, useState } from "react"
import { isWiderThanHigher } from "../../helpers/windowDimensions"

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
    const [showPens, setShowPens] = useState<boolean>(false);

    const isDesktop = isWiderThanHigher();
    
    useEffect(
        () => {
            if (props.homeAwayNeutral == "A") {
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
            const totalPensScored = (props.pensFor ?? 0) + (props.pensAgainst ?? 0);
            setShowPens(totalPensScored > 0);
        },
        []
    )
    
    return (
        <div id='match-score' className="match-info-div">
            <table>
                <tbody>
                    <tr>
                        <td
                            className={(isDesktop ? "desktop" : "mobile") + "-team-names"}
                        >
                            <b>
                                {homeTeam}
                            </b>
                        </td>
                        {showPens && <td></td>}
                        <td
                            className={(isDesktop ? "desktop" : "mobile") + "-team-names"}
                        >
                            <b>
                                {awayTeam}
                            </b>
                        </td>
                    </tr>
                    <tr>
                        <td className="goals-text">{homeScore}</td>
                        {showPens && <td className="goals-text"></td>}
                        <td className="goals-text">{awayScore}</td>
                    </tr>
                    {
                        showPens && (
                            <tr>
                                <td className="pens-text">{homePens}</td>
                                <td className="small-caps-subtitle">PENALTIES</td>
                                <td className="pens-text">{awayPens}</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}