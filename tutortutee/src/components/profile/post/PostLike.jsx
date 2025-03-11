import { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { disLikeNotice, likeNotice } from "../../../services/profileServices";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../slices/memberSlice";

const PostLike = ({ notice, onLikeClick, onDisLikeClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const access = useSelector((state) => state.member.access);

  const handleLikeClick = async () => {
    try {
      if (notice.disLikeStatus) {
        await disLikeNotice(access, notice.noticeNum);
        onDisLikeClick(notice.noticeNum);
      }

      await likeNotice(access, notice.noticeNum);
      onLikeClick(notice.noticeNum);
    } catch (error) {
      if (error.response?.data?.message === "리프레시 토큰이 만료되었습니다.") {
        dispatch(logout());
        navigate(`/`);
      } else {
        alert("오류가 발생했습니다. 잠시후 다시 시도해주세요.");
      }
    }
  };

  const handleDislikeClick = async () => {
    try {
      if (notice.likeStatus) {
        await likeNotice(access, notice.noticeNum);
        onLikeClick(notice.noticeNum);
      }
      await disLikeNotice(access, notice.noticeNum);
      onDisLikeClick(notice.noticeNum);
    } catch (error) {
      if (error.response?.data?.message === "리프레시 토큰이 만료되었습니다.") {
        dispatch(logout());
        navigate(`/`);
      } else {
        alert("오류가 발생했습니다. 잠시후 다시 시도해주세요.");
      }
    }
  };

  return (
    <>
      <div className="min-h-[30px] mt-[12px] flex gap-[12px] items-center">
        <div
          className="flex gap-[8px] cursor-pointer"
          onClick={handleLikeClick}
        >
          <LazyLoadImage
            src={`${
              notice.likeStatus
                ? `${process.env.PUBLIC_URL}/image/profile/checkLike.svg`
                : `${process.env.PUBLIC_URL}/image/profile/like.svg`
            }`}
            alt="좋아요"
            width={20}
            height={20}
          />
          <p className="text-sm">{notice.likeCount}</p>
        </div>
        <div
          className="flex gap-[8px] cursor-pointer"
          onClick={handleDislikeClick}
        >
          <LazyLoadImage
            src={`${
              notice.disLikeStatus
                ? `${process.env.PUBLIC_URL}/image/profile/checkDisLike.svg`
                : `${process.env.PUBLIC_URL}/image/profile/disLike.svg`
            }`}
            alt="싫어요"
            width={20}
            height={20}
          />
          <p className="text-sm">{notice.disLikeCount}</p>
        </div>
      </div>
    </>
  );
};

export default PostLike;
