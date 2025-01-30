const IdInput = ({ register, id, isIdMatch, isNotIdAvailable }) => {
  return (
    <>
      <p className="text-start font-bold mb-[12px]">아이디</p>
      <input
        type="text"
        placeholder="아이디를 입력해주세요."
        {...register("memberId", {
          required: "아이디를 입력해주세요.",
          validate: {
            validLength: (value) =>
              value.length >= 8 || "아이디는 8글자 이상이어야 합니다.",
            hasAlphaNum: (value) =>
              (/[a-zA-Z]/.test(value) && /\d/.test(value)) ||
              "아이디는 영문자와 숫자를 포함해야 합니다.",
          },
        })}
        className={`${
          id === ""
            ? "border-gray-200"
            : !isIdMatch || isNotIdAvailable
            ? "border-red--500"
            : "border-blue--500"
        } px-4 border rounded-[5px] h-[60px] mb-[12px]`}
      />

      <p className="text-sm mb-[12px] text-start font-medium text-red--500">
        {!isIdMatch && id
          ? "영문자와 숫자를 포함하여 8글자 이상 입력해주세요."
          : isNotIdAvailable
          ? "이미 사용중인 아이디입니다."
          : ""}
      </p>
    </>
  );
};

export default IdInput;
