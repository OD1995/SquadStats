import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "../slices/userSlice";

const rootReducer = combineReducers(
    {
        userSlice
    }
)

export type StoreState = ReturnType<typeof rootReducer>;

export default rootReducer;