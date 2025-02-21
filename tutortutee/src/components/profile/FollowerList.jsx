import axios from "axios";
import { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useDispatch, useSelector } from "react-redux";
import NonFollowerList from "./NonFollowerLost";
import { followerList } from "../../services/profileServices";
import { logout } from "../../slices/memberSlice";
import { useNavigate } from "react-router-dom";
import FollowerItem from "./FollowerItem";

const FollowerList = ({ memberNum, member }) => {
  const access = useSelector((state) => state.member.access);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [observer, setObserver] = useState(0);
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    const loadFollowerList = async () => {
      try {
        const response = await followerList(access, memberNum, observer);
        setFollowers((prevFollowers) => [
          ...prevFollowers,
          ...response.data.followList,
        ]);
        console.log(response);
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
  }, [observer, access, memberNum, dispatch, navigate]);

  useEffect(() => {
    setFollowers([]);
    setObserver(0);
  }, [memberNum]);

  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollHeight - scrollTop <= clientHeight + 1) {
      if (
        observer === 0 ||
        (scrollHeight - scrollTop <= clientHeight + 1 && observer > 0)
      ) {
        setObserver((prevObserver) => prevObserver + 1);
      }
    }
  };

  return (
    <>
      <p className="text-sm font-bold mb-[12px]">검색</p>
      <div className="flex mb-[12px] items-center ">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="닉네임을 입력해주세요."
            className="w-full px-10 h-[30px] "
          />
          <LazyLoadImage
            src={`${process.env.PUBLIC_URL}/image/profile/search.svg`}
            alt="검색"
            className="max-w-full cursor-pointer absolute top-0 left-[0px]"
            width={30}
            height={30}
          />
        </div>
      </div>
      <hr />

      <>
        <div className="text-sm font-bold my-[24px]">팔로워</div>
        <hr className="my-[12px]" />
        <div
          className="flex flex-col items-center overflow-y-auto w-[700px] max-h-[600px] scrollable"
          onScroll={handleScroll}
        >
          {followers && followers.length > 0 ? (
            followers.map((follower, index) => (
              <div key={index} className="w-full">
                <FollowerItem follower={follower} followerMemberNum={memberNum} />
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
