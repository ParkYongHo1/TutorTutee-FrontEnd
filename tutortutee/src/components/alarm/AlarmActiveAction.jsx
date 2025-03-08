import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import ConfirmModal from "../modal/ConfirmModal";
import { useState } from "react";
import { setMemberInfoChange } from "../../slices/memberSlice";

const AlarmActiveAction = ({
  setActiveTab,
  activeTab,
  setIsDelete,
  setHasNotification,
}) => {
  const access = useSelector((state) => state.member.access);
  const [isModalOpen, setModalOpen] = useState(false);
  const dispatch = useDispatch();
  const handleAlarmDelete = async () => {
    setModalOpen(false);
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/alim/deleteAll`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      alert("정상적으로 삭제되었습니다.");
      setIsDelete(true);
      dispatch(setMemberInfoChange({ hasNotice: false }));
    } catch (error) {
      console.log(error);
    }
  };
  const handleCancelDelete = () => {
    setModalOpen(false);
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
            onClick={() => setActiveTab("chat")}
            className={`cursor-pointer ${
              activeTab === "chat" ? "text-black" : ""
            } hover:text-black`}
          >
            채팅
          </div>
          <div className="after:content-['|']"></div>
          <div
            onClick={() => setActiveTab("comment")}
            className={`cursor-pointer ${
              activeTab === "comment" ? "text-black" : ""
            } hover:text-black`}
          >
            댓글
          </div>
          <div className="after:content-['|']"></div>
          <div
            onClick={() => setActiveTab("reply")}
            className={`cursor-pointer ${
              activeTab === "reply" ? "text-black" : ""
            } hover:text-black`}
          >
            답글
          </div>
          <div className="after:content-['|']"></div>
          <div
            onClick={() => setActiveTab("commerce")}
            className={`cursor-pointer ${
              activeTab === "commerce" ? "text-black" : ""
            } hover:text-black`}
          >
            공동구매
          </div>
        </div>
        <div
          className="hover:underline hover:text-black text-gray--500 cursor-pointer"
          onClick={handleAlarmDelete}
        >
          전체삭제
        </div>
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={handleAlarmDelete}
        onCancel={handleCancelDelete}
        message="정말 삭제하시겠습니까? 삭제된 알림은 복구가 불가능합니다."
      />
    </>
  );
};
export default AlarmActiveAction;
