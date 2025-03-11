import { LazyLoadImage } from "react-lazy-load-image-component";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const SearchUserItem = ({ searchUser, memberNum }) => {
  const access = useSelector((state) => state.member.access);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userNum = useSelector((state) => state.member.member.memberNum);
  const followCount = useSelector((state) => state.member.member.followCount);

  return (
    <div className="p-4 w-[250px] h-[260px] flex flex-col items-center justify-center border border-gray-200 rounded-xl shadow-md bg-white">
      {/* 프로필 이미지 */}
      <Link
        to={`/profile/${searchUser.memberNum}`}
        className="flex items-center cursor-pointer"
      >
        <div className="w-[80px] h-[80px] rounded-full border-2 border-white overflow-hidden">
          <LazyLoadImage
            src={
              searchUser.profileImg ||
              `${process.env.PUBLIC_URL}/image/default/profile.svg`
            }
            alt="프로필"
            className="w-full h-full object-cover"
          />
        </div>
      </Link>

      {/* 닉네임 & 소개 */}
      <div className="text-center mt-3">
        <p className="text-lg font-bold">{searchUser.nickname}</p>
        <p className="text-sm mt-1 overflow-hidden line-clamp-1 text-gray-500">
          {searchUser.introduction || "한 줄 소개가 없습니다."}
        </p>
      </div>

      {/* 팔로워 정보 */}
      <div className="flex justify-center items-center mt-2 text-gray-500 text-xs space-x-2">
        <p>팔로워 {searchUser.followerNum || 0}명</p>
        <p>•</p>
        <p>팔로잉 {searchUser.followingNum || 0}명</p>
      </div>

      {/* 팔로우 버튼 */}
      <button
        className="mt-3 w-[120px] h-[40px] bg-blue-500 text-white font-bold rounded-[5px] border border-blue-600 hover:bg-blue-600 transition"
        onClick={(e) => {
          e.stopPropagation();
          alert("팔로우 기능 실행!");
        }}
      >
        팔로우
      </button>
    </div>
  );
};

export default SearchUserItem;
