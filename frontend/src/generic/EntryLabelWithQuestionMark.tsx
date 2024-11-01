import { FormLabel } from "@mui/material"
import { QuestionMark } from "@mui/icons-material";
import { ReactNode, useState } from "react";
import { Modal } from "./Modal";

interface EntryLabelWithQuestionMarkProps {
    labelText:string
    modalContent:ReactNode
}

export const EntryLabelWithQuestionMark = (props:EntryLabelWithQuestionMarkProps) => {

    const [showModal, setShowModal] = useState(false);

    return (
        <div className='label-with-question-mark-icon'>
            <FormLabel>
                {props.labelText}
            </FormLabel>
            <QuestionMark
                onClick={() => setShowModal(true)}
            />
            {
                showModal && (
                    <Modal
                        content={props.modalContent}
                        handleModalClose={setShowModal}
                    />
                )
            }
    </div>
    )
}