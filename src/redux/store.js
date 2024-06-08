import { applyMiddleware, configureStore} from "@reduxjs/toolkit";
import storeReducer from "./slice/slice.js";
import { thunk } from "redux-thunk";

export const store = configureStore({
    reducer: {
        storeReducer: storeReducer
    }

},applyMiddleware(thunk))