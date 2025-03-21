import "./About.css";
import { getBigTitle } from "../../helpers/other";

export const About = () => {

    return (
        <div className="page-parent">
            {getBigTitle("About")}
            <div id='about-content'>
                <div id='about-text'>
                    <p>
                        Squad Stats allows you to track your club's match data over time.
                        To do so, either enter your match data manually or link your club to one on the
                        <a href="https://fulltime.thefa.com/home/index.html"> FA's website </a>
                        to import it automatically.
                    </p>
                    <h3>
                        Club Hierachy
                    </h3>
                    <p>
                        <div>
                            Teams exist within a club. Example below:
                        </div>
                        <ul>
                            <li style={{listStyle:"square"}}>
                                <b>Club</b> e.g. Exeter City FC
                            </li>
                            <li style={{listStyle:"circle", marginLeft:"5vw"}}>
                                <b>Team A</b> e.g. Exeter City 1st Team
                            </li>
                            <li style={{listStyle:"circle", marginLeft:"5vw"}}>
                                <b>Team B</b> e.g. Exeter City U18s
                            </li>
                            <li style={{listStyle:"circle", marginLeft:"5vw"}}>
                                <b>Team C</b> e.g. Exeter City Women
                            </li>
                        </ul>
                    </p>
                    <h3>
                        Match Hierachy
                    </h3>
                    <p>
                        <div>
                            Teams' matches are linked to a competition and season, within a league. Example below:
                        </div>
                        <ul>
                            <li style={{listStyle:"square"}}>
                                <b>League</b> e.g. English Football League (EFL)
                            </li>
                            <li style={{listStyle:"circle", marginLeft:"5vw"}}>
                                <b>Competitions</b>
                            </li>
                            <li style={{listStyle:"disc", marginLeft:"10vw"}}>
                                <b>Competition A</b> e.g. EFL League One
                            </li>
                            <li style={{listStyle:"disc", marginLeft:"10vw"}}>
                                <b>Competition B</b> e.g. EFL Trophy
                            </li>
                            <li style={{listStyle:"circle", marginLeft:"5vw"}}>
                                <b>Seasons</b>
                            </li>
                            <li style={{listStyle:"disc", marginLeft:"10vw"}}>
                                <b>Season A</b> e.g. 2023/2024
                            </li>
                            <li style={{listStyle:"disc", marginLeft:"10vw"}}>
                                <b>Season B</b> e.g. 2024/2025
                            </li>
                        </ul>
                    </p>
                </div>
            </div>
        </div>
    )
}