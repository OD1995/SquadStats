import Map, { Marker, NavigationControl } from 'react-map-gl';
import "./AbrORDOB.css";
import 'mapbox-gl/dist/mapbox-gl.css';
import { MarkerData } from '../../types/MarkerData';
import { AbrOrdobPopup } from './AbrOrdobPopup';
import { useEffect, useState } from 'react';
import OtherService from '../../services/OtherService';
import { BackendResponse } from '../../types/BackendResponse';
import { useLocation, useNavigate } from 'react-router-dom';
import useWindowDimensions from '../../helpers/useWindowDimensions';

export const AbrORDOB = () => {

    const [markerDataDict, setMarkerDataDict] = useState<Record<string,MarkerData>>({});
    const [showPopup, setShowPopup] = useState(false);
    const [popupMarkerId, setPopupMarkerId] = useState("");
    const [popupText, setPopupText] = useState("");

    const { hash } = useLocation();
    const navigate = useNavigate();
    const { height, width } = useWindowDimensions();

    const isLongerThanWider = (height:number|null, width:number|null) => {
        // return true;
        if (typeof height === "number") {
            if (typeof width === "number") {
                return height > width;
            }
        }
        return false;
    }

    // const isMobile = isLongerThanWider(height, width);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const tellUserToRotate = isMobile && isLongerThanWider(height, width);
    const zoomVal = isMobile ? 0.1 : 1.5;
    // const txt = isMobile ? "yes mobile" : "no mobile";
    const txt = "";
    //Your experience will be much better if you rotate your phone

    useEffect(
        () => {
            OtherService.getAbrodobMarkers()
            .then(
                (res:BackendResponse) => {
                    if (res.success) {
                        var mdd: Record<string,MarkerData> = {};
                        const data: MarkerData[] = res.data;
                        for (const md of data) {
                            mdd[md.marker_id] = md
                        }
                        setMarkerDataDict(mdd);
                    } else {
                        console.error("getAbrodobMarkers failure")
                        console.error(res.data);
                    }
                }
            )
            if (hash != "") {
                handleClick(hash.substring(1));
            }
        },
        []
    )

    const handleClick = (markerId:string) => {
        navigate(`#${markerId}`)
        setShowPopup(true);
        setPopupMarkerId(markerId);
        setPopupText(markerDataDict[markerId]?.text)
    }

    const handlePopupClose = () => {
        navigate("");
        setShowPopup(false);
        setPopupMarkerId("");
        setPopupText("");
    }

    return (
        <div id='abrordob-parent'>
            {
                true && (
                    <div style={{color: "red"}}>
                        {txt}
                    </div>
                )
            }
            <Map
                key='map'
                initialViewState={{
                    // latitude: 51.510730,
                    // longitude: -0.035190,
                    latitude: 9.9729431,
                    longitude: 8.2296133,
                    // zoom: isMobile ? 1 : 3
                    // zoom: 10
                    zoom: zoomVal
                }}
                style={{
                    // width: "65vw",
                    // height: 600
                    // height: "90vh"
                }}
                id='abrordob-map'
                mapStyle="mapbox://styles/mapbox/streets-v9"
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
            >
                <NavigationControl
                    showZoom
                />
                {
                    Object.values(markerDataDict).map(
                        (data:MarkerData) => {
                            return (
                                <Marker
                                    key={data.marker_id}
                                    latitude={data.latitude}
                                    longitude={data.longitude}
                                    color={data.colour}
                                    onClick={() => handleClick(data.marker_id)}
                                />
                            )
                        }
                    )
                }
            </Map>
            {
                showPopup && (
                    <AbrOrdobPopup
                        key='popup'
                        markerId={popupMarkerId}
                        text={popupText}
                        handlePopupClose={handlePopupClose}
                    />
                )
            }
        </div>
    );
}