import { useEffect, useState } from "react";
import { generateId, getBigTitle } from "../../helpers/other";
import { ChangeLogEntry } from "../../types/ChangeLogEntry";
import OtherService from "../../services/OtherService";
import { BackendResponse } from "../../types/BackendResponse";
import { ChangeLogElement } from "./ChangeLogElement";
import "./ChangeLog.css";

export const ChangeLog = () => {

    const [changeLogEntries, setChangeLogEntries] = useState<ChangeLogEntry[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(
        () => {
            OtherService.getChangeLog().then(
                (res:BackendResponse) => {
                    if (res.success) {
                        setChangeLogEntries(res.data);
                    } else {
                        setErrorMessage(res.data.message);
                    }
                }
            )
        },
        []
    )

    return (
        <div className="page-parent">
            {getBigTitle("Change Log")}
            <div key={generateId()} style={{color:"red"}}>
                {errorMessage}
            </div>
            <div key={generateId()}>
                {
                    changeLogEntries.map(
                        (cle:ChangeLogEntry) => (
                            <ChangeLogElement
                                {...cle}
                            />
                        )
                    )
                }
            </div>
        </div>
    ); 
}