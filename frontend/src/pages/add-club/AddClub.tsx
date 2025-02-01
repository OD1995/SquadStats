import { useEffect, useState } from "react"
import { NewClubType } from "./NewClubType"
import "./AddClub.css";
import { CLUB_TYPE } from "../../types/enums";
import { CompletelyNew } from "./CompletelyNew";
import { NewClubSubmit } from "./NewClubSubmit";
import { AlreadyExistsClub } from "../../how-to/AlreadExistsClub";
import { HeirachyDescription } from "../../how-to/HeirachyDescription";
import { useNavigate } from "react-router-dom";
import { getUserLS } from "../../authentication/auth";
import { getBigTitle } from "../../helpers/other";

interface AddClubProps {
    includeHeirachy:boolean
}

export const AddClub = (props:AddClubProps) => {

    const [newClubType, setNewClubType] = useState<string>("");

    const user = getUserLS();
    const navigate = useNavigate();

    useEffect(
        () => {
            if (!user) {
                navigate("/about");
            }
        },
        []
    )

    return (
        <div className='page-parent'>
            {/* <h1 className="big-h1-title">
                Add Club
            </h1> */}
            {getBigTitle("Add Club")}
            {
                props.includeHeirachy && (
                    <HeirachyDescription/>
                )
            }
            <div id='add-club-entry-parent'>
                <NewClubType
                    newClubType={newClubType}
                    setNewClubType={setNewClubType}
                />
                {
                    (newClubType == CLUB_TYPE.ALREADY_EXISTS) && (
                        <NewClubSubmit
                            labelText="Enter the clubs's unique ID"
                            clubType={CLUB_TYPE.ALREADY_EXISTS}
                            modalContent={<AlreadyExistsClub/>}
                            dataSource={null}
                        />
                    )
                }
                {
                    (newClubType == CLUB_TYPE.COMPLETELY_NEW) && (
                        <CompletelyNew/>
                    )
                }
            </div>
        </div>
    )
}