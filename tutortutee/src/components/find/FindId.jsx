import { useState } from "react";
import EmailInput from "../signup/EmailInput";
import FindSuccess from "./FindSuccess";
import axios from "axios";
import FindFail from "./FindFail";
import { findId } from "../../services/userServices";
const FindId = ({ register, errors, trigger, watch, handleSubmit }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [findmemberId, setFindmemberId] = useState("");
  const rEmail =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
  const email = watch("email");
  const onSubmit = async (data) => {
    try {
      const response = await findId(data.email);
      console.log(response);

      setFindmemberId(response.data.memberId);
      setIsSuccess(true);
    } catch (error) {
      console.log(error);

      const errorMessage = error.response?.data?.message;
      if (errorMessage === "해당하는 유저가 없습니다.") {
        setIsError(true);
      }
    }
  };
  if (isSuccess) {
    return <FindSuccess findmemberId={findmemberId} />;
  }
  if (isError) {
    return <FindFail />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
      <p className="font-bold text-2xl mb-[30px]">
        이메일을 입력하신 후 아이디 찾기를 진행해주세요
      </p>
      <p className="text-start font-bold mb-[12px]">이메일</p>
      <div className="flex relative w-full">
        <input
          type="text"
          placeholder="이메일주소를 입력해주세요."
          {...register("email", {
            pattern: {
              value: rEmail,
              message: "올바른 이메일 형식을 입력해주세요",
            },
            required: "이메일을 입력해주세요.",
            onChange: async (e) => {
              trigger("email");
            },
          })}
          className={`px-4 border border-gray-200 rounded-[5px] h-[60px] mb-[24px] w-full ${
            !errors.email ? "" : "border-red--500"
          }`}
        />
      </div>
      {errors.email && (
        <p className="text-red-500 text-sm text-start mb-[12px]">
          {errors.email.message}
        </p>
      )}
      <button
        type="submit"
        className={` text-white p-2 rounded-[5px] h-[60px] font-bold ${
          errors.email
            ? "bg-gray--200 cursor-not-allowed"
            : !errors.email && email
            ? "bg-black"
            : "bg-gray--200 cursor-not-allowed"
        }`}
        disabled={errors.email}
      >
        아이디 찾기
      </button>
    </form>
  );
};

export default FindId;
