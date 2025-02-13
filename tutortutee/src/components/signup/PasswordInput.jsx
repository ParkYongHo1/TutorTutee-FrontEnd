import { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PasswordVaild from "./PasswordVaild";

const PasswordInput = ({
  register,
  password,
  confirmPassword,
  isPasswordsMatch,
  reset,
  newPassword,
  isNewPasswordsMatch,
  setIsVaildPassword,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const isPasswordValid1 = password.length >= 8;
  const isPasswordValid2 = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const isPasswordValid3 = /[!*@&#^.]/.test(password);

  const isNewPasswordValid1 = newPassword?.length >= 8;
  const isNewPasswordValid2 =
    /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword);
  const isNewPasswordValid3 = /[!*@&#^.]/.test(newPassword);
  if (
    isNewPasswordValid1 &&
    isNewPasswordValid2 &&
    isNewPasswordValid3 &&
    isNewPasswordsMatch &&
    isPasswordValid1 &&
    isPasswordValid2 &&
    isPasswordValid3
  ) {
    setIsVaildPassword(true);
  }
  return (
    <>
      {reset ? (
        <>
          <p className="text-start font-bold mb-[12px]"> 기존 비밀번호</p>
          <div className="flex relative w-full mb-[24px]">
            <input
              type={isVisible ? "text" : "password"}
              placeholder="비밀번호를 입력해주세요."
              value={password}
              {...register("password", {
                required: "기존 비밀번호를 입력하세요.",
              })}
              className={`${
                password === ""
                  ? "border-gray--200"
                  : isPasswordValid1 && isPasswordValid2 && isPasswordValid3
                  ? "border-blue--500"
                  : "border-red--500"
              } px-4 border rounded-[5px] h-[60px] w-full`}
            />
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
          </div>
        </>
      ) : (
        ""
      )}
      <p className="text-start font-bold mb-[12px]">
        {reset ? "새로운 비밀번호" : "비밀번호"}
      </p>
      <div className="flex relative w-full">
        <input
          type={isVisible ? "text" : "password"}
          placeholder="비밀번호를 입력해주세요."
          value={reset ? newPassword : password}
          {...register(reset ? "newPassword" : "password", {
            required: "비밀번호를 입력하세요.",
          })}
          className={`${
            reset
              ? newPassword === ""
                ? "border-gray--200"
                : isNewPasswordValid1 &&
                  isNewPasswordValid2 &&
                  isNewPasswordValid3
                ? "border-blue--500"
                : "border-red--500"
              : password === ""
              ? "border-gray--200"
              : isPasswordValid1 && isPasswordValid2 && isPasswordValid3
              ? "border-blue--500"
              : "border-red--500"
          } px-4 border rounded-[5px] h-[60px] w-full`}
        />

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
      </div>
      <PasswordVaild
        isPasswordValid1={reset ? isNewPasswordValid1 : isPasswordValid1}
        isPasswordValid2={reset ? isNewPasswordValid2 : isPasswordValid2}
        isPasswordValid3={reset ? isNewPasswordValid3 : isPasswordValid3}
      />
      <p className="text-start font-bold mb-[12px]">
        {reset ? "새로운 비밀번호 확인" : "비밀번호 확인"}
      </p>
      <div className="flex relative w-full">
        <input
          type={isConfirmVisible ? "text" : "password"}
          placeholder="비밀번호를 한번 더 입력해주세요."
          value={confirmPassword}
          {...register("confirmPassword", {
            required: "비밀번호를 확인해주세요.",
          })}
          className={`${
            confirmPassword === ""
              ? "border-gray--200"
              : reset
              ? isNewPasswordsMatch
                ? "border-blue--500"
                : "border-red--500"
              : isPasswordsMatch
              ? "border-blue--500"
              : "border-red--500"
          } px-4 border rounded-[5px] h-[60px] w-full`}
        />
        <LazyLoadImage
          className="absolute top-[50%] right-[24px] transform -translate-y-1/2 cursor-pointer"
          src={
            isConfirmVisible
              ? `${process.env.PUBLIC_URL}/image/login/eyeOpen.svg`
              : `${process.env.PUBLIC_URL}/image/login/eyeClosed.svg`
          }
          alt="eyes"
          onClick={() => setIsConfirmVisible((prev) => !prev)}
        />
      </div>
      <div className="mt-[12px]">
        <div className="flex gap-[12px] items-center mb-[8px]">
          <LazyLoadImage
            src={
              reset
                ? isNewPasswordsMatch
                  ? `${process.env.PUBLIC_URL}/image/signup/success.svg`
                  : `${process.env.PUBLIC_URL}/image/signup/fail.svg`
                : isPasswordsMatch
                ? `${process.env.PUBLIC_URL}/image/signup/success.svg`
                : `${process.env.PUBLIC_URL}/image/signup/fail.svg`
            }
          />
          <p
            className={`text-gray--500 text-sm font-bold ${
              confirmPassword === ""
                ? ""
                : reset
                ? isNewPasswordsMatch
                  ? "text-green-500"
                  : "text-red-500"
                : isPasswordsMatch
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {reset
              ? !newPassword && !confirmPassword
                ? "비밀번호를 입력해주세요"
                : isNewPasswordsMatch
                ? "비밀번호가 일치합니다."
                : "비밀번호가 일치하지 않습니다."
              : !password && !confirmPassword
              ? "비밀번호를 입력해주세요"
              : isPasswordsMatch
              ? "비밀번호가 일치합니다."
              : "비밀번호가 일치하지 않습니다."}
          </p>
        </div>
      </div>
    </>
  );
};

export default PasswordInput;
