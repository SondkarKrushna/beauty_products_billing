import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/authApi";
import authSlice from "./slices/adminauthslice"
import { adminApi } from "./apis/adminApi";
import {countApi} from "./apis/countApi";

const reduxStore = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [adminApi.reducerPath]: adminApi.reducer,
        [countApi.reducerPath]:countApi.reducer,
        Adminauth: authSlice
    },
    middleware: def => [
        ...def(),
        authApi.middleware,
        adminApi.middleware,
        countApi.middleware,
    ]
})

export default reduxStore