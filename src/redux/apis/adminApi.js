import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/biling_software`, credentials: "include" }),
    tagTypes: ["admin"],

    endpoints: (builder) => {
        return {
            getAllinvoice: builder.query({
                query: ({ page = 1, limit = 10 } = {}) => ({
                    url: `/invoice?page=${page}&limit=${limit}`,
                    method: "GET",
                }),
                providesTags: ["admin"],
            }),
            getAllproduct: builder.query({
                query: () => {
                    return {
                        url: "/get/biling/all/product",
                        method: "GET",
                    }
                },
                providesTags: ["admin"],
            }),

                getInvoicebyId: builder.query({
                query: (id) => ({
                    url: `/invoice/${id}`,
                    method: "GET",
                }),
                providesTags: ["admin"],
            }),
          getProductbyId:builder.query({
            query:(id)=>({
               url:`/get/product/${id}`,
            })
          }),
              createInvoice: builder.mutation({
      query: (body) => ({
        url: "/invoice",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Invoice"], 
    }),
        }
    }
})

export const {
    useGetAllinvoiceQuery,
    useGetAllproductQuery,
    useGetInvoicebyIdQuery,
    useGetProductbyIdQuery,
    useCreateInvoiceMutation,
} = adminApi
