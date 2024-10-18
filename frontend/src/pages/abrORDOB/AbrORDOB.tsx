import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MarkerData } from '../../types/MarkerData';
import { AbrOrdobMarker } from './AbrOrdobMarker';
import { AbrOrdobPopup } from './AbrOrdobPopup';
import { useState } from 'react';
import { data } from '@remix-run/router';

const MAPBOX_TOKEN = "pk.eyJ1Ijoic3F1YWRzdGF0cyIsImEiOiJjbTJkbW5yeXcxN2d6MmlxeDlzY240aW0wIn0._5JU3L0HLagDhLjfyClqFQ"

const dataDict : Record<string,MarkerData> = {
    "tim-japan": {
        latitude: 34.967519,
        longitude: 135.77971,
        colour: 'blue',
        popupText: `I spent an afternoon a couple of weeks back having to CORRECT every tour guide in my sight on what this great shrine actually stands for. Some of them had some absolutely laughable takes. Some stuff about a god of rice? 

        Anyway... As any of us would, I launched into countless monologues about it's real historic standing. 

The Fushimi Inari Shrine has a red arch for each time a significant moment has happened for ORDOB's 5 a side team in history.

From John Walters first goal over a year ago, Mitch Gordon's last minute winner vs Palamara Jagon, Rob scoring 7 goals in one match, Joe having a beer and a Pad Thai before our first ever game and Mitch missing tonight because of JetLag.

THIS IS WHY THESE BEAUTIFUL RED ARCHES EXIST

Lets add another arch to make it 10,001 tonight ⛩️

COYORDOB 🦏3️⃣👃`,
        markerId: "tim-japan"
    },
    'robin-brazil': {
        latitude: -22.94962392506627,
        longitude: -43.20447905617719,
        colour: 'red',
        popupText: `Boys, it's the last of my telegrams on my scouting mission across the Americas. Unfortunately, I've found no-one with enough touch, charm and manners to even get a trial for our club. So the message for tonight from Christ the Redeemer in Rio is to play with freedom. Let the Seleção of our Thursday Castlehaven lineup take The Camden Kings by storm. Releasing our inner samba is as simple as rocking step combinations, rolling hip action, and pulsing movements whilst playing tika taka in syncopation. Look for the beautiful ball and play with your instincts, the favelas are with you 🎨🔫 #UDCDB🇧🇷 Um dia comum do barclays!`,
        markerId: 'robin-brazil'
    }
}

export const AbrORDOB = () => {

    const [markerDataDict, setMarkerDataDict] = useState<Record<string,MarkerData>>(dataDict);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMarkerId, setPopupMarkerId] = useState("");
    const [popupText, setPopupText] = useState("");

    const handleClick = (markerId:string) => {
        console.log("turning on")
        setShowPopup(true);
        setPopupMarkerId(markerId);
        setPopupText(markerDataDict[markerId].popupText)
    }

    return (
        <div id='abrordob-parent'>
            <Map
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
                mapboxAccessToken={MAPBOX_TOKEN}
            >
                {
                    Object.values(dataDict).map(
                        (data:MarkerData) => {
                            return (
                                <Marker
                                    key={data.markerId}
                                    latitude={data.latitude}
                                    longitude={data.longitude}
                                    color={data.colour}
                                    // onClick={() => setShowPopup(!showPopup)}
                                    onClick={() => handleClick(data.markerId)}
                                />
                            )
                        }
                    )
                }
            </Map>
            {
                showPopup && (
                    <AbrOrdobPopup
                        markerId={popupMarkerId}
                        text={popupText}
                        setShowPopup={setShowPopup}
                    />
                )
            }
        </div>
    );
}