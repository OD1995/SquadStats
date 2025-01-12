import { isWiderThanHigher } from "../../../helpers/windowDimensions";
import { Modal } from "../../Modal";
import { Club } from "../../../types/Club";
import { Team } from "../../../types/Team";


interface OwnProps {
    club?:Club
    team?:Team
    setErrorMessage:Function
    setTableData:Function
    setIsLoading:Function
    filterTitle:string
    handleModalClose:Function
    content:JSX.Element
    isExpanded:boolean
    setIsExpanded:Function
}

export const MatchesOrPlayersFilter = (props:OwnProps) => {
   
    const isDesktop = isWiderThanHigher();

    if (!isDesktop) {
        if (props.isExpanded) {
            return (
                <Modal
                    handleModalClose={props.handleModalClose}
                    content={
                        <div 
                            id='mobile-expanded-mop-filter'
                            className='expanded-mop-filter'
                        >
                            {props.content}
                        </div>
                    }
                />
            );
        } else {
            return (
                <div 
                    id='mobile-folded-mop-filter'
                    className="folded-mop-filter"
                    onClick={() => props.setIsExpanded(true)}>
                    {props.filterTitle +  " FILTERS"}
                </div>
            )
        }
    } else {
        return (
            <div 
                id='desktop-expanded-mop-filter'
                className='expanded-mop-filter'
            >
                {props.content}
            </div>
        )
    }
}