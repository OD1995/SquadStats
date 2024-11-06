import { useParams } from "react-router-dom";

interface ClubOverviewProps {
    // club_id:string
}

export const ClubOverview = (props:ClubOverviewProps) => {

    let { club_id } = useParams();

    return (
        <div>
            {club_id}
        </div>
    );
}