import { useForm } from "react-hook-form";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PasswordInput from "../components/signup/PasswordInput";

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { resetPassword } from "../services/userServices";

const ResetPassword = () => {
  const {
    register,
    watch,
    handleSubmit,
    trigger,
    formState: { errors, isValid, isSubmitting },
  } = useForm();
  const password = watch("password") || "";
  const confirmPassword = watch("confirmPassword") || "";
  const newPassword = watch("newPassword") || "";
  const memberId = watch("memberId") || "";
  const isNewPasswordsMatch =
    newPassword && confirmPassword && newPassword === confirmPassword;
  const [isValidPassword, setIsVaildPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      await resetPassword(data);
      alert("비밀번호가 재설정되었습니다.");
    } catch (error) {
      if (error.response.daa.message === "해당하는 유저가 없습니다.") {
        alert("해당하는 유저가 없습니다.");
      } else if (error.response.daa.message === "기존 비밀번호와 동일합니다.") {
        alert("기존 비밀번호와 동일합니다.");
      } else {
        alert("오류가 발생했습니다. 잠시후 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full max-w-[500px] mx-auto my-auto mt-[3%] p-1">
      <Link to="/">
        <LazyLoadImage
          src={`${process.env.PUBLIC_URL}/image/default/logo.png`}
          alt="로고"
          className="max-w-full mb-[20px]"
          width={300}
        />
      </Link>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
        <p className="text-start font-bold mb-[12px]">아이디</p>
        <input
          type="text"
          placeholder="아이디를 입력해주세요."
          {...register("memberId", { required: "아이디를 입력해주세요." })}
          className="px-4 border border-gray--100 rounded-[5px] h-[60px] mb-[24px]"
        />
        <PasswordInput
          register={register}
          watch={watch}
          password={password}
          confirmPassword={confirmPassword}
          reset={true}
          newPassword={newPassword}
          isNewPasswordsMatch={isNewPasswordsMatch}
          setIsVaildPassword={setIsVaildPassword}
        />
        <button
          type="submit"
          className={`h-[60px] px-[24px] py-[8px] text-bold w-full rounded-[4px] text-white text-[18px] border-none ${
            !isValidPassword || !memberId
              ? "bg-gray--200 cursor-not-allowed"
              : "bg-black"
          }`}
          disabled={!isValidPassword || !memberId}
        >
          비밀번호 찾기
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
