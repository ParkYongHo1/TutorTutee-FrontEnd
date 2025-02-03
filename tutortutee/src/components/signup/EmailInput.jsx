import axios from "axios";
import { useState } from "react";
import EmailAuth from "./EmailAuth";
import { sendEmailVerification } from "../../services/userServices";
const EmailInput = ({
  register,
  errors,
  trigger,
  watch,
  isCodeMatch,
  setIsCodeMatch,
}) => {
  const email = watch("email");

  const [isVisibleInput, setIsVisibleInput] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState(false);
  const [isEditInput, setIsEditInput] = useState(false);
  const rEmail =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

  const handleEmailVerification = async () => {
    try {
      await sendEmailVerification(email);
      alert("해당 메일로 인증번호가 전송되었습니다.");
    } catch (error) {
      console.error(error);
    }
  };

  const handleButtonClick = () => {
    if (!isVisibleInput) {
      handleEmailVerification();
      setIsVisibleInput(true);
    } else {
      alert("해당 메일로 재전송되었습니다.");
      handleEmailVerification();
    }
  };

  const handleEditEmail = () => {
    setIsEditInput(false);
    setIsVisibleInput(false);
    setConfirmEmail(false);
    trigger("email");
  };

  return (
    <>
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
          className={`${
            isVisibleInput ? "bg-gray--100" : ""
          } px-4 border border-gray-200 rounded-[5px] h-[60px] mb-[12px] w-full ${
            !errors.email ? "" : "border-red--500"
          }`}
          disabled={isCodeMatch || isVisibleInput}
        />
        {isVisibleInput && !isCodeMatch && (
          <button
            type="button"
            className={`w-[100px] h-[60px] absolute right-[105px] top-0 px-[20px] text-sm font-bold text-white  
                  ${
                    errors.email
                      ? "bg-gray--200 cursor-not-allowed border border-red-500 border-l-0"
                      : !errors.email && email
                      ? "bg-blue--500 border border-blue-500 border-l-0"
                      : "border-none bg-gray--200 cursor-not-allowed"
                  }`}
            disabled={isCodeMatch}
            onClick={handleEditEmail}
          >
            다시입력
          </button>
        )}
        {!isCodeMatch && (
          <button
            type="button"
            className={`w-[100px] h-[60px] absolute right-0 top-0 px-[20px] text-sm font-bold text-white rounded-r-[4px] 
                  ${
                    errors.email
                      ? "bg-gray--200 cursor-not-allowed border border-red-500 border-l-0"
                      : !errors.email && email
                      ? "bg-blue--500 border border-blue-500 border-l-0"
                      : "border-none bg-gray--200 cursor-not-allowed"
                  }`}
            disabled={!email || !!errors.email || isCodeMatch}
            onClick={handleButtonClick}
          >
            {isVisibleInput ? "재전송" : "인증하기"}
          </button>
        )}
      </div>
      {errors.email && (
        <p className="text-red-500 text-sm text-start mb-[12px]">
          {errors.email.message}
        </p>
      )}
      {isVisibleInput && (
        <EmailAuth
          register={register}
          setIsCodeMatch={setIsCodeMatch}
          isCodeMatch={isCodeMatch}
          watch={watch}
          setConfirmEmail={setConfirmEmail}
        />
      )}
      <p
        className={`text-sm mb-[12px] text-start font-medium ${
          isCodeMatch ? "text-blue--500" : "text-red--500"
        }`}
      >
        {email && confirmEmail
          ? isCodeMatch
            ? "인증번호가 일치합니다."
            : "인증번호가 일치하지 않습니다. 다시 입력해주세요."
          : ""}
      </p>
    </>
  );
};

export default EmailInput;
