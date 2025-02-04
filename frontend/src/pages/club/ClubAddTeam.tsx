import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { getUserLS } from "../../authentication/auth";
import { Club } from "../../types/Club";
import { getBigTitle, getClub, getIsClubAdmin } from "../../helpers/other";
import { ClubLinkBar } from "./generic/ClubLinkBar";
import { DATA_SOURCE } from "../../types/enums";
import "./ClubAddTeam.css"
import { NewClubOrTeamSubmit } from "../../generic/club-or-team/NewClubOrTeamSubmit";

export const ClubAddTeam = () => {

    const [club, setClub] = useState<Club>();
    const [anyNonManualTeams, setAnyNonManualTeams] = useState<boolean>(false);

    let { clubId } = useParams();
    const user = getUserLS();
    const navigate = useNavigate();

    useEffect(
        () => {
            if (!user) {
                navigate("/about");
            }
            var _club_ = getClub(user, clubId);
            setClub(_club_!);
            setAnyNonManualTeams(getAnyNonManualTeams(_club_!));
        },
        []
    )

    const getAnyNonManualTeams = (club:Club) => {
        for (const team of club.teams) {
            if (team.data_source_id != DATA_SOURCE.MANUAL) {
                return true;
            }
        }
        return false;
    }

    return (
        <div className="page-parent">
            {getBigTitle(club?.club_name)}
            <ClubLinkBar
                isClubAdmin={getIsClubAdmin(user, clubId!)}
            />
            <div id='club-add-team-content'>
                {
                    anyNonManualTeams && (
                        <>
                            <button
                                className="ss-green-button"
                            >
                                Update team list from FA website
                            </button>
                            <p>OR</p>
                        </>
                    )
                }
                <div id='add-new-team-subtitle-div'>
                    <b id='add-new-team-text'>
                        Add a new manual entry team
                    </b>
                </div>
                <NewClubOrTeamSubmit
                    labelText="Enter the team's name"
                    team
                />
            </div>
        </div>
    )
}