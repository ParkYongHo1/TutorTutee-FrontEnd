import { useState } from "react";
import EmailInput from "../signup/EmailInput";
import FindSuccess from "./FindSuccess";
import axios from "axios";
import FindFail from "./FindFail";
import { findId } from "../../services/userServices";
const FindId = ({
  register,
  errors,
  trigger,
  watch,
  isCodeMatch,
  setIsCodeMatch,
  handleSubmit,
}) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const onSubmit = async (data) => {
    try {
      await findId(data.email);
      setIsSuccess(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      if (errorMessage === "해당하는 유저가 없습니다.") {
        setIsError(true);
      }
    }
  };
  if (isSuccess) {
    return <FindSuccess />;
  }

  if (isError) {
    return <FindFail />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
      <p className="font-bold text-2xl mb-[30px]">
        이메일을 입력하신 후 아이디 찾기를 진행해주세요
      </p>
      <EmailInput
        register={register}
        errors={errors}
        trigger={trigger}
        watch={watch}
        isCodeMatch={isCodeMatch}
        setIsCodeMatch={setIsCodeMatch}
      />
      <button
        type="submit"
        className={`${
          isCodeMatch ? "bg-black " : "bg-gray--200 cursor-not-allowed"
        } p-2 text-white rounded-[5px] h-[60px] font-bold`}
        disabled={!isCodeMatch}
      >
        아이디 찾기
      </button>
    </form>
  );
};

export default FindId;
