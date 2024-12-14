import { TooltipButton, TooltipButtonProps } from "../../../generic/TooltipButton"

interface OwnProps {
    title:string
    buttonProps:TooltipButtonProps[]
}

export const TeamScrapeButtonColumn = (props:OwnProps) => {
    return (
        <div id="team-scrape-button-column">
            <p id="team-scrape-button-column-text">
                {props.title}
            </p>
            <div id='team-scrape-button-column-buttons'>
                {
                    props.buttonProps.map(
                        (buttonProps:TooltipButtonProps) => {
                            return <TooltipButton {...buttonProps} className='team-scrape-button-column-button'/>
                        }
                    )
                }
            </div>
        </div>
    )
}