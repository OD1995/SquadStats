import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserLS } from "../../../../authentication/auth";
import { Team } from "../../../../types/Team";
import { getBigTitle, getIsClubAdmin, getTeam } from "../../../../helpers/other";
import { TeamLinkBar } from "../../generic/TeamLinkBar";
import { PlayerSelection } from "./PlayerSelection";
import { GenericSection } from "./GenericSection";
import { SortablePlayer } from "../../../../types/Player";
import { MatchInfoInput } from "./MatchInfoInput";
import { GoalsInput } from "./GoalsInput";
import { Match } from "../../../../types/Match";
import { UPDATE_MATCH_SECTIONS } from "../../../../types/enums";
import MatchService from "../../../../services/MatchService";
import { BackendResponse } from "../../../../types/BackendResponse";
import { Competition } from "../../../../types/Competition";
import { Loading } from "../../../../generic/Loading";
import { ExtraMatchInfo } from "../../../../types/ExtraMatchInfo";
import "./UpdateMatch.css"
import { MatchReportUpload } from "./MatchReportUpload";
import { UploadedImage } from "../../../../types/UploadedImage";
import ImageService from "../../../../services/ImageService";
import { v4 as uuidv4 } from "uuid";

interface SectionInfo {
    subtitle:string
    sectionContent:JSX.Element
}

export const UpdateMatch = () => {

    const [sectionIndex, setSectionIndex] = useState<number>(0);
    const [team, setTeam] = useState<Team>();
    const [availablePlayers, setAvailablePlayers] = useState<Record<string,SortablePlayer>>({});
    const [activePlayers, setActivePlayers] = useState<Record<string, SortablePlayer>>({});
    const [match, setMatch] = useState<Match>({
        goals_for: 0,
        goals_against: 0,
    } as Match);
    const [extraMatchInfo, setExtraMatchInfo] = useState<ExtraMatchInfo>({} as ExtraMatchInfo);
    const [locations, setLocations] = useState<Record<string,string[]>>({});
    const [goals, setGoals] = useState<Record<string, number>>({});
    const [potm, setPotm] = useState<string>("");
    // const [newCompetition, setNewCompetition] = useState<Competition>();
    const [newCompName, setNewCompName] = useState<string>("");
    const [newCompAcronym, setNewCompAcronym] = useState<string>("");
    const [newLocation, setNewLocation] = useState<string>("");
    const [competitions, setCompetitions] = useState<Competition[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [locationDropdownVal, setLocationDropdownVal] = useState<string>("");
    const [competitionDropdownVal, setCompetitionDropdownVal] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [dataLoaded, setDataLoaded] = useState<boolean>(false);
    const [showPens, setShowPens] = useState<boolean>(false);
    const [images, setImages] = useState<UploadedImage[]>([]);

    const user = getUserLS();
    let { teamId, leagueSeasonId, matchId } = useParams();
    const navigate = useNavigate();
    // const newCompId = uuidv4();

    const sectionArray = [
        {
            subtitle: UPDATE_MATCH_SECTIONS.MATCH_INFO,
            sectionContent: (
                <MatchInfoInput
                    match={match}
                    setMatch={setMatch}
                    locations={locations}
                    competitions={competitions}
                    newCompName={newCompName}
                    setNewCompName={setNewCompName}
                    newCompAcronym={newCompAcronym}
                    setNewCompAcronym={setNewCompAcronym}
                    newLocation={newLocation}
                    setNewLocation={setNewLocation}
                    locationDropdownVal={locationDropdownVal}
                    setLocationDropdownVal={setLocationDropdownVal}
                    competitionDropdownVal={competitionDropdownVal}
                    setCompetitionDropdownVal={setCompetitionDropdownVal}
                    showPens={showPens}
                    setShowPens={setShowPens}
                    extraMatchInfo={extraMatchInfo}
                />
            )
        },
        {
            subtitle: UPDATE_MATCH_SECTIONS.MATCH_REPORT,
            sectionContent: (
                <MatchReportUpload
                    match={match}
                    setMatch={setMatch}
                    images={images}
                    setImages={setImages}
                />
            )
        },
        {
            subtitle: UPDATE_MATCH_SECTIONS.PLAYERS,
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
            subtitle: UPDATE_MATCH_SECTIONS.GOALS_AND_POTM,
            sectionContent: (
                <GoalsInput
                    activePlayers={activePlayers}
                    goals={goals}
                    setGoals={setGoals}
                    potm={potm}
                    setPotm={setPotm}
                    goalsFor={match.goals_for}
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
            setLoading(true);
            MatchService.getMatchEditUpdateInfo(
                teamId!,
                matchId!,
                leagueSeasonId!
            ).then(
                (res:BackendResponse) => {
                    if (res.success) {
                        setLocations(res.data.locations as Record<string,string[]>);
                        setCompetitions(res.data.competitions as Competition[]);
                        const m = res.data.match as Match;
                        if (m) {
                            setMatch(m);
                            if (m.pens_for || m.pens_against) {
                                setShowPens(true);
                            }
                            setCompetitionDropdownVal(m.competition_id);
                            setLocationDropdownVal(m.location);
                        }
                        const xmi = res.data.extra_match_info as ExtraMatchInfo;
                        if (xmi) {
                            setExtraMatchInfo(xmi);
                        }
                        if (res.data.active_players) {
                            setActivePlayers(res.data.active_players as Record<string, SortablePlayer>);
                        }
                        if (res.data.available_players) {
                            setAvailablePlayers(res.data.available_players as Record<string, SortablePlayer>);
                        }
                        if (res.data.goals) {
                            setGoals(res.data.goals as Record<string, number>);
                        }
                        if (res.data.potm) {
                            setPotm(res.data.potm as string);
                        }
                    } else {
                        setErrorMessage(res.data.message);
                    }
                    setLoading(false);
                    setDataLoaded(true);
                }
            )
            // setLocations(
            //     {
            //         'H': ['The Beach']
            //     } as Record<string, string[]>
            // )
            // setCompetitions(
            //     [
            //         {
            //             competition_id: uuidv4(),
            //             league_id: uuidv4(),
            //             competition_name: "Test Competition",
            //             competition_acronym: "TC"
            //         }
            //     ] as Competition[]
            // )
            // setMatch(
            //     {
            //         date: "1995-03-13",
            //         time: "19:15",
            //         opposition_team_name: "X",
            //         home_away_neutral: "H",
            //         location: "The Beach",
            //         goals_for: 4,
            //         goals_against: 2
            //     } as Match
            // );
            // setActivePlayers({
            //     'ad' : {
            //         player_id: 'ad',
            //         player_name: 'Alex Dernie'
            //     },
            //     'asl' : {
            //         player_id: 'asl',
            //         player_name: 'Aaron Singer-Lee'
            //     },
            //     'oal' : {
            //         player_id: 'oal',
            //         player_name: 'Oli Akinwumni-Ladega'
            //     },
            // });
            // setAvailablePlayers({
            //     'th' : {
            //         player_id: 'th',
            //         player_name: 'Test Human'
            //     },
            //     'tlh' : {
            //         player_id: 'tlh',
            //         player_name: 'Test Long Human'
            //     },
            //     'ckw' : {
            //         player_id: 'ckw',
            //         player_name: 'Corey Kearney-Wellington'
            //     },
            // });
            setMatch(
                (prevMatch:Match) => (
                    {
                        ...prevMatch,
                        match_id: matchId!,
                        // team_season_id: teamSeasonId!
                    }
                )
            );
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

    // const serialiseMatch = (match:Match) => {
    //     return Object.entries(match)
    //     .map(([key, value]) => `${key}: ${value}`)
    //     .join("\n");
    // }

    // useEffect(
    //     () => {
    //         setErrorMessage(serialiseMatch(match));
    //     },
    //     [match]
    // )

    // useEffect(
    //     () => {
    //         setErrorMessage(JSON.stringify(goals) + `potm:'${potm}'`);
    //     },
    //     [goals, potm]
    // )

    const saveMatch = async () => {
        setLoading(true);
        var imageIds = [];
        for (const image of images) {
            const id = uuidv4();
            const res = await ImageService.uploadImage(image.file, id);
            const imageId = `v${res.data.version}/${res.data.public_id}.${res.data.format}`;
            imageIds.push(imageId);
        }
        MatchService.createMatch(
            match,
            activePlayers,
            goals,
            potm,
            newCompName, 
            newCompAcronym,
            teamId!,
            leagueSeasonId!,
            newLocation,
            imageIds
        ).then(
            (res:BackendResponse) => {
                if (res.success) {
                    navigate(`/team/${teamId}/match/${match.match_id}`);
                } else {
                    setErrorMessage(res.data.message);
                }
                setLoading(false);
            }
        )
    }

    return (
        <div className='page-parent'>
            {getBigTitle(team?.team_name)}
            <TeamLinkBar
                team={team!}
                isClubAdmin={getIsClubAdmin(user, team?.club_id!)}
                clubId={team?.club_id!}
            />
            <p id='update-match-error'>
                {errorMessage}
            </p>
            {
                (loading || !dataLoaded) ? <Loading/> : (
                    <GenericSection
                        subtitle={sectionArray[sectionIndex].subtitle}
                        sectionContent={sectionArray[sectionIndex].sectionContent}
                        previousSubtitle={getPreviousSubtitle()}
                        nextSubtitle={getNextSubtitle()}
                        setSectionIndex={setSectionIndex}
                        match={match}
                        setErrorMessage={setErrorMessage}
                        potm={potm}
                        saveMatch={saveMatch}
                        newCompName={newCompName}
                        newCompAcronym={newCompAcronym}
                        newLocation={newLocation}
                    />
                )
            }
        </div>
    );
}