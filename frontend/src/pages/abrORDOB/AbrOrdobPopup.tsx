import { Popup as ReactMapGlPopup} from 'react-map-gl';
import { MarkerData } from '../../types/MarkerData';
import './AbrOrdobPopup.css';

interface AbrOrdobPopupProps {
    data: MarkerData
    amShowing: boolean
}

export const AbrOrdobPopup = (props:AbrOrdobPopupProps) => {
    return (
        <ReactMapGlPopup
            className='abrordob-popup'
            anchor='top'
            latitude={props.data.latitude}
            longitude={props.data.longitude}
        >
            <div id={props.data.markerId}>
                <img
                    width="100%"
                    src={"/abrORDOB/" + props.data.markerId + ".jpeg"}
                />
                <p>
                    {props.data.popupText}
                </p>
            </div>
        </ReactMapGlPopup>
    )
}