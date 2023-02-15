import { createSlice } from '@reduxjs/toolkit';
import appApi from '../services/appApi';

export const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    addNotification: (state: any, { payload }) => {
      if (state.newMessages[payload]) {
        state.newMessages[payload] = state.newMessages[payload] + 1;
      } else {
        state.newMessages[payload] = 1;
      }
    },
    resetNotification: (state, { payload }) => {
      // @ts-ignore: Object is possibly 'null'.
      delete state.newMessages[payload];
    },
  },

  extraReducers: (builder) => {
    builder.addMatcher(
      appApi.endpoints.signupUser.matchFulfilled,
      (state, { payload }) => payload
    );

    builder.addMatcher(
      appApi.endpoints.loginUser.matchFulfilled,
      (state, { payload }) => payload
    );

    builder.addMatcher(appApi.endpoints.logoutUser.matchFulfilled, () => null);
  },
});

export const { addNotification, resetNotification } = userSlice.actions;
export default userSlice.reducer;
