import { ReactNode } from "react"
import "./Modal.css"

interface ModalProps {
    handleModalClose:Function
    content:ReactNode
}

export const Modal = (props:ModalProps) => {
    return (
        <div
            id='modal-parent'
            onClick={() => props.handleModalClose()}
        >
            <div
                id='modal-content'
                onClick={(e) => e.stopPropagation()}
            >
                <div id='modal-top'>
                    <span
                        id='modal-close'
                        onClick={() => props.handleModalClose()}
                    >
                        &times;
                    </span>
                </div>
                <div id='modal-bottom'>
                    {props.content}
                </div>
            </div>
        </div>
    )
}