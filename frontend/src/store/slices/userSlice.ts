import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../types/User";
import { StoreState } from "../reducers/rootReducer";

export interface UserState {
    user:User|null
    refreshCounter:number
}

export const initialState:UserState = {
    user: null,
    refreshCounter: 0
}

const userSlice = createSlice(
    {
        name: 'app',
        initialState,
        reducers: {
            // setUser:(state:UserState, action:PayloadAction<User|null>) => {state.user = action.payload;},
            triggerRefresh:(state:UserState) => {state.refreshCounter += 1}
        }
    }
)

export function refreshSelector(state:StoreState) {
    return state.userSlice.refreshCounter;
}

export const { triggerRefresh } = userSlice.actions;

export default userSlice.reducer;