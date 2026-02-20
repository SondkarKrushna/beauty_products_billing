import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "../apis/authApi";

const authSlice = createSlice({
    name: "authSlice",
    initialState: {
        // admin: JSON.parse(localStorage.getItem("admin")),
    },
    reducers: {
        adminLogout: (state, { payload }) => {
            localStorage.removeItem("admin")
            state.admin = null
        },
    },
    extraReducers: builder => builder
        .addMatcher(authApi.endpoints.LoginAdmin.matchFulfilled, (state, { payload }) => {
            state.admin = payload
        })
})

export const {
    adminLogout,
} = authSlice.actions
export default authSlice.reducer