import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  followerList,
  loadNoticeList,
} from "../../../services/profileServices";
import { logout } from "../../../slices/memberSlice";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PostItem from "./PostItem";

const PostList = ({ memberNum }) => {
  const access = useSelector((state) => state.member.access);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [observer, setObserver] = useState(0);
  const [notices, setNotices] = useState([]);
  const [flag, setFlag] = useState(false);
  useEffect(() => {
    const loadNotice = async () => {
      try {
        const response = await loadNoticeList(access, memberNum, observer);
        setFlag(response.data.flag);
        setNotices(response.data.notices);
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

    loadNotice();
  }, [observer, access, memberNum, dispatch, navigate]);
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
  const handleDelete = (noticeNum) => {
    setNotices((prevNotices) =>
      prevNotices.filter((notice) => notice.noticeNum !== noticeNum)
    );
  };
  return (
    <>
      <div className="scrollable pb-2 flex items-center max-h-[200px] w-full mb-[16px] overflow-x-auto gap-[24px]">
        <div className="flex gap-[24px] ">
          {Array(6)
            .fill()
            .map((_, index) => (
              <div key={index}>
                <div className="w-[100px] h-[100px]">
                  <LazyLoadImage
                    src={`${process.env.PUBLIC_URL}/image/default/profile.svg`}
                    alt="프로필"
                    className="max-w-full p-1 border rounded-full border-2 border-purple"
                    width={100}
                    height={100}
                  />
                </div>
                <p className="text-center text-xs mt-[4px]">닉네임</p>
              </div>
            ))}
        </div>
      </div>
      <hr className="mb-[24px]" />
      <div className="overflow-y-auto max-h-[600px] scrollable px-2">
        {notices.map((notice, index) => (
          <div
            key={index}
            className=" flex border w-[100%] m-auto rounded-[5px] p-3 mb-[12px]"
          >
            <PostItem notice={notice} onDelete={handleDelete}/>
          </div>
        ))}
      </div>
    </>
  );
};
export default PostList;
