import { useState } from "react"
import { NewClubType } from "./NewClubType"
import "./AddClub.css";
import { CLUB_TYPE } from "../../types/enums";
import { CompletelyNew } from "./CompletelyNew";
import { NewClubSubmit } from "./NewClubSubmit";
import { AlreadyExistsClub } from "../../how-to/AlreadExistsClub";

export const AddClub = () => {

    const [newClubType, setNewClubType] = useState<string>("")

    return (
        <div id='add-club-parent'>
            <h1 className="big-h1-title">
                Add Club
            </h1>
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