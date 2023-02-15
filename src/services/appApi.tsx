import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const appApi = createApi({
  reducerPath: 'appApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://chat-backend.herokuapp.com' }),
  endpoints: (builder) => ({
    signupUser: builder.mutation({
      query: (user) => ({
        url: '/users',
        method: 'POST',
        body: user,
      }),
    }),
    loginUser: builder.mutation({
      query: (user) => ({
        // url: '/users/login',
        url: '/auth/signin',
        method: 'POST',
        body: user,
      }),
    }),

    logoutUser: builder.mutation({
      query: (payload) => ({
        // url: '/logout',
        url: '/auth/logout',
        method: 'DELETE',
        body: payload,
      }),
    }),
  }),
});

export const {
  useSignupUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
} = appApi;

export default appApi;
