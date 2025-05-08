import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import LoginInput from "../components/login/LoginInput";
import SocialLogin from "../components/login/SocialLogin";

const Main = () => {
  return (
    <div className="flex flex-col justify-center items-center w-[500px] m-auto h-screen">
      <Link to="/">
        <LazyLoadImage
          src={`${process.env.PUBLIC_URL}/image/default/logo.png`}
          alt="로고"
          className="max-w-full mb-[50px]"
          width={300}
        />
      </Link>
      <LoginInput />
      <div className="flex justify-between items-center mt-[12px] mb-[32px] w-full">
        <Link to="/find" className="text-sm text-gray--500 hover:text-black">
          아이디/비밀번호 찾기
        </Link>
        <Link to="/signup" className="text-sm text-gray--500 hover:text-black">
          회원가입
        </Link>
      </div>
      <SocialLogin />
    </div>
  );
};

export default Main;
