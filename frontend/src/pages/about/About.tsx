import "./About.css";
import { useEffect, useState } from "react";
import OtherService from "../../services/OtherService";
import { BackendResponse } from "../../types/BackendResponse";
import { GenericTableData } from "../../types/GenericTableData";
import { SortableTable } from "../../generic/SortableTable";

export const About = () => {

    // const user = useSelector(userSelector);
    // const user = getUserLS();
    const [data, setData] = useState<GenericTableData>();
    const [errorMessage, setErrorMessage] = useState<string>();

    useEffect(
        () => {
            OtherService.getRandom(
            ).then(
                (res:BackendResponse) => {
                    if (res.success) {
                        setData(res.data);
                    } else {
                        setErrorMessage(res.data.message);
                    }
                }
            )
        },
        []
    )

    return (
        <div id='about-parent' className="page-parent">
            <div>
                {errorMessage}
            </div>
            {
                data && (
                    <SortableTable
                        rowsPerPage={10}
                        isRanked={true}
                        {...data}
                    />
                )
            }
        </div>
    )
}