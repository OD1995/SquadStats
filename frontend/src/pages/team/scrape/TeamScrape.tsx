import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Team } from "../../../types/Team";
import { getBigTitle, getIsClubAdmin } from "../../../helpers/other";
import { BackendResponse } from "../../../types/BackendResponse";
import "./TeamScrape.css";
import { Match } from "../../../types/Match";
import { MatchInfoView } from "./MatchInfoView";
import { PlayerInfoView } from "./PlayerInfoView";
import MatchService from "../../../services/MatchService";
import { TeamScrapeButtonColumn } from "./TeamScrapeButtonColumn";
import { TooltipButtonProps } from "../../../generic/TooltipButton";
import { Loading } from "../../../generic/Loading";
import SeasonService from "../../../services/SeasonService";
import { TeamLinkBar } from "../generic/TeamLinkBar";
import { getUserLS } from "../../../authentication/auth";
import { SeasonSelection } from "../../../generic/SeasonSelection";
import { Modal } from "../../../generic/Modal";
import { LeagueSeason } from "../../../types/Season";

interface OwnProps {
    team:Team
    errorMessage:string
    setErrorMessage:Function
    seasons:LeagueSeason[]
    setSeasons:Function
    selectedSeason:string
    setSelectedSeason:Function
    allLoaded:boolean
}

export const TeamScrape = (props:OwnProps) => {

    const [viewCurrentMatchesDisabled, setViewCurrentMatchesDisabled] = useState(false);
    const [updateMatchInfoFromDataSourceDisabled, setUpdateMatchInfoFromDataSourceDisabled] = useState(true);
    const [selectMatchesToUpdateDisabled, setSelectMatchesToUpdateDisabled] = useState(true);
    const [startUpdateDisabled, setStartUpdateDisabled] = useState(true);
    const [updateListDisabled, setUpdateListDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);    
    const [isPlayerInfoView, setIsPlayerInfoView] = useState<boolean>(false);
    const [allMatches, setAllMatches] = useState<Match[]>([]);
    const [successMatches, setSuccessMatches] = useState<Match[]>([]);
    const [errorMatches, setErrorMatches] = useState<Match[]>([]);
    const [tickedBoxes, setTickedBoxes] = useState<boolean[]>([]);
    const [dataLoaded, setDataLoaded] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);

    let { teamId } = useParams();
    const user = getUserLS();

    useEffect(
        () => {
            if (props.selectedSeason == "") {
                setViewCurrentMatchesDisabled(true);
            } else {
                setViewCurrentMatchesDisabled(false);
            }
        },
        [props.selectedSeason]
    )

    const handleUpdateMatchInfoFromDataSourceButtonPress = () => {
        setUpdateMatchInfoFromDataSourceDisabled(true);
        props.setErrorMessage("");
        setIsLoading(true);
        setSuccessMatches([]);
        setErrorMatches([]);
        MatchService.updateTeamMatches(
            teamId!,
            props.selectedSeason
        ).then(
            (res:BackendResponse) => {
                if (res.success) {
                    const matches:Match[] = res.data;
                    handleMatchesResponse(matches);
                    // setUpdatePlayerPerformanceDataDisabled(false);
                } else {
                    props.setErrorMessage(res.data.message);
                }
                setUpdateMatchInfoFromDataSourceDisabled(false);
                setIsLoading(false);
            }
        )
    }

    const handleMatchesResponse = (matches:Match[]) => {
        var goods = []
        var bads = [];
        for (const match of matches) {
            if (match.match_errors.length == 0) {
                goods.push(match);
            } else {
                bads.push(match);
            }
        }
        setAllMatches(matches);
        setSuccessMatches(goods);
        setErrorMatches(bads);
    }

    const handleSelectMatchesToUpdateButtonPress = () => {
        setIsPlayerInfoView(true);
        setStartUpdateDisabled(false);
    }

    const getTickedBoxCount = () => {
        var count = 0;
        for (const tb of tickedBoxes) {
            if (tb) {
                count += 1;
            }
        }
        return count;
    }

    const handleStartUpdateButtonPress = () => {
        if (getTickedBoxCount() == 0) {
            props.setErrorMessage("Select at least one match to update");
            return;
        }
        setStartUpdateDisabled(true);
        props.setErrorMessage("");
        setIsLoading(true);
        var matchIds = [];
        for (const [idx, match] of allMatches.entries()) {
            if (tickedBoxes[idx]) {
                matchIds.push(match.match_id)
            }
        }
        MatchService.scrapeMatches(
            matchIds
        ).then(
            (response:BackendResponse) => {
                if (response.success) {
                    const matches:Match[] = response.data;
                    handleMatchesResponse(matches);
                    setIsPlayerInfoView(false);
                } else {
                    props.setErrorMessage(response.data.message);
                }
                setStartUpdateDisabled(false);
                setIsLoading(false);
                setIsPlayerInfoView(false);
            }
        )
    }

    const handleViewCurrentMatchesClick = () => {
        setViewCurrentMatchesDisabled(true);
        setIsLoading(true);
        props.setErrorMessage("");
        MatchService.getCurrentMatches(
            teamId!,
            props.selectedSeason
        ).then(
            (response:BackendResponse) => {
                if (response.success) {
                    const matches:Match[] = response.data;
                    handleMatchesResponse(matches);
                } else {
                    props.setErrorMessage(response.data.message)
                }
                setIsLoading(false);
                setViewCurrentMatchesDisabled(false);
                setUpdateMatchInfoFromDataSourceDisabled(false);
                setSelectMatchesToUpdateDisabled(false);
            }
        )
        setDataLoaded(true);
    }

    const handleUpdateListButtonPress = () => {
        setUpdateListDisabled(true);
        setIsLoading(true);
        props.setErrorMessage("");
        SeasonService.updateSeasons(
            teamId!
        ).then(
            (response:BackendResponse) => {
                if (response.success) {
                    props.setSeasons(response.data);
                    props.setSelectedSeason(response.data[0].season_id);
                } else {
                    props.setErrorMessage(response.data.message)
                }
                setIsLoading(false);
                setUpdateListDisabled(false);
            }
        )
    }

    const successCols = [
        'Date',
        'Time',
        'Opposition',
        'Competition',
        'Goals For',
        'Goals Against',
        'Notes',
        'Player Info Already Scraped'
    ]

    const matchInfoView = {
        buttonText: "View",
        disabled: viewCurrentMatchesDisabled,
        handleClick: handleViewCurrentMatchesClick,
        tooltipText: "View all the matches which are already in the Squad Stats database",
        placement: "top"
    } as TooltipButtonProps;

    const matchInfoUpdateAll = {
        buttonText: "Update All",
        disabled: updateMatchInfoFromDataSourceDisabled,
        handleClick: handleUpdateMatchInfoFromDataSourceButtonPress,
        tooltipText: "Update the match info and the list of matches from the data source",
        placement: "bottom"
    } as TooltipButtonProps;

    const playersSelectMatches = {
        buttonText: "Select Matches",
        disabled: selectMatchesToUpdateDisabled,
        handleClick: handleSelectMatchesToUpdateButtonPress,
        tooltipText: "Select matches to have their player performance data updated",
        placement: "top"
    } as TooltipButtonProps;

    const playersUpdate = {
        buttonText: "Update",
        disabled: startUpdateDisabled,
        handleClick: handleStartUpdateButtonPress,
        tooltipText: "Update player performance data for selected matches from the data source",
        placement: "bottom"
    } as TooltipButtonProps;

    const seasonsUpdateList = {
        buttonText: "Update List",
        disabled: updateListDisabled,
        handleClick: handleUpdateListButtonPress,
        tooltipText: "Update list of seasons from the data source",
        placement: "bottom"
    } as TooltipButtonProps;

    const modalContent = (
        <div>
            <h3>
                Seasons
            </h3>
            <p>
                Either select a season from the list or UPDATE LIST from the data source
            </p>
            <h3>
                Match Info
            </h3>
            <p>
                VIEW the matches for the season or UPDATE ALL from the data source
            </p>
            <h3>
                Players
            </h3>
            <p>
                SELECT MATCHES for their player performance data to be updated and then UPDATE
            </p>
        </div>
    )

    if (!props.allLoaded) {
        return <Loading/>
    }
    
    return (
        <div className='page-parent'>
            {getBigTitle(props.team.team_name)}
            {
                showModal && (
                    <Modal
                        handleModalClose={() => setShowModal(false)}
                        content={modalContent}
                    />
                )
            }
            <div id='team-scrape-content'>
                <TeamLinkBar
                    isClubAdmin={getIsClubAdmin(user, props.team.club_id!)}
                    clubId={props.team.club_id!}
                    team={props.team}
                />
                <button
                    id='how-to-use-div'
                    className="folded-mop-filter"
                    onClick={() => setShowModal(true)}
                >
                    HOW TO USE
                </button>
                <div id='team-scrape-2'>
                    <div id='team-scrape-input-parent'>
                        <SeasonSelection
                            seasons={props.seasons}
                            selectedSeason={props.selectedSeason}
                            setSelectedSeason={props.setSelectedSeason}
                            flexDirection='column'
                            teamScrape
                        />
                        <div id='team-scrape-buttons-div'>
                            <TeamScrapeButtonColumn
                                title="SEASONS"
                                buttonProps={[
                                    seasonsUpdateList
                                ]}
                            />
                            <TeamScrapeButtonColumn
                                title="MATCH INFO"
                                buttonProps={[
                                    matchInfoView,
                                    matchInfoUpdateAll
                                ]}
                            />
                            <TeamScrapeButtonColumn
                                title="PLAYERS"
                                buttonProps={[
                                    playersSelectMatches,
                                    playersUpdate
                                ]}
                            />
                        </div>
                    </div>
                    {
                        isLoading ? <Loading/> : (
                            <>
                                <p className="error-message">
                                    {props.errorMessage}
                                </p>
                                {
                                    isPlayerInfoView ? (
                                        <PlayerInfoView
                                            // successMatches={successMatches}
                                            matches={allMatches}
                                            cols={successCols}
                                            tickedBoxes={tickedBoxes}
                                            setTickedBoxes={setTickedBoxes}
                                        />
                                    ) : (
                                        <MatchInfoView
                                            successMatches={successMatches}
                                            errorMatches={errorMatches}
                                            successCols={successCols}
                                            dataLoaded={dataLoaded}
                                        />
                                    )
                                }                        
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    );
}