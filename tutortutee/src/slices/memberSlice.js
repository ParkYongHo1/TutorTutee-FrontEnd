import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  member: {
    memberNum: null,
    nickname: null,
    profileImg: null,
    introduction: null,
    hasNotice: false,
    loginType: null,
    noticeCount: 0,
    followCount: 0,
    followerCount: 10,
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
        hasNotice: null,
        loginType: null,
        noticeCount: null,
        followCount: null,
        followerCount: null,
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
      if (action.payload.noticeCount) {
        state.member.noticeCount = action.payload.noticeCount;
      }
      if (action.payload.followCount) {
        state.member.followCount = action.payload.followCount;
      }
      if (action.payload.followerCount) {
        state.member.followerCount = action.payload.followerCount;
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
