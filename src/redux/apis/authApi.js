import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/biling_software/biling`, credentials: "include" }),
    tagTypes: ["auth"],
    endpoints: (builder) => {
        return {
            RegisterAdmin: builder.mutation({
                query: () => {
                    return {
                        url: "/register-admin",
                        method: "POST",

                    }
                },
                providesTags: ["auth"]
            }),
           LoginAdmin: builder.mutation({
  query: (userData) => ({
    url: "/login",
    method: "POST",
    body: userData,
  }),
  invalidatesTags: ["auth"],
  transformResponse: (data) => {
    const adminData = data?.result || data?.data || data;
    if (adminData) {
      localStorage.setItem("admin", JSON.stringify(adminData));
    }
    return adminData;
  },
}),

            LogoutAdmin: builder.mutation({
                query: userData => {
                    return {
                        url: "/logout-admin",
                        method: "POST",
                        body: userData
                    }
                },
                invalidatesTags: ["auth"],
                transformResponse: data => {
                    localStorage.removeItem("admin")
                    return data.result
                }
            }),
        }
    }
})

export const {
    useRegisterAdminMutation,
    useLoginAdminMutation,
    useLogoutAdminMutation,
} = authApi
