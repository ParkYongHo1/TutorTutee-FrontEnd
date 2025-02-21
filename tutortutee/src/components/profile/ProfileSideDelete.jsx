import { deleteMember } from "../../services/userServices";
import { logout } from "../../slices/memberSlice";
import ConfirmModal from "../../components/modal/ConfirmModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const ProfileSideDelete = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const access = useSelector((state) => state.member.access);
  const handleDeleteMember = async () => {
    setModalOpen(true);
  };
  const handleConfirmDelete = async () => {
    setModalOpen(false);
    try {
      await deleteMember(access);
      alert("정상적으로 탈퇴되었습니다.");
      navigate("/");
      dispatch(logout());
    } catch (error) {
      alert("오류가 발생했습니다. 잠시후 다시 시도해주세요.");
    }
  };
  const handleCancelDelete = () => {
    setModalOpen(false);
  };
  return (
    <>
      <div className="min-h-[230px] text-end flex flex-col justify-end text-xs text-gray--500 hover:underline ">
        <p className="cursor-pointer" onClick={handleDeleteMember}>
          회원탈퇴
        </p>
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message="정말로 탈퇴하시겠습니까?"
      />
    </>
  );
};
export default ProfileSideDelete;
