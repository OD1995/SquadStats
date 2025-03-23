import { isWiderThanHigher } from "../helpers/windowDimensions";
import "./Loading.css";

export const Loading = () => {

    const isDesktop = isWiderThanHigher();

    return (
        <div id='loading-div-parent'>
            <div id="loading-div">
                <img
                    id={(isDesktop ? "desktop-" : "mobile-") + "loading"}
                    className='loading-logo'
                    src="/logos/square.png"
                />
                Loading...
            </div>
        </div>
    )
}