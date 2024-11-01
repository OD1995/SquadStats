import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/User";
import { StoreState } from "../reducers/rootReducer";

export interface UserState {
    user:User|null
}

export const initialState:UserState = {
    user: null
}

const userSlice = createSlice(
    {
        name: 'app',
        initialState,
        reducers: {
            setUser:(state:UserState, action:PayloadAction<User|null>) => {state.user = action.payload;}
        }
    }
)

export function userSelector(state:StoreState) {
    return state.userSlice.user;
}

export const { setUser } = userSlice.actions;

export default userSlice.reducer;