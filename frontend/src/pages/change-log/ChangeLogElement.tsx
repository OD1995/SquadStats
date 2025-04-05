import { ChangeLogEntry } from "../../types/ChangeLogEntry";

export const ChangeLogElement = (props:ChangeLogEntry) => {
    return (
        <div id={props.change_log_entry_id} key={props.change_log_entry_id}>
            <b className="change-log-date">
                {props.date}
            </b>
            <div
                dangerouslySetInnerHTML={{
                    __html: props.text
                }}
                className="change-log-text"
            />
        </div>
    )
}