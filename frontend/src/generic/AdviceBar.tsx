import { ReactNode, useEffect, useState } from "react"
import { Link } from "react-router-dom";
import "./AdviceBar.css"
import { Club } from "../types/Club";
import { Team } from "../types/Team";

interface OwnProps {
    noLinkedTeams?:boolean
    noRows?:boolean
    club?:Club
    team?:Team
}

export const AdviceBar = (props:OwnProps) => {

    const [content, setContent] = useState<ReactNode>(null);
    
    useEffect(
        () => {
            var _content_;
            if (props.noLinkedTeams) {
                const linkUrl = `/club/${props.club?.club_id}/teams`
                _content_ = (
                    <>
                        You have no teams linked to your club, you can
                        change that on the <Link to={linkUrl}>Teams</Link> page
                    </>
                )
            } else if (props.noRows) {
                if (props.team) {
                    const linkUrl = `/team/${props.team.team_id}/update-data`;
                    _content_ = (
                        <>
                            Your team has no match data, you can change
                            that on the <Link to={linkUrl}>Update Data</Link> page
                        </>
                    )
                } else if (props.club) {
                    _content_ = (
                        <>
                            None of the teams linked to your club have any match data,
                            you can change that in the Update Data page of each team
                        </>
                    )
                }
                setContent(_content_);
            }
            setContent(_content_);
        },
        []
    )

    return (
        <div id='advice-bar-parent'>
            <div id='advice-bar'>
                {content}
            </div>
        </div>
    )
}