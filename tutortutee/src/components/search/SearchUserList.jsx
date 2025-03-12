import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { searchList } from "../../services/profileServices";
import { followingList } from "../../services/profileServices";
import { logout } from "../../slices/memberSlice";
import SearchUser from "./SearchUser";
import SearchUserItem from "./SearchUserItem";
import NonSearchList from "./NonSearchList";

const SearchUserList = () => {
  const access = useSelector((state) => state.member.access);
  const memberNum = useSelector((state) => state.member.member.memberNum);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchUser, setSearchUser] = useState([]);
  const [searchNickname, setSearchNickname] = useState("");

  const [observer, setObserver] = useState(0);
  const [followings, setFollowings] = useState([]);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    if (searchNickname.trim() === "") {
      setSearchUser([]);
      return;
    }

    const loadSearchUserList = async () => {
      try {
        const response = await searchList(access, searchNickname);
        setSearchUser(response.data.memberList);
      } catch (error) {
        if (
          error.response?.data?.message === "리프레시 토큰이 만료되었습니다."
        ) {
          dispatch(logout());
          navigate("/");
        } else {
          alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
      }
    };

    loadSearchUserList();
  }, [searchNickname, access, navigate, dispatch]);

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
  }, [observer, access, memberNum, dispatch, navigate, setFollowings]);

  const updatedSearchUserList = searchUser.map((user) => ({
    ...user,
    followStatus: followings.some(
      (following) => following.memberNum === user.memberNum
    ),
  }));

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

  const handleFollow = (follower) => {
    setFollowings((prevFollowings) => [
      ...prevFollowings,
      { ...follower, followStatus: true },
    ]);
  };

  const handleUnFollow = (memberNum) => {
    setFollowings((prevFollowings) =>
      prevFollowings.filter((member) => member.memberNum !== memberNum)
    );
  };

  return (
    <>
      <SearchUser setSearchNickname={setSearchNickname} />
      <div
        className="mx-auto w-[1020px] min-h-[80vh] mb-[30px] 
        grid grid-cols-3 gap-10 py-[50px] px-10 overflow-y-auto scrollable
        border border-gray-200 rounded-md shadow-md"
        onScroll={handleScroll}
      >
        {searchUser.length === 0 ? (
          <div className="col-span-3 flex items-center justify-center h-full">
            <NonSearchList searchNickname={searchNickname} />
          </div>
        ) : (
          updatedSearchUserList.map((user, index) => (
            <div key={index} className="flex justify-center">
              <SearchUserItem
                searchUser={user}
                memberNum={memberNum}
                onUnFollow={handleUnFollow}
                onFollow={handleFollow}
                followings={followings}
              />
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default SearchUserList;
