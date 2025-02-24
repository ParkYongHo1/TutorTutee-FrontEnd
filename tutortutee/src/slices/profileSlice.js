import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  noticeListCount: false,
  followListCount: 0,
  followerListCount: 0,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfileListCountChange(state, action) {
      if (action.payload.noticeListCount) {
        state.member.noticeListCount = action.payload.noticeListCount;
      }
      if (action.payload.followListCount) {
        state.member.followListCount = action.payload.followListCount;
      }
      if (action.payload.followerListCount) {
        state.member.followerListCount = action.payload.followerListCount;
      }
    },
    setAccessToken(state, action) {
      state.access = action.payload.access;
    },
  },
});

export const { setProfileListCountChange } = profileSlice.actions;
export default profileSlice.reducer;
