import axios from "axios";
import { useEffect } from "react";

const EmailAuth = ({
  register,
  setIsCodeMatch,
  isCodeMatch,
  watch,
  checkNum,
  setConfirmEmail,
}) => {
  const code = watch("emailCode") || "";

  const handleButtonClick = async () => {
    try {
      // const response = await axios.post(`/member/checkEmail?checkNum=${code}`);
      setConfirmEmail(true);
      const response = {
        data: {
          success: true,
        },
      };
      if (response.data.success) {
        setIsCodeMatch(true);
      } else {
        setIsCodeMatch(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log("isCodeMatch changed: ", isCodeMatch);
  }, [isCodeMatch]);
  console.log(isCodeMatch);

  return (
    <>
      <div className="flex relative w-full">
        <input
          type="text"
          maxLength={6}
          placeholder="인증번호를 입력해주세요."
          value={code}
          {...register("emailCode", {
            required: "인증번호를 입력해주세요.",
          })}
          disabled={isCodeMatch}
          className={`px-4 border border-gray-200 rounded-[5px] h-[60px] mb-[12px] w-full`}
        />
        <button
          type="button"
          className={`w-[100px] h-[60px] absolute right-0 top-0 px-[20px] text-sm font-bold text-white rounded-r-[4px] 
                  ${
                    code.length === 6
                      ? "bg-blue--500 border border-blue-500 border-l-0"
                      : "border-none bg-gray--200 cursor-not-allowed"
                  }`}
          disabled={code.length < 6 || isCodeMatch}
          onClick={handleButtonClick}
        >
          인증하기
        </button>
        <p>123</p>
      </div>
    </>
  );
};

export default EmailAuth;
