import { LazyLoadImage } from "react-lazy-load-image-component";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  followClick,
  followerDelete,
  followerList,
} from "../../services/profileServices";
import { logout } from "../../slices/memberSlice";
import { useState } from "react";

const FollowerItem = ({ follower, followerMemberNum }) => {
  console.log(followerMemberNum);
  const [follow, setFollow] = useState(false);
  const access = useSelector((state) => state.member.access);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userNum = useSelector((state) => state.member.member.memberNum);
  const [update, setUpdate] = useState(false);
  const handleFollow = async () => {
    try {
      await followClick(access, follower.followNickname);

      alert("해당 유저를 팔로우 했습니다.");
      setFollow(true);
    } catch (error) {
      if (error.response?.data?.message === "리프레시 토큰이 만료되었습니다.") {
        dispatch(logout());
        navigate("/");
      } else {
        alert("오류가 발생했습니다. 잠시후 다시 시도해주세요.");
      }
    }
  };

  const handleFollowerDelete = async () => {
    try {
      await followerDelete(access, followerMemberNum);

      alert("해당 유저를 팔로워 리스트에서 삭제 했습니다.");
      await followerList(access, followerMemberNum, 0);
    } catch (error) {
      console.log(error);

      if (error.response?.data?.message === "리프레시 토큰이 만료되었습니다.") {
        dispatch(logout());
        navigate("/");
      } else {
        alert("오류가 발생했습니다. 잠시후 다시 시도해주세요.");
      }
    }
  };
  return (
    <div className="p-3 flex items-center justify-between mt-[12px] overflow-hidden">
      <Link
        to={`/profile/${follower.memberNum}`}
        className="flex items-center cursor-pointer"
      >
        <div className="w-[80px] h-[80px]">
          <LazyLoadImage
            src={
              follower.followProfileImg ||
              `${process.env.PUBLIC_URL}/image/default/profile.svg`
            }
            alt="프로필"
            className="w-full h-full object-cover fill border rounded-full"
            width={100}
            height={100}
          />
        </div>
        <div className="w-[200px] mx-[24px]">
          <p className="text-lg font-bold">{follower.followNickname}</p>
          <p className="text-sm mt-[8px]">{follower.introduction}</p>
        </div>
      </Link>

      <div className="flex gap-[16px]">
        {!follower.status && (
          <button
            onClick={handleFollow}
            className="bg-blue-500 text-white font-bold w-[120px] h-[40px] rounded-[5px]"
          >
            맞팔로우
          </button>
        )}
        {Number(followerMemberNum) === userNum && (
          <button
            onClick={handleFollowerDelete}
            className="border bg-white text-blue--500 font-bold w-[120px] h-[40px] rounded-[5px]"
          >
            팔로워 삭제
          </button>
        )}
      </div>
    </div>
  );
};

export default FollowerItem;
