import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit"
import rootReducer, { StoreState } from "./reducers/rootReducer";

// const middleware = [thunk];

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false})
});

export type AppDispatch = typeof store.dispatch;

export type AppThunk = ThunkAction<void, StoreState, undefined, Action<string>>;

export default store;