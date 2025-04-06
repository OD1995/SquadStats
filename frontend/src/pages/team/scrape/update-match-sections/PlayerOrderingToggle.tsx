import "./PlayerOrderingToggle.css";

interface OwnProps {
    isAlphabetical:boolean
    setIsAlphabetical:Function
}

export const PlayerOrderingToggle = (props:OwnProps) => {
    // const [isAlphabetical, setIsAlphabetical] = useState<boolean>(true);

    const toggleSwitch = (): void => {
        props.setIsAlphabetical(!props.isAlphabetical);
    };

    return (
        <div className="toggle-container">
            <div id='pot-title'>Order Players By</div>
            <div className="toggle-switch">
                <div className={(props.isAlphabetical ? "active-pot" : "") + "pot-label"}>
                    Alphabetical
                </div>
                <div className="switch" onClick={toggleSwitch} role="button" aria-label="Toggle order">
                    <div className={`slider ${props.isAlphabetical ? "left" : "right"}`}></div>
                </div>
                <div className={(!props.isAlphabetical ? "active-pot" : "") + "pot-label"}>
                    Player Team Apps
                </div>
            </div>
        </div>
    );
};