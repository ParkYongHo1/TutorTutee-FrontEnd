import { LazyLoadImage } from "react-lazy-load-image-component";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../slices/memberSlice";
import { useNavigate } from "react-router-dom";
import { noticeDelete } from "../../../services/profileServices";

const ProfileAction = ({ noticeNum, onDelete }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const access = useSelector((state) => state.member.access);
  const handleNoticeDelete = async () => {
    try {
      const isDeleted = await noticeDelete(access, noticeNum);
      if (isDeleted) {
        onDelete(noticeNum);
      }
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
      <div className="absolute w-[150px] z-10 border border-gray-300 bg-white shadow-lg text-start right-[0px] top-[25px] rounded">
        <div className="w-[90%] rounded-[5px] m-auto flex items-center py-1 object-contain px-2 hover:bg-gray--100 my-[12px]">
          <LazyLoadImage
            src={`${process.env.PUBLIC_URL}/image/profile/deletePost.svg`}
            alt="게시글 삭제"
            width={24}
            height={24}
          />
          <p
            className="cursor-pointer p-2 text-xs font-medium"
            onClick={handleNoticeDelete}
          >
            삭제
          </p>
        </div>
      </div>
    </>
  );
};
export default ProfileAction;
