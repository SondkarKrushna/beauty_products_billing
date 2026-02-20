import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const countApi = createApi({
    reducerPath: "countApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/`, credentials: "include" }),
    tagTypes: ["count"],
    endpoints: (builder) => {
        return {
            getCount: builder.query({
                query: () => {
                    return {
                        url: "admin/v1/count",
                        method: "GET",
                    }
                },
                providesTags: ["count"],
            }),  
        }
    }
})

export const {
    useGetCountQuery,   
} = countApi
