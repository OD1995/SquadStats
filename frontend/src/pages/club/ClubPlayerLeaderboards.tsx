import { useParams } from "react-router-dom";
import { getUserLS } from "../../authentication/auth"
import { getClub, getIsClubAdmin } from "../../helpers/other"
import { ClubOrTeamMatchesOrPlayers } from "../../generic/club-or-team/ClubOrTeamMatchesOrPlayers";
import { Club } from "../../types/Club";
import { useEffect, useState } from "react";
import ClubService from "../../services/ClubService";
import { BackendResponse } from "../../types/BackendResponse";
import { Loading } from "../../generic/Loading";

export const ClubPlayerLeaderboards = () => {

    const [club, setClub] = useState<Club>();
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    const user = getUserLS();
    const { clubId } = useParams();

    useEffect(
        () => {
            var _club_ = null;
            if (user) {
                _club_ = getClub(user, clubId);
                if (_club_) {
                    setClub(_club_);
                    setLoading(false);
                }
            }
            if (!_club_) {
                setLoading(true);
                ClubService.getClubInformation(clubId!).then(
                    (res:BackendResponse) => {
                        if (res.data) {
                            setClub(res.data);
                        } else {
                            setErrorMessage(res.data.message);
                        }
                        setLoading(false);
                    }
                )
            }
        },
        []
    )
    
    if (loading) {
        return <Loading/>
    } else {
        return (
            <ClubOrTeamMatchesOrPlayers
                club={club}
                isClubAdmin={getIsClubAdmin(user, clubId!)}
                players
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
            />
        )
    }
}