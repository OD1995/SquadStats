import { Link } from "react-router-dom"

export const HeirachyDescription = () => {
    return (
        <div id='heirachy-text-div'>
            <p id='heirachy-text'>
                Before adding your first club, make sure you understand how club heirachy works,
                explained on the <Link to='/about'>About</Link> page
            </p>
        </div>
    )
}