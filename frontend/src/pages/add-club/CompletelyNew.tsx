import { useState } from "react"
import { CLUB_TYPE, DATA_SOURCE } from "../../types/enums"
import { DataSource } from "./DataSource"
import { FootballAssociationClub } from "../../how-to/FootballAssociationClub";
import { NewClubOrTeamSubmit } from "../../generic/club-or-team/NewClubOrTeamSubmit";

export const CompletelyNew = () => {

    const [dataSource, setDataSource] = useState<string>("");

    return (
        <div
            id='completely-new-parent'
            className="add-cot-section"
        >
            <DataSource
                dataSource={dataSource}
                setDataSource={setDataSource}
            />
            {
                (dataSource == DATA_SOURCE.FOOTBALL_ASSOCIATION) && (
                    <NewClubOrTeamSubmit
                        labelText="Enter the club ID"
                        modalContent={<FootballAssociationClub/>}
                        clubType={CLUB_TYPE.COMPLETELY_NEW}
                        dataSource={dataSource}
                        club
                    />
                )
            }
            {
                (dataSource == DATA_SOURCE.MANUAL) && (
                    <NewClubOrTeamSubmit
                        labelText="Enter the club's name"
                        clubType={CLUB_TYPE.COMPLETELY_NEW}
                        dataSource={dataSource}
                        club
                    />
                )
            }
        </div>
    )
}