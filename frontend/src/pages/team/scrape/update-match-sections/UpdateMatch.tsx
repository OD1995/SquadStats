import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserLS } from "../../../../authentication/auth";
import { Team } from "../../../../types/Team";
import { getBigTitle, getIsClubAdmin, getTeam } from "../../../../helpers/other";
import { TeamLinkBar } from "../../generic/TeamLinkBar";
import { PlayerSelection } from "./PlayerSelection";
import { GenericSection } from "./GenericSection";
import { Player } from "../../../../types/Player";
import { MatchInfoInput } from "./MatchInfoInput";
import { GoalsInput } from "./GoalsInput";
import { Match } from "../../../../types/Match";

interface SectionInfo {
    subtitle:string
    sectionContent:JSX.Element
}

export const UpdateMatch = () => {

    const [sectionIndex, setSectionIndex] = useState<number>(0);
    const [team, setTeam] = useState<Team>();
    const [availablePlayers, setAvailablePlayers] = useState<Record<string,Player>>({});
    const [activePlayers, setActivePlayers] = useState<Record<string, Player>>({});
    const [match, setMatch] = useState<Match>({
        goals_for: 0,
        goals_against: 0
    } as Match);
    const [locations, setLocations] = useState<Record<string,string[]>>();
    const [errorMessage, setErrorMessage] = useState<string>("");

    const user = getUserLS();
    let { teamId, teamSeasonId, matchId } = useParams();
    const navigate = useNavigate();

    const sectionArray = [
        {
            subtitle: 'Match Info',
            sectionContent: (
                <MatchInfoInput
                    match={match}
                    setMatch={setMatch}
                    locations={locations}
                />
            )
        },
        {
            subtitle: 'Players',
            sectionContent: (
                <PlayerSelection
                    availablePlayers={availablePlayers}
                    setAvailablePlayers={setAvailablePlayers}
                    activePlayers={activePlayers}
                    setActivePlayers={setActivePlayers}
                />
            )
        },
        {
            subtitle: 'Goals & POTM',
            sectionContent: (
                <GoalsInput

                />
            )
        }
    ] as SectionInfo[];

    useEffect(
        () => {
            if (!user) {
                navigate("/about");
            } else {
                const _team_ = getTeam(user, teamId);
                setTeam(_team_!);
            }
            setLocations(
                {
                    'H': ['The Beach']
                } as Record<string, string[]>
            )
            setMatch(
                {
                    date: "1995-03-13",
                    time: "19:15",
                    opposition_team_name: "X",
                    home_away_neutral: "H",
                    location: "The Beach",
                    goals_for: 0,
                    goals_against: 2
                } as Match
            );
            setActivePlayers({
                'ad' : {
                    player_id: 'ad',
                    player_name: 'Alex Dernie'
                },
                'asl' : {
                    player_id: 'asl',
                    player_name: 'Aaron Singer-Lee'
                },
                'oal' : {
                    player_id: 'oal',
                    player_name: 'Oli Akinwumni-Ladega'
                },
            });
            setAvailablePlayers({
                'th' : {
                    player_id: 'th',
                    player_name: 'Test Human'
                },
                'tlh' : {
                    player_id: 'tlh',
                    player_name: 'Test Long Human'
                },
                'ckw' : {
                    player_id: 'ckw',
                    player_name: 'Corey Kearney-Wellington'
                },
            });
        },
        []
    )

    const getPreviousSubtitle = () => {
        if (sectionIndex == 0) {
            return null;
        }
        return sectionArray[sectionIndex - 1].subtitle;
    }

    const getNextSubtitle = () => {
        if (sectionIndex == (sectionArray.length - 1)) {
            return null;
        }
        return sectionArray[sectionIndex + 1].subtitle;
    }

    // const serialiseMatch = (match:Match) => {
    //     return JSON.stringify(match);
    // }

    const serialiseMatch = (match:Match) => {
        return Object.entries(match)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");
    }

    useEffect(
        () => {
            setErrorMessage(serialiseMatch(match));
        },
        [match]
    )

    return (
        <div className='page-parent'>
            {getBigTitle(team?.team_name)}
            <TeamLinkBar
                team={team!}
                isClubAdmin={getIsClubAdmin(user, team?.club_id!)}
                clubId={team?.club_id!}
            />
            <p id='match-serialised'>
                {errorMessage}
            </p>
            <GenericSection
                subtitle={sectionArray[sectionIndex].subtitle}
                sectionContent={sectionArray[sectionIndex].sectionContent}
                previousSubtitle={getPreviousSubtitle()}
                nextSubtitle={getNextSubtitle()}
                setSectionIndex={setSectionIndex}
                match={match}
                setErrorMessage={setErrorMessage}
            />
        </div>
    );
}