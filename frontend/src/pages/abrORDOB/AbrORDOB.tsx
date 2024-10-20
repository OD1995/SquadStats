import Map, { Marker, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MarkerData } from '../../types/MarkerData';
import { AbrOrdobPopup } from './AbrOrdobPopup';
import { useEffect, useState } from 'react';
import OtherService from '../../services/OtherService';
import { BackendResponse } from '../../types/BackendResponse';
import { useLocation, useNavigate } from 'react-router-dom';

export const AbrORDOB = () => {

    const [markerDataDict, setMarkerDataDict] = useState<Record<string,MarkerData>>({});
    const [showPopup, setShowPopup] = useState(false);
    const [popupMarkerId, setPopupMarkerId] = useState("");
    const [popupText, setPopupText] = useState("");

    const { hash } = useLocation();
    const navigate = useNavigate();

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
                handleClick(hash);
            }
        },
        []
    )

    const handleClick = (markerId:string) => {
        navigate(`#${markerId}`)
        setShowPopup(true);
        setPopupMarkerId(markerId);
        setPopupText(markerDataDict[markerId].text)
    }

    const handlePopupClose = () => {
        navigate("");
        setShowPopup(false);
        setPopupMarkerId("");
        setPopupText("");
    }

    return (
        <div id='abrordob-parent'>
            <Map
                key='map'
                initialViewState={{
                    latitude: 51.510730,
                    longitude: -0.035190,
                    zoom: 1
                }}
                style={{
                    width: "65vw",
                    height: 600
                }}
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