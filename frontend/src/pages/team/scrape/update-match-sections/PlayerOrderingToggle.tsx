import { useState } from "react";
import "./PlayerOrderingToggle.css";

export const PlayerOrderingToggle = () => {
    const [isAlphabetical, setIsAlphabetical] = useState<boolean>(true);

    const toggleSwitch = (): void => {
        setIsAlphabetical(!isAlphabetical);
    };

    return (
        <div className="toggle-container">
            <div id='pot-title'>Order Players By</div>
            <div className="toggle-switch">
                <div className={(isAlphabetical ? "active-pot" : "") + "pot-label"}>Alphabetical</div>
                <div className="switch" onClick={toggleSwitch} role="button" aria-label="Toggle order">
                    <div className={`slider ${isAlphabetical ? "left" : "right"}`}></div>
                </div>
                <div className={(!isAlphabetical ? "active-pot" : "") + "pot-label"}>Player Apps</div>
            </div>
        </div>
    );
};