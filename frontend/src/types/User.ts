import { Club } from "./Club"

export interface User {
    access_token: string
    clubs: Club[]
}