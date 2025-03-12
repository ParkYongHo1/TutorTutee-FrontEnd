import { LazyLoadImage } from "react-lazy-load-image-component";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { followClick, unFollow } from "../../services/profileServices";
import { logout } from "../../slices/memberSlice";
import { useState } from "react";

const SearchUserItem = ({ searchUser, memberNum, onFollow, onUnFollow }) => {
  const access = useSelector((state) => state.member.access);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [followerCount, setFollowerCount] = useState(searchUser.followerNum);

  const handleUnFollow = async () => {
    try {
      const isUnFollow = await unFollow(access, searchUser.memberNum);
      if (isUnFollow) {
        onUnFollow(searchUser.memberNum);
        setFollowerCount((prev) => Math.max(prev - 1, 0));
      }
    } catch (error) {
      if (error.response?.data?.message === "리프레시 토큰이 만료되었습니다.") {
        dispatch(logout());
        navigate("/");
      } else {
        alert("오류가 발생했습니다. 잠시후 다시 시도해주세요.");
      }
    }
  };

  const handleFollow = async () => {
    try {
      const isFollow = await followClick(access, searchUser.nickname);
      if (isFollow) {
        onFollow(searchUser);
        setFollowerCount((prev) => prev + 1);
      }
    } catch (error) {
      if (error.response?.data?.message === "리프레시 토큰이 만료되었습니다.") {
        dispatch(logout());
        navigate("/");
      } else {
        alert("오류가 발생했습니다. 잠시후 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="p-4 w-[250px] h-[260px] flex flex-col items-center justify-center border border-gray-200 rounded-xl shadow-md bg-white">
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

      <div className="text-center mt-3">
        <p className="text-lg font-bold">{searchUser.nickname}</p>
        <p className="text-sm mt-1 overflow-hidden line-clamp-1 text-gray-500">
          {searchUser.introduction || "한 줄 소개가 없습니다."}
        </p>
      </div>

      <div className="flex justify-center items-center mt-2 text-gray-500 text-xs space-x-2">
        <p>팔로워 {followerCount}명</p>
        <p>•</p>
        <p>팔로잉 {searchUser.followingNum || 0}명</p>
      </div>

      <div className="mt-3">
        {searchUser.followStatus ? (
          <button
            className="bg-white text-blue-500 font-bold w-[120px] h-[40px] rounded-md border"
            onClick={handleUnFollow}
          >
            팔로우 취소
          </button>
        ) : (
          <button
            className="bg-blue-500 text-white font-bold w-[120px] h-[40px] rounded-md"
            onClick={handleFollow}
          >
            팔로우
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchUserItem;
