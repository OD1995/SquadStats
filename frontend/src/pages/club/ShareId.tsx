import { useNavigate, useParams } from "react-router-dom";
import { getUserLS } from "../../authentication/auth";
import { useEffect, useState } from "react";
import { Club } from "../../types/Club";
import { getBigTitle, getClub, getIsClubAdmin } from "../../helpers/other";
import { ClubLinkBar } from "./generic/ClubLinkBar";
import "./ShareId.css";

export const ShareId = () => {

    const [club, setClub] = useState<Club>();

    const navigate = useNavigate();

    const user = getUserLS();
    const { clubId } = useParams();

    useEffect(
        () => {
            if (!user) {
                navigate("/about");
            } else {
                setClub(getClub(user, clubId)!)
            }
        },
        []
    )

    const generateShareId = (cId:string) => {
        const halfLength = cId.length / 2;
        const firstHalf = cId.substring(0, halfLength);
        const secondHalf = cId.substring(halfLength, halfLength * 2);
        return firstHalf + cId + secondHalf
    }

    return (
        <div className="page-parent">
            {getBigTitle(club?.club_name)}
            <ClubLinkBar
                isClubAdmin={getIsClubAdmin(user, clubId!)}
            />
            <div id='share-id-content'>
                <i id='share-id-label' className='share-id-text'>
                    Share the ID below with another user to allow them to also become an admin for this club
                </i>
                <b className='share-id-text'>
                    {generateShareId(clubId!)}
                </b>
            </div>
        </div>
    );
}