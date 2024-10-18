import Map from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MarkerData } from '../../types/MarkerData';
import { AbrOrdobMarker } from './AbrOrdobMarker';

const MAPBOX_TOKEN = "pk.eyJ1Ijoic3F1YWRzdGF0cyIsImEiOiJjbTJkbW5yeXcxN2d6MmlxeDlzY240aW0wIn0._5JU3L0HLagDhLjfyClqFQ"

const dataArray : MarkerData[] = [
    {
        latitude: 34.967519,
        longitude: 135.77971,
        colour: 'red',
        popupText: 'Test',
        markerId: "tim-japan"
    },
    {
        latitude: -22.94962392506627,
        longitude: -43.20447905617719,
        colour: 'red',
        popupText: 'Test2',
        markerId: 'robin-brazil'
    }
]

export const AbrORDOB = () => {

    // https://mariestarck.com/how-to-display-popups-on-a-mapbox-map-mapbox-react-tutorial-part-3/

    return (
        <Map
            initialViewState={{
                latitude: 51.510730,
                longitude: -0.035190,
                zoom: 1
            }}
            style={{
                width: "90vw",
                height: 600
            }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            mapboxAccessToken={MAPBOX_TOKEN}
        >
            {
                dataArray.map(
                    (data:MarkerData) => {
                        return (
                            <AbrOrdobMarker
                                key={data.markerId}
                                data={data}
                            />
                        )
                    }
                )
            }
        </Map>
    );
}