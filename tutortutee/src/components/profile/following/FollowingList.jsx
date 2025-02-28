import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { followingList } from "../../../services/profileServices";
import { logout } from "../../../slices/memberSlice";
import { useNavigate } from "react-router-dom";
import SearchFollowing from "./SearchFollowing";
import FollowingItem from "./FollowingItem";
import NonFollowList from "../NonFollowList";

const FollowingList = ({ memberNum }) => {
  const access = useSelector((state) => state.member.access);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [observer, setObserver] = useState(0);
  const [followings, setFollowings] = useState([]);
  const [searchFollowing, setSearchFollowing] = useState([]);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    const loadFollowerList = async () => {
      try {
        const response = await followingList(access, memberNum, observer);
        setFlag(response.data.flag);

        setFollowings((prevFollowings) => [
          ...prevFollowings,
          ...response.data.followList,
        ]);
      } catch (error) {
        if (
          error.response?.data?.message === "리프레시 토큰이 만료되었습니다."
        ) {
          dispatch(logout());
          navigate("/");
        } else {
          alert("오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        }
      }
    };

    loadFollowerList();
  }, [
    observer,
    access,
    memberNum,
    dispatch,
    navigate,
    setSearchFollowing,
    setFollowings,
  ]);

  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollHeight - scrollTop <= clientHeight + 1) {
      if (
        !flag &&
        (observer === 0 ||
          (scrollHeight - scrollTop <= clientHeight + 1 && observer > 0))
      ) {
        setObserver((prevObserver) => prevObserver + 1);
      }
    }
  };

  const handleUnFollow = (memberNum) => {
    setFollowings((prevFollowings) =>
      prevFollowings.filter((member) => member.memberNum !== memberNum)
    );
    setSearchFollowing((prevFollowings) =>
      prevFollowings.filter((member) => member.memberNum !== memberNum)
    );
  };
  const handleFollow = (follower) => {
    followings((prevFollowings) =>
      prevFollowings.map((member) =>
        member.memberNum === follower.memberNum
          ? { ...member, followStatus: true }
          : member
      )
    );
    setSearchFollowing((prevFollowings) =>
      prevFollowings.map((member) =>
        member.memberNum === follower.memberNum
          ? { ...member, followStatus: true }
          : member
      )
    );
  };
  return (
    <>
      <p className="text-sm font-bold mb-[12px]">검색</p>
      <SearchFollowing
        memberNum={memberNum}
        setSearchFollowing={setSearchFollowing}
        setFollowings={setFollowings}
      />
      <hr />
      <>
        <div className="text-sm font-bold my-[24px]">팔로잉</div>
        <hr className="my-[12px]" />
        <div
          className="flex flex-col items-center overflow-y-auto w-[700px] max-h-[600px] scrollable"
          onScroll={handleScroll}
        >
          {searchFollowing.length === 0 && followings.length === 0 ? (
            <NonFollowList />
          ) : searchFollowing.length > 0 ? (
            searchFollowing.map((follower, index) => (
              <div key={index} className="w-full">
                <FollowingItem
                  follower={follower}
                  memberNum={memberNum}
                  onUnFollow={handleUnFollow}
                  onFollow={handleFollow}
                />
              </div>
            ))
          ) : followings.length > 0 ? (
            followings.map((follower, index) => (
              <div key={index} className="w-full">
                <FollowingItem
                  follower={follower}
                  memberNum={memberNum}
                  setFollowings={setFollowings}
                  onUnFollow={handleUnFollow}
                  onFollow={handleFollow}
                />
              </div>
            ))
          ) : (
            <NonFollowList />
          )}
        </div>
      </>
    </>
  );
};
export default FollowingList;
