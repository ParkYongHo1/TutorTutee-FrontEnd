import axios from "axios";
import { login } from "../slices/memberSlice";

export const getNaverLogin = (dispatch, navigate) => {
  const popup = window.open(
    `https://tutor-tutee.shop/oauth2/authorization`,
    "_blank",
    "width=600,height=600"
  );

  const interval = setInterval(() => {
    try {
      const url = popup.location.href;
      if (url.includes("code") && url.includes("state")) {
        clearInterval(interval);

        const params = new URLSearchParams(url.split("?")[1]);
        const code = params.get("code");
        const state = params.get("state");

        axios
          .post(`${process.env.REACT_APP_BASE_URL}/oauth/naver`, {
            code: code,
            state: state,
          })
          .then((response) => {
            popup.close();
            const memberInfo = {
              memberNum: response.data.memberNum,
              nickname: response.data.nickname,
              profileImg: response.data.profileImg,
              introduction: response.data.introduction,
              hasAlim: response.data.hasAlim,
              loginType: response.data.loginType,
              noticeCount: response.data.noticeCount,
              followCount: response.data.followCount,
              followerCount: response.data.followerCount,
            };
            dispatch(
              login({ member: memberInfo, access: response.data.access })
            );
            navigate("/");
          })
          .catch((error) => {
            if (error) {
              alert("오류가 발생했습니다. 잠시후 다시 시도해주세요.");
            }
          });
      }
    } catch (e) {
      clearInterval(interval);
    }
  }, 1000);
};
