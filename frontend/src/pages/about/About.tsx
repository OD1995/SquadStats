import { getUserFromLocalStorage } from "../../services/api"

export const About = () => {

    const a = JSON.stringify(getUserFromLocalStorage());
    const b = 1; 

    return (
        <div>
            {a}
        </div>
    )
}