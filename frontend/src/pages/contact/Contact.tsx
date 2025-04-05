import { getBigTitle } from "../../helpers/other";

export const Contact = () => {
    return (
        <div className="page-parent">
            {getBigTitle("Contact")}
            <div id='contact-text'>
                <p>
                    For any suggestions/issues/bugs, please email{" "}
                        <a
                            href="mailto:SquadStats.Team@gmail.com"
                        >
                            SquadStats.Team@gmail.com
                        </a>
                </p>
            </div>
        </div>
    );
}