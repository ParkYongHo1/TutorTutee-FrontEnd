import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginHandeler = (props) => {
  const navigate = useNavigate();
  const code = new URL(window.location.href).searchParams.get("code");

  //인가코드 백으로 보내는 코드
  useEffect(() => {
    const kakaoLogin = async () => {
      await axios.get(
        `${process.env.REACT_APP_BASE_URL}/oauth/kakao?code=${code}`
      );
      await axios({
        method: "GET",
        url: `${process.env.REACT_APP_REDIRECT_URL}/?code=${code}`,
        headers: {
          "Content-Type": "application/json;charset=utf-8", //json형태로 데이터를 보내겠다는뜻
          "Access-Control-Allow-Origin": "*", //이건 cors 에러때문에 넣어둔것. 당신의 프로젝트에 맞게 지워도됨
        },
      }).then((res) => {
        console.log(res);
        //계속 쓸 정보들( ex: 이름) 등은 localStorage에 저장해두자
        localStorage.setItem("name", res.data.account.kakaoName);
        //로그인이 성공하면 이동할 페이지
        navigate("/owner-question");
      });
    };
    kakaoLogin();
  }, [props.history]);
  return (
    <>
      <div></div>
    </>
  );
};
export default LoginHandeler;
