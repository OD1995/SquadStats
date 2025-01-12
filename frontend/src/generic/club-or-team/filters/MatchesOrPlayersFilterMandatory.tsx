import { MatchTypeFilter } from "../matches/MatchTypeFilter"

interface OwnProps {
    selectedType:string
    setSelectedType:Function
}

export const MatchesOrPlayersFilterMandatory = (props:OwnProps) => {
    return (
        <div>
            {/* <h4 className="small-caps-subtitle">
                MANDATORY
            </h4> */}
            <MatchTypeFilter
                type={props.selectedType}
                setType={props.setSelectedType}
            />
        </div>
    )
}