import { Tooltip } from "@mui/material"
import { MouseEventHandler } from "react"

export interface TooltipButtonProps {
    tooltipText:string
    disabled:boolean
    handleClick:MouseEventHandler
    buttonText:string
    className?:string
    placement?:"bottom" | "bottom-end" | "bottom-start" | "left-end" | "left-start" | "left" | "right-end" | "right-start" | "right" | "top-end" | "top-start" | "top"
}

export const TooltipButton = (props:TooltipButtonProps) => {
    return (
        <Tooltip title={props.tooltipText} placement={props.placement ?? "bottom"}>
            <button
                className={
                    "ss-green-button ts-button" + (props.disabled ? " disabled-button " : " ") + (props.className)
                }
                onClick={props.handleClick}
                disabled={props.disabled}
            >
                {props.buttonText}
            </button>
        </Tooltip>
    )
}