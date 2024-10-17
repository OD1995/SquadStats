import Map, {Marker} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Popup } from 'mapbox-gl';

const MAPBOX_TOKEN = "pk.eyJ1Ijoic3F1YWRzdGF0cyIsImEiOiJjbTJkbW5yeXcxN2d6MmlxeDlzY240aW0wIn0._5JU3L0HLagDhLjfyClqFQ"

interface MarkerData {
    latitude: number
    longitude: number
    colour: string
    popupText: string
}

export const AbrORDOB = () => {

    const dataArray : MarkerData[] = [
        {
            latitude: 51.510730,
            longitude: -0.035190,
            colour: 'red',
            popupText: 'Test'
        }
    ]

    const createMarker = (data:MarkerData) => {
        const popup = new Popup()
            .setText(data.popupText);
        return (
            <Marker
                latitude={data.latitude}
                longitude={data.longitude}
                color={data.colour}
                popup={popup}
            />
        )
    }
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
                    (data:MarkerData) => createMarker(data)
                )
            }
        </Map>
    );
}