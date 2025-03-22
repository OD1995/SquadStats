import { useNavigate, useParams } from "react-router-dom";
import { getUserLS } from "../../authentication/auth";
import { useEffect, useState } from "react";
import { Club } from "../../types/Club";
import { generateShareId, getBigTitle, getClub, getIsClubAdmin } from "../../helpers/other";
import { ClubLinkBar } from "./generic/ClubLinkBar";
import "./ShareId.css";
import { ContentCopy } from "@mui/icons-material";

export const ShareId = () => {

    const [club, setClub] = useState<Club>();
    const [message, setMessage] = useState<string>("");

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

    const handleCopyClick = () => {
        navigator.clipboard.writeText(generateShareId(clubId!))
        setMessage("Share ID has been copied to your clipboard")
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
                <ContentCopy
                    onClick={handleCopyClick}
                />
                <div className='share-id-text' style={{color:"green"}}>
                    {message}
                </div>
            </div>
        </div>
    );
}