import { useState } from "react";
import { useForm } from "react-hook-form";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { memberLogin } from "../../services/userServices";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../slices/memberSlice";
const LoginInput = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm();
  const password = watch("password");
  const onSubmit = async (data) => {
    try {
      const response = await memberLogin(data);
      const memberInfo = {
        memberNum: response.data.memberNum,
        nickname: response.data.nickname,
        profileImg: response.data.profileImg,
        introduction: response.data.introduction,
        hasNotice: response.data.hasNotice,
        loginType: response.data.loginType,
        noticeCount: response.data.noticeCount,
        followCount: response.data.followCount,
        followerCount: response.data.followerCount,
      };
      dispatch(login({ member: memberInfo, access: response.data.access }));
      navigate("/");
    } catch (error) {
      if (
        error.response.data.message ===
        "아이디 또는 비밀번호가 일치하지 않습니다."
      ) {
        setIsUnauthorized(true);
      } else {
        alert("오류가 발생했습니다. 잠시후 다시 시도해주세요.");
      }
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
      <p className="text-start font-bold mb-[12px]">아이디</p>
      <input
        type="text"
        placeholder="아이디를 입력해주세요."
        {...register("memberId", { required: "아이디를 입력해주세요." })}
        className="px-4 border border-gray--100 rounded-[5px] h-[60px] mb-[24px]"
      />
      <p className="text-start font-bold mb-[12px]">비밀번호</p>
      <div className="flex relative w-full">
        <input
          type={isVisible ? "text" : "password"}
          placeholder="비밀번호를 입력해주세요."
          {...register("password", { required: "비밀번호를 입력하세요." })}
          className="px-4 border border-gray--100 rounded-[5px] h-[60px] w-full"
        />
        {password && (
          <LazyLoadImage
            className="absolute top-[50%] right-[24px] transform -translate-y-1/2 cursor-pointer"
            src={
              isVisible
                ? `${process.env.PUBLIC_URL}/image/login/eyeOpen.svg`
                : `${process.env.PUBLIC_URL}/image/login/eyeClosed.svg`
            }
            alt="eyes"
            onClick={() => setIsVisible((prev) => !prev)}
          />
        )}
      </div>
      <p
        className={`text-sm min-h-[20px] my-[12px] text-red--500 text-start font-medium`}
      >
        {isSubmitted && (errors.memberId || errors.password)
          ? "아이디/비밀번호를 입력해주세요"
          : isUnauthorized
          ? "아이디 또는 비밀번호가 일치하지 않습니다."
          : ""}
      </p>
      <button
        type="submit"
        className="p-2 bg-blue--500 text-white rounded-[5px] h-[60px] font-bold"
      >
        로그인
      </button>
    </form>
  );
};
export default LoginInput;
