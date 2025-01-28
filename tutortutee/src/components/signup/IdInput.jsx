import { useState } from "react";

const IdInput = ({ register, id, isIdMatch }) => {
  console.log(id);

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
            : isIdMatch
            ? "border-blue--500"
            : "border-red--500"
        } px-4 border rounded-[5px] h-[60px] mb-[12px]`}
      />

      <p
        className={`text-sm mb-[12px] text-start font-medium ${
          !isIdMatch && id ? "text-red--500" : ""
        }`}
      >
        {!isIdMatch && id
          ? "영문자와 숫자를 포함하여 8글자 이상 입력해주세요."
          : ""}
      </p>
    </>
  );
};

export default IdInput;
