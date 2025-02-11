import axios from "axios";

const EmailAuth = ({
  register,
  setIsCodeMatch,
  isCodeMatch,
  watch,
  setConfirmEmail,
}) => {
  const code = watch("emailCode") || "";

  const handleButtonClick = async () => {
    try {
      await axios.get(
        `${process.env.REACT_APP_BASE_URL}/member/checkEmail?checkNum=${code}`
      );
      setConfirmEmail(true);
      setIsCodeMatch(true);
    } catch (error) {
      if (error.response.data.message === "인증번호가 다릅니다.") {
        setConfirmEmail(true);
        setIsCodeMatch(false);
      }
    }
  };

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
        {!isCodeMatch && (
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
        )}
      </div>
    </>
  );
};

export default EmailAuth;
