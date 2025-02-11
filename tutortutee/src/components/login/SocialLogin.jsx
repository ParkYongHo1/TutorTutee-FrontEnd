import { LazyLoadImage } from "react-lazy-load-image-component";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getNaverLogin } from "../../util/getNaverLogin";

const SocialLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleNaverLogin = () => {
    getNaverLogin(dispatch, navigate);
  };
  return (
    <>
      <h2 className="member-sns__title flex items-center font-bold w-full">
        &nbsp;SNS 계정으로 로그인&nbsp;
      </h2>
      <div className="flex mt-[24px] gap-[60px] items-center justify-center w-full">
        <button
          className="relative w-[60px] h-[60px]"
          onClick={() => handleNaverLogin()}
        >
          <LazyLoadImage
            className="cursor-pointer"
            src={`${process.env.PUBLIC_URL}/image/login/naver.png`}
            alt="네이버로 로그인"
            width={60}
            height={60}
          />
        </button>
        <button className="relative w-[60px] h-[60px]">
          <LazyLoadImage
            className="cursor-pointer"
            src={`${process.env.PUBLIC_URL}/image/login/kakao.png`}
            alt="카카오로 로그인"
            width={60}
            height={60}
          />
        </button>
      </div>
    </>
  );
};

export default SocialLogin;
