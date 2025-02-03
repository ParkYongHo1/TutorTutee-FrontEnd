const FindTap = ({ handleTabChange, isTap }) => {
  return (
    <div className="flex text-center mb-[24px]">
      <div className="w-[250px]" onClick={() => handleTabChange("id")}>
        <p
          className={`${
            isTap === "id" ? "text-black" : "text-gray--500"
          } font-bold text-lg mb-[12px] cursor-pointer`}
        >
          아이디 찾기
        </p>
        <hr
          className={`w-full mb-[12px] h-[3px] ${
            isTap === "id" ? "bg-black" : "bg-gray--100"
          } `}
        />
      </div>
      <div className="w-[250px]" onClick={() => handleTabChange("password")}>
        <p
          className={`${
            isTap === "password" ? "text-black" : "text-gray--500"
          } font-bold text-lg mb-[12px] cursor-pointer`}
        >
          비밀번호 찾기
        </p>
        <hr
          className={`w-full mb-[12px] h-[3px] ${
            isTap === "password" ? "bg-black" : "bg-gray--100"
          } `}
        />
      </div>
    </div>
  );
};
export default FindTap;
