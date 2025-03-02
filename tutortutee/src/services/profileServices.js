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
export const followingList = async (access, memberNum, observer) => {
  return await axios.get(
    `${BASE_URL}/profile/followingList?memberNum=${memberNum}&observer=${observer}`,
    {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    }
  );
};
export const followClick = async (access, followerNickName) => {
  await axios.post(
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
  alert("해당 유저를 팔로우 했습니다.");
  return true;
};
export const unFollow = async (access, followMemberNum) => {
  await axios.delete(
    `${BASE_URL}/profile/unFollow?followMemberNum=${followMemberNum}`,
    {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    }
  );
  alert("해당 유저의 팔로우를 취소했습니다.");
  return true;
};
export const followerDelete = async (access, followerMemberNum) => {
  await axios.delete(
    `${BASE_URL}/profile/deleteFollow?followMemberNum=${followerMemberNum}`,
    {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    }
  );
  alert("해당 유저를 팔로워 리스트에서 삭제 했습니다.");
  return true;
};

export const changeIntroduction = async (access, introduction) => {
  await axios.patch(
    `${BASE_URL}/profile/introduction`,
    {
      introduction: introduction,
    },
    {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    }
  );
  alert("변경되었습니다.");
  return true;
};
export const changeNickname = async (access, nickname) => {
  await axios.patch(
    `${BASE_URL}/profile/nickname`,
    {
      nickname: nickname,
    },
    {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    }
  );
  alert("변경되었습니다.");
  return true;
};

export const writeNotice = async (access, noticeContent) => {
  await axios.post(
    `${BASE_URL}/profile/writeNotice`,
    {
      noticeContent: noticeContent,
    },
    {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    }
  );
  alert("게시글이 등록되었습니다.");
  return true;
};

export const loadNoticeList = async (memberNum, observer) => {
  return await axios.get(
    `${BASE_URL}/profile/notice?memberNum=${memberNum}&observer=${observer}`
  );
};

export const noticeDelete = async (access, noticeNum) => {
  await axios.delete(
    `${BASE_URL}/profile/deleteNotice?noticeNum=${noticeNum}`,
    {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    }
  );
  alert("해당 공지글을 삭제했습니다.");
  return true;
};

export const lastNotice = async (access, observer) => {
  return await axios.get(
    `${BASE_URL}/profile/lastNotice?observer=${observer}`,
    {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    }
  );
};
