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
    // const [sectionSubtitle, setSectionSubtitle] = useState<string>();
    // const [sectionContent, setSectionContent] = useState<JSX.Element>();
    const [team, setTeam] = useState<Team>();
    const [availablePlayers, setAvailablePlayers] = useState<Player[]>();
    const [activePlayers, setActivePlayers] = useState<Player[]>([]);
    const [match, setMatch] = useState<Match>({
        goals_for: 0,
        goals_against: 0
    } as Match);

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
                    // date
                    // time
                    // location
                    // opponent
                    // goalsFor
                    // goalsAgainst
                    // pensFor
                    // pensAgainst
                    // homeAwayNeutral
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

    const serialiseMatch = (match:Match) => {
        return JSON.stringify(match);
    }

    return (
        <div className='page-parent'>
            {getBigTitle(team?.team_name)}
            <TeamLinkBar
                team={team!}
                isClubAdmin={getIsClubAdmin(user, team?.club_id!)}
                clubId={team?.club_id!}
            />
            <GenericSection
                subtitle={sectionArray[sectionIndex].subtitle}
                sectionContent={sectionArray[sectionIndex].sectionContent}
                previousSubtitle={getPreviousSubtitle()}
                nextSubtitle={getNextSubtitle()}
                setSectionIndex={setSectionIndex}
            />
            <div id='match-serialised'>
                {serialiseMatch(match)}
            </div>
        </div>
    );
}