import { useNavigate } from "react-router-dom";
import IdInput from "../signup/IdInput";
import { useState } from "react";
import FindFail from "./FindFail";
import { findPassword } from "../../services/userServices";

const FindPassword = ({ register, id, isIdMatch, handleSubmit }) => {
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const onSubmit = async (data) => {
    try {
      await findPassword(data.memberId);
      navigate("/reset");
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      if (errorMessage === "해당하는 유저가 없습니다.") {
        setIsError(true);
      }
    }
  };
  if (isError) {
    return <FindFail />;
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
      <p className="font-bold text-2xl mb-[30px]">
        아이디를 입력하신 후 아이디 찾기를 진행해주세요
      </p>
      <IdInput register={register} id={id} isIdMatch={isIdMatch} />
      <button
        type="submit"
        className={`${
          isIdMatch ? "bg-black " : "bg-gray--200 cursor-not-allowed"
        } p-2  text-white rounded-[5px] h-[60px] font-bold`}
        disabled={!isIdMatch}
      >
        비밀번호 찾기
      </button>
    </form>
  );
};

export default FindPassword;
