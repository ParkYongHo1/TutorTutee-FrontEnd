import { useState } from "react";
import { useForm } from "react-hook-form";
import { LazyLoadImage } from "react-lazy-load-image-component";
import axios from "axios";
import PasswordInput from "../components/signup/PasswordInput";
import IdInput from "../components/signup/IdInput";
import EmailInput from "../components/signup/EmailInput";
import { Link, useNavigate } from "react-router-dom";
import { memberSignUp } from "../services/userServices";

const SignUp = () => {
  const {
    register,
    watch,
    handleSubmit,
    trigger,
    formState: { errors, isValid, isSubmitting },
  } = useForm();
  const [isCodeMatch, setIsCodeMatch] = useState(false);
  const password = watch("password") || "";
  const confirmPassword = watch("confirmPassword") || "";
  const id = watch("memberId") || "";
  const isIdMatch = id.length >= 8 && /[a-zA-Z]/.test(id) && /\d/.test(id);
  const isPasswordsMatch =
    password && confirmPassword && password === confirmPassword;
  const [isNotIdAvailable, setIsNotIdAvailable] = useState(false);
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      await memberSignUp(data);
      alert("회원가입이 완료되었습니다.");
      navigate("/");
    } catch (error) {
      if (error.response.data.message === "이미 존재하는 아이디입니다.") {
        setIsNotIdAvailable(true);
      } else {
        alert("오류가 발생했습니다. 잠시후 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full max-w-[500px] mx-auto my-auto min-h-screen h-auto p-1">
      <Link to="/">
        <LazyLoadImage
          src={`${process.env.PUBLIC_URL}/image/default/logo.png`}
          alt="로고"
          className="max-w-full mb-[20px]"
          width={300}
        />
      </Link>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
        <IdInput
          register={register}
          id={id}
          isIdMatch={isIdMatch}
          isNotIdAvailable={isNotIdAvailable}
        />
        <EmailInput
          register={register}
          errors={errors}
          trigger={trigger}
          watch={watch}
          isCodeMatch={isCodeMatch}
          setIsCodeMatch={setIsCodeMatch}
        />
        <PasswordInput
          register={register}
          watch={watch}
          password={password}
          confirmPassword={confirmPassword}
          isPasswordsMatch={isPasswordsMatch}
        />
        <button
          type="submit"
          className={`h-[60px] px-[24px] py-[8px] text-bold w-full rounded-[4px] text-white text-[18px] border-none ${
            !isValid ||
            isSubmitting ||
            isCodeMatch === false ||
            !isPasswordsMatch
              ? "bg-gray--200 cursor-not-allowed"
              : "bg-blue--500"
          }`}
          disabled={
            !isValid ||
            isSubmitting ||
            isCodeMatch === false ||
            !isPasswordsMatch
          }
        >
          회원가입
        </button>
      </form>
    </div>
  );
};

export default SignUp;
