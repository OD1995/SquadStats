import { Marker } from 'react-map-gl';
import { MarkerData } from '../../types/MarkerData';
import { AbrOrdobPopup } from './AbrOrdobPopup';
import { useEffect, useState } from 'react';

interface AbrOrdobMarkerProps {
    data: MarkerData
}

export const AbrOrdobMarker = (props:AbrOrdobMarkerProps) => {
    const [showPopup, setShowPopup] = useState(false);
    
    const handleClick = () => {
        const newVal = !showPopup;
        setShowPopup(newVal);
    }

    useEffect(
        () => {
            setShowPopup(true);
        },
        []
    )

    
    return (
        <Marker
            latitude={props.data.latitude}
            longitude={props.data.longitude}
            color={props.data.colour}
            // onClick={() => setShowPopup(!showPopup)}
            onClick={handleClick}
            // popup={popup}
        >
            {
                showPopup && (
                    <AbrOrdobPopup
                        data={props.data}
                        amShowing={showPopup}
                    />
                )
            }
        </Marker>
    )
}