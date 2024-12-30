import { useSelector } from "react-redux";
import { userSelector } from "../../store/slices/userSlice";
import "./About.css";
import { getUserLS } from "../../authentication/auth";
import { useEffect, useState } from "react";
import { MarkerData } from "../../types/MarkerData";
import OtherService from "../../services/OtherService";
import { BackendResponse } from "../../types/BackendResponse";

export const About = () => {

    // const user = useSelector(userSelector);
    // const user = getUserLS();
    const [data, setData] = useState<MarkerData[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>();

    useEffect(
        () => {
            OtherService.getAbrodobMarkers(
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
        <div id='about-parent'>
            <div>
                Some text
            </div>
            <div>
                {errorMessage}
            </div>
            {
                data.map(
                    (md:MarkerData) => {
                        return (
                            <div>
                                {md.marker_id}
                            </div>
                        )
                    }
                )
            }
        </div>
    )
}