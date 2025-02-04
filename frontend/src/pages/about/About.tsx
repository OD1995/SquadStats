import "./About.css";
import { useEffect, useState } from "react";
import OtherService from "../../services/OtherService";
import { BackendResponse } from "../../types/BackendResponse";
import { GenericTableData } from "../../types/GenericTableTypes";
// import { SortableTable } from "../../generic/BetterTable";
import { Loading } from "../../generic/Loading";

export const About = () => {

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
        <div id='about-parent' className="page-parent" style={{display:"flex",flexDirection:"column"}}>
            <div className="error-message">
                {errorMessage}
            </div>
            <div>
                this is a test
            </div>
            {/* {
                data && (
                    <SortableTable
                        rowsPerPage={10}
                        {...data}
                    />
                )
            } */}
            <Loading/>
        </div>
    )
}