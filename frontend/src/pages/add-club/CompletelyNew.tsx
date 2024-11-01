import { useState } from "react"
import { CLUB_TYPE, DATA_SOURCE } from "../../types/enums"
import { DataSource } from "./DataSource"
import { NewClubSubmit } from "./NewClubSubmit";
import { FootballAssociationClub } from "../../how-to/FootballAssociationClub";

export const CompletelyNew = () => {

    const [dataSource, setDataSource] = useState<string>("");

    return (
        <div id='completely-new-parent'>
            <DataSource
                dataSource={dataSource}
                setDataSource={setDataSource}
            />
            {
                (dataSource == DATA_SOURCE.FOOTBALL_ASSOCIATION) && (
                    <NewClubSubmit
                        labelText="Enter the club ID"
                        modalContent={<FootballAssociationClub/>}
                        clubType={CLUB_TYPE.COMPLETELY_NEW}
                    />
                )
            }
        </div>
    )
}