import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import ConfirmModal from "../modal/ConfirmModal";
import { useState } from "react";
import { logout, setMemberInfoChange } from "../../slices/memberSlice";
import { useNavigate } from "react-router-dom";
import { alarmDeleteAll } from "../../services/alarmServices";

const AlarmActiveAction = ({ setActiveTab, activeTab, onDeleteAll }) => {
  const navigate = useNavigate();
  const access = useSelector((state) => state.member.access);
  const dispatch = useDispatch();
  const handleAlarmDelete = async () => {
    try {
      await alarmDeleteAll(access);
      onDeleteAll();
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
    <>
      <div className="flex items-center justify-between text-xs py-4 w-[380px] m-auto">
        <div className="flex justify-between gap-[10px] text-gray--500">
          <div
            onClick={() => setActiveTab("전체")}
            className={`cursor-pointer ${
              activeTab === "전체" ? "text-black" : ""
            } hover:text-black`}
          >
            전체
          </div>

          <div className="after:content-['|']"></div>
          <div
            onClick={() => setActiveTab("TYPE_FOLLOW")}
            className={`cursor-pointer ${
              activeTab === "TYPE_FOLLOW" ? "text-black" : ""
            } hover:text-black`}
          >
            팔로우
          </div>
          <div className="after:content-['|']"></div>
          <div
            onClick={() => setActiveTab("TYPE_LECTURE")}
            className={`cursor-pointer ${
              activeTab === "TYPE_LECTURE" ? "text-black" : ""
            } hover:text-black`}
          >
            LIVE
          </div>
          <div className="after:content-['|']"></div>
          <div
            onClick={() => setActiveTab("TYPE_LIKE")}
            className={`cursor-pointer ${
              activeTab === "TYPE_LIKE" ? "text-black" : ""
            } hover:text-black`}
          >
            좋아요
          </div>
          <div className="after:content-['|']"></div>
          <div
            onClick={() => setActiveTab("TYPE_DISLIKE")}
            className={`cursor-pointer ${
              activeTab === "TYPE_DISLIKE" ? "text-black" : ""
            } hover:text-black`}
          >
            싫어요
          </div>
          <div className="after:content-['|']"></div>
          <div
            onClick={() => setActiveTab("TYPE_NOTICE")}
            className={`cursor-pointer ${
              activeTab === "TYPE_NOTICE" ? "text-black" : ""
            } hover:text-black`}
          >
            공지
          </div>
        </div>
        <div
          className="hover:underline hover:text-black text-gray--500 cursor-pointer"
          onClick={handleAlarmDelete}
        >
          전체삭제
        </div>
      </div>
    </>
  );
};
export default AlarmActiveAction;
