import { generateId, getImageSource } from "../../helpers/other";
import { MatchData } from "../../types/MatchData";
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'


interface OwnProps {
    matchData:MatchData
}

export const MatchReportContent = (props:OwnProps) => {

    const createImageViewers = (imageIds:string[]) => {
        const width = (85 / imageIds.length) - 4;
        var imgs = [];
        for (const imageId of imageIds) {
            imgs.push(
                <Zoom
                    key={generateId()}
                >
                    
                    <img
                        src={getImageSource(imageId)}
                        style={{
                            width: `${width}vw`,
                            marginLeft: '4vw',
                            marginRight: '4vw',
                        }}
                    />
                </Zoom>
            )
        }
        return imgs;
    }

    return (
        <div>
            {
                props.matchData.match_info.match_report_image_ids ? (
                    <div id='match-report-images-viewer'>
                        {createImageViewers(props.matchData.match_info.match_report_image_ids!)}
                    </div>
                ) : (
                    <div style={{whiteSpace:"pre-line"}}>
                        {props.matchData.match_info.match_report_text}
                    </div>
                )
            }
        </div>
    );
}