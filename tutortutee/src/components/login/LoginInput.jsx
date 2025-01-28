import { useState } from "react";
import { useForm } from "react-hook-form";
import { LazyLoadImage } from "react-lazy-load-image-component";

const LoginInput = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm();
  const password = watch("password");
  const onSubmit = (data) => {
    console.log(data);
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
          ? "일치하는 회원정보가 없습니다."
          : ""}
      </p>
      <button
        type="submit"
        className="p-2 bg-blue--500 text-white rounded-[5px] h-[50px] font-bold"
      >
        로그인
      </button>
    </form>
  );
};
export default LoginInput;
