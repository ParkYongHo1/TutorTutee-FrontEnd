import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  followerList,
  lastNotice,
  loadNoticeList,
} from "../../../services/profileServices";
import { logout } from "../../../slices/memberSlice";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PostItem from "./PostItem";
import NonNoticeList from "./NonNoticeList";
import DOMPurify from "dompurify";
const PostList = ({ memberNum }) => {
  const access = useSelector((state) => state.member.access);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [observer, setObserver] = useState(0);
  const [widthObserver, setWidthObserver] = useState(0);
  const [notices, setNotices] = useState([]);
  const [followLastNotice, setfollowLastNotice] = useState([]);
  const [flag, setFlag] = useState(false);
  useEffect(() => {
    const loadNotice = async () => {
      try {
        const response = await loadNoticeList(access, memberNum, observer);
        setFlag(response?.data.flag);
        setNotices((prev) => [...prev, ...response.data.notices]);
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
  }, [observer, access, memberNum, dispatch, navigate, setNotices]);
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
  const handleLikeClick = (noticeNum) => {
    setNotices((prevNotices) =>
      prevNotices.map((notice) =>
        notice.noticeNum === noticeNum
          ? notice.likeStatus
            ? {
                ...notice,
                likeCount: notice.likeCount - 1,
                likeStatus: false,
              }
            : {
                ...notice,
                likeCount: notice.likeCount + 1,
                likeStatus: true,
              }
          : notice
      )
    );
  };
  const handleDisLikeClick = (noticeNum) => {
    setNotices((prevNotices) =>
      prevNotices.map((notice) =>
        notice.noticeNum === noticeNum
          ? notice.disLikeStatus
            ? {
                ...notice,
                disLikeCount: notice.disLikeCount - 1,
                disLikeStatus: false,
              }
            : {
                ...notice,
                disLikeCount: notice.disLikeCount + 1,
                disLikeStatus: true,
              }
          : notice
      )
    );
  };
  const handleWidthScroll = (event) => {
    const { scrollLeft, scrollWidth, clientWidth } = event.target;
    if (scrollWidth - scrollLeft <= clientWidth + 1) {
      if (
        !flag &&
        (widthObserver === 0 ||
          (scrollWidth - scrollLeft <= clientWidth + 1 && widthObserver > 0))
      ) {
        setWidthObserver((prevObserver) => prevObserver + 1);
      }
    }
  };
  useEffect(() => {
    const loadLastNotice = async () => {
      try {
        const response = await lastNotice(access, widthObserver);
        setFlag(response.data.flag);
        setfollowLastNotice((prev) => [...prev, ...response.data.followList]);
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
    loadLastNotice();
  }, [widthObserver, access, dispatch, navigate]);
  const sanitizeHtml = (str) => {
    const allowedTags = ["strong", "em", "b", "i", "u", "br"];
    return DOMPurify.sanitize(str, { ALLOWED_TAGS: allowedTags });
  };
  return (
    <>
      <div
        className="scrollable pb-2 flex items-center max-h-[200px] w-full mb-[16px] overflow-x-auto gap-[24px]"
        onScroll={handleWidthScroll}
      >
        <div className="flex gap-[24px] ">
          {followLastNotice.map((followNotice, index) => (
            <div key={index}>
              <div className="w-[100px] h-[100px]">
                <LazyLoadImage
                  src={
                    followNotice.followProfileImg ||
                    `${process.env.PUBLIC_URL}/image/default/profile.svg`
                  }
                  alt="프로필"
                  className="w-full h-full object-cover fill border rounded-full p-1 border-2 border-purple"
                  width={100}
                  height={100}
                />
              </div>
              <p className="text-center text-xs mt-[4px]">
                {followNotice.followNickName}
              </p>
            </div>
          ))}
        </div>
      </div>
      <hr className="mb-[24px]" />
      <div
        className="overflow-y-auto max-h-[600px] scrollable px-2"
        onScroll={handleScroll}
      >
        {notices.length > 0 ? (
          notices.map((notice, index) => (
            <div
              key={index}
              className=" flex border w-[100%] m-auto rounded-[5px] p-3 mb-[12px]"
            >
              <PostItem
                notice={{
                  ...notice,
                  noticeContent: sanitizeHtml(notice.noticeContent),
                }}
                setNotices={setNotices}
                onDelete={handleDelete}
                onLikeClick={handleLikeClick}
                onDisLikeClick={handleDisLikeClick}
              />
            </div>
          ))
        ) : (
          <NonNoticeList />
        )}
      </div>
    </>
  );
};
export default PostList;
