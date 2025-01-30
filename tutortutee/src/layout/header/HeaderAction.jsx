const HeaderAction = () => {
  return (
    <>
      <div className="absolute w-[120px] border border-gray-300 bg-white shadow-lg text-start left-[-35px] top-[60px] rounded">
        <p className="cursor-pointer hover:bg-gray--100 p-2 text-xs font-medium">
          마이페이지
        </p>
        <p className="cursor-pointer hover:bg-gray--100 p-2 text-xs font-medium">
          회원탈퇴
        </p>
        <p className="cursor-pointer hover:bg-gray--100 p-2 text-xs font-medium">
          로그아웃
        </p>
      </div>
    </>
  );
};
export default HeaderAction;
