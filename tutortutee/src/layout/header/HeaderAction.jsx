import { LazyLoadImage } from "react-lazy-load-image-component";

const HeaderAction = () => {
  return (
    <>
      <div className="absolute w-[250px] z-20 border border-gray-300 bg-white shadow-lg text-start left-[-210px] top-[50px] rounded">
        <div className="flex items-center px-1 py-2 w-[90%] m-auto">
          <LazyLoadImage
            src={`${process.env.PUBLIC_URL}/image/default/profile.svg`}
            alt="프로필"
            className="max-w-full p-1 border rounded-full mr-2"
            width={40}
            height={40}
          />
          <div>
            <p className="text-xs text-black">박용호</p>
            <p className="text-xs text-gray--500">@qkaxhf8823</p>
          </div>
        </div>
        <div className="w-[90%] rounded-[5px] m-auto flex items-center py-1 px-2 hover:bg-gray--100">
          <LazyLoadImage
            src={`${process.env.PUBLIC_URL}/image/profile/editProfile.svg`}
            alt="프로필 수정"
            className="max-w-full p-1"
            width={30}
            height={30}
          />
          <p className="cursor-pointer  p-2 text-xs font-medium">프로필 수정</p>
        </div>
        <hr className="w-[90%] m-auto my-[12px]" />
        <div className="w-[90%] rounded-[5px] m-auto flex items-center py-1 object-contain px-2 hover:bg-gray--100">
          <LazyLoadImage
            src={`${process.env.PUBLIC_URL}/image/profile/mypage.svg`}
            alt="마이페이지 아이콘"
            className="max-w-full "
            width={24}
            height={24}
          />
          <p className="cursor-pointer p-2 text-xs font-medium">마이페이지</p>
        </div>
        <div className="w-[90%] rounded-[5px] m-auto flex items-center py-1 object-contain px-2 hover:bg-gray--100">
          <LazyLoadImage
            src={`${process.env.PUBLIC_URL}/image/profile/follower.svg`}
            alt="팔로워 아이콘"
            className=""
            width={24}
            height={24}
          />
          <p className="cursor-pointer  p-2 text-xs font-medium">팔로워 목록</p>
        </div>
        <div className="w-[90%] rounded-[5px] m-auto flex items-center py-1 object-contain px-2 hover:bg-gray--100">
          <LazyLoadImage
            src={`${process.env.PUBLIC_URL}/image/profile/follow.svg`}
            alt="팔로잉 아이콘"
            className=" "
            width={24}
            height={24}
          />
          <p className="cursor-pointer  p-2 text-xs font-medium">팔로잉 목록</p>
        </div>
        <hr className="w-[90%] m-auto my-[12px]" />
        <div className="w-[90%] rounded-[5px] m-auto flex items-center py-1 object-contain px-2 hover:bg-gray--100">
          <LazyLoadImage
            src={`${process.env.PUBLIC_URL}/image/profile/setting.svg`}
            alt="설정 아이콘"
            className=" "
            width={24}
            height={24}
          />
          <p className="cursor-pointer  p-2 text-xs font-medium">설정</p>
        </div>
        <div className="w-[90%] rounded-[5px] m-auto flex items-center py-1 object-contain px-2 hover:bg-gray--100 mb-[12px]">
          <LazyLoadImage
            src={`${process.env.PUBLIC_URL}/image/profile/logout.svg`}
            alt="로그아웃 아이콘"
            className=" "
            width={24}
            height={24}
          />
          <p className="cursor-pointer  p-2 text-xs font-medium">로그아웃</p>
        </div>
      </div>
    </>
  );
};
export default HeaderAction;
