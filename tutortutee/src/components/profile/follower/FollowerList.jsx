import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NonFollowerList from "./NonFollowerLost";
import {
  followerList,
  followerDelete,
} from "../../../services/profileServices"; // followerDelete 추가
import { logout } from "../../../slices/memberSlice";
import { useNavigate } from "react-router-dom";
import FollowerItem from "./FollowerItem";
import SearchFollower from "./SearchFollower";

const FollowerList = ({ memberNum }) => {
  const access = useSelector((state) => state.member.access);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [observer, setObserver] = useState(0);
  const [followers, setFollowers] = useState([]);
  const [refreshList, setRefreshList] = useState(false);
  const [searchFollower, setSearchFollower] = useState([]);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    const loadFollowerList = async () => {
      try {
        const response = await followerList(access, memberNum, observer);
        setFlag(response.data.flag);

        setFollowers((prevFollowers) => [
          ...prevFollowers,
          ...response.data.followList,
        ]);
        setSearchFollower((prevFollowers) => [
          ...prevFollowers,
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
  }, [observer, access, memberNum, dispatch, navigate, refreshList]);

  useEffect(() => {
    if (refreshList) {
      setFollowers([]);
      setRefreshList(false);
    }
  }, [refreshList]);

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

  const handleDelete = (memberNum) => {
    setFollowers((prevFollowers) =>
      prevFollowers.filter((member) => member.memberNum !== memberNum)
    );
    setSearchFollower((prevFollowers) =>
      prevFollowers.filter((member) => member.memberNum !== memberNum)
    );
  };
  const handleFollow = (follower) => {
    setFollowers((prevFollowers) =>
      prevFollowers.map((member) =>
        member.memberNum === follower.memberNum
          ? { ...member, followStatus: true }
          : member
      )
    );
    setSearchFollower((prevFollowers) =>
      prevFollowers.map((member) =>
        member.memberNum === follower.memberNum
          ? { ...member, followStatus: true }
          : member
      )
    );
  };
  const handleUnFollow = (follower) => {
    setFollowers((prevFollowers) =>
      prevFollowers.map((member) =>
        member.memberNum === follower.memberNum
          ? { ...member, followStatus: false }
          : member
      )
    );
    setSearchFollower((prevFollowers) =>
      prevFollowers.map((member) =>
        member.memberNum === follower.memberNum
          ? { ...member, followStatus: false, status: false }
          : member
      )
    );
  };
  return (
    <>
      <p className="text-sm font-bold mb-[12px]">검색</p>
      <SearchFollower
        memberNum={memberNum}
        setSearchFollower={setSearchFollower}
      />
      <hr />

      <>
        <div className="text-sm font-bold my-[24px]">팔로워</div>
        <hr className="my-[12px]" />
        <div
          className="flex flex-col items-center overflow-y-auto w-[700px] max-h-[600px] scrollable"
          onScroll={handleScroll}
        >
          {searchFollower.length > 0 ? (
            searchFollower.map((follower, index) => (
              <div key={index} className="w-full">
                <FollowerItem
                  follower={follower}
                  memberNum={memberNum}
                  setRefreshList={setRefreshList}
                  onDelete={handleDelete}
                  onFollow={handleFollow}
                  onUnFollow={handleUnFollow}
                />
              </div>
            ))
          ) : searchFollower.length === 0 && flag ? (
            <NonFollowerList />
          ) : followers.length > 0 ? (
            followers.map((follower, index) => (
              <div key={index} className="w-full">
                <FollowerItem
                  follower={follower}
                  memberNum={memberNum}
                  setFollowers={setFollowers}
                  setRefreshList={setRefreshList}
                  onDelete={handleDelete}
                  onFollow={handleFollow}
                  onUnFollow={handleUnFollow}
                />
              </div>
            ))
          ) : (
            <NonFollowerList />
          )}
        </div>
      </>
    </>
  );
};

export default FollowerList;
