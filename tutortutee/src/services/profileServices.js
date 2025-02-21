import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const profileInfo = async (access, memberNum) => {
  return await axios.get(
    `${BASE_URL}/profile/profileInfo?memberNum=${memberNum}`,
    {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    }
  );
};

export const followerList = async (access, memberNum, observer) => {
  return await axios.get(
    `${BASE_URL}/profile/followerList?memberNum=${memberNum}&observer=${observer}`,
    {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    }
  );
};

export const followClick = async (access, followerNickName) => {
  return await axios.post(
    `${BASE_URL}/profile/followClick`,
    {
      followerNickName: followerNickName,
    },
    {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    }
  );
};

export const followerDelete = async (access, followerMemberNum) => {
  return await axios.delete(
    `${BASE_URL}/profile/deleteFollow`,
    {
      followMemberNum: followerMemberNum,
    },
    {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    }
  );
};
