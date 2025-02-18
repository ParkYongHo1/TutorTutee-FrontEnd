import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../slices/memberSlice";
import { useDispatch } from "react-redux";

const LoginHandeler = (props) => {
  const navigate = useNavigate();
  const code = new URL(window.location.href).searchParams.get("code");
  const dispatch = useDispatch();
  useEffect(() => {
    const kakaoLogin = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/oauth/kakao?code=${code}`
        );
        const memberInfo = {
          memberNum: response.data.memberNum,
          nickname: response.data.nickname,
          profileImg: response.data.profileImg,
          introduction: response.data.introduction,
          hasMore: response.data.hasMore,
          loginType: response.data.loginType,
        };
        dispatch(login({ member: memberInfo, access: response.data.access }));
        navigate("/");
      } catch (error) {
        if (error) {
          {
            alert("오류가 발생했습니다. 잠시후 다시 시도해주세요.");
          }
        }
      }
    };
    kakaoLogin();
  }, [props.history, code, dispatch, navigate]);
  return (
    <>
      <div></div>
    </>
  );
};
export default LoginHandeler;
