import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  member: {
    memberNum: null,
    nickname: null,
    profileImg: null,
    introduction: null,
    hasMore: false,
  },
  access: "",
};

const memberSlice = createSlice({
  name: "member",
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.member = action.payload.member;
      state.access = action.payload.access;
    },

    logout(state) {
      state.isLoggedIn = false;
      state.member = {
        memberNum: null,
        nickname: null,
        profileImg: null,
        introduction: null,
        hasMore: null,
      };
      state.access = "";
    },
    setMemberInfoChange(state, action) {
      if (action.payload.profileImg) {
        state.member.profileImg = action.payload.profileImg;
      }
      if (action.payload.nickname) {
        state.member.nickname = action.payload.nickname;
      }
      if (action.payload.introduction) {
        state.member.introduction = action.payload.introduction;
      }
    },
    setAccessToken(state, action) {
      state.access = action.payload.access;
    },
  },
});

export const { login, logout, setMemberInfoChange, setAccessToken } =
  memberSlice.actions;
export default memberSlice.reducer;
