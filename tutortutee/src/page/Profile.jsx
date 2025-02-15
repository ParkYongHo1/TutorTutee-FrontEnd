import { LazyLoadImage } from "react-lazy-load-image-component";
import PostItem from "../components/profile/PostItem";
import FollowerList from "../components/profile/FollowerList";
import FollowingList from "../components/profile/FollowingList";
import ChangeInfo from "../components/profile/ChangeInfo";
import { useDispatch, useSelector } from "react-redux";
import { deleteMember } from "../services/userServices";
import ConfirmModal from "../components/modal/ConfirmModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../slices/memberSlice";

const Profile = () => {
  const member = useSelector((state) => state.member.member);
  const access = useSelector((state) => state.member.access);
  const [activeComponent, setActiveComponent] = useState("posts");
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
  const handleShowChangeInfo = () => setActiveComponent("changeInfo");
  const handleShowPosts = () => setActiveComponent("posts");
  const handleShowFollowers = () => setActiveComponent("followers");
  const handleShowFollowing = () => setActiveComponent("following");

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "changeInfo":
        return <ChangeInfo />;
      case "posts":
        return <PostItem />;
      case "followers":
        return <FollowerList />;
      case "following":
        return <FollowingList />;
      default:
        return <ChangeInfo />;
    }
  };
  return (
    <>
      <div className="w-[1020px] m-auto gap-[20px] flex ">
        <div className="mb-[12px] w-[250px] min-h-[750px]">
          <div className="w-[250px] h-[250px]">
            <LazyLoadImage
              src={
                member.profileImg ||
                `${process.env.PUBLIC_URL}/image/default/profile.svg`
              }
              alt="프로필"
              className="w-full h-full object-cover fill border rounded-full mb-[24px]"
              width={250}
              height={250}
            />
          </div>
          <p className="font-bold text-xl">{member.nickname}</p>
          <p className="font-thin text-xs mt-[12px] min-h-[20px]">
            {member.introduction}
          </p>
          <button className="bg-gray-200 hover:bg-gray--300 font-thin w-full my-[12px] py-2 text-sm rounded-[5px]">
            게시글 작성
          </button>
          <hr className="my-[12px]" />
          <div
            className="flex items-center cursor-pointer mt-[24px] mb-[16px] hover:text-blue--500"
            onClick={handleShowChangeInfo}
          >
            <LazyLoadImage
              src={`${process.env.PUBLIC_URL}/image/profile/editProfile.svg`}
              alt="프로필 수정 아이콘"
              className="max-w-full p-1 mr-[12px]"
              width={24}
              height={24}
            />
            <div className="flex w-full justify-between items-center">
              <p className="font-thin text-sm">프로필 수정</p>
            </div>
          </div>
          <hr className="my-[12px]" />
          <div
            className="flex items-center cursor-pointer mt-[24px] mb-[16px] hover:text-blue--500"
            onClick={handleShowPosts}
          >
            <LazyLoadImage
              src={`${process.env.PUBLIC_URL}/image/profile/writePost.svg`}
              alt="게시글 아이콘"
              className="max-w-full p-1 mr-[12px]"
              width={24}
              height={24}
            />
            <div className="flex w-full justify-between items-center">
              <p className="font-thin text-sm">게시글</p>
              <p className="font-bold">19</p>
            </div>
          </div>
          <div
            onClick={handleShowFollowers}
            className="flex items-center cursor-pointer mb-[16px] hover:text-blue--500"
          >
            <LazyLoadImage
              src={`${process.env.PUBLIC_URL}/image/profile/follower.svg`}
              alt="팔로워 아이콘"
              className="max-w-full p-1 mr-[12px]"
              width={24}
              height={24}
            />
            <div className="flex w-full justify-between items-center">
              <p className="font-thin text-sm">팔로워</p>
              <p className="font-bold">19</p>
            </div>
          </div>
          <div
            onClick={handleShowFollowing}
            className="flex items-center cursor-pointer hover:text-blue--500"
          >
            <LazyLoadImage
              src={`${process.env.PUBLIC_URL}/image/profile/follow.svg`}
              alt="팔로잉 아이콘"
              className="max-w-full p-1 mr-[12px]"
              width={24}
              height={24}
            />
            <div className="flex w-full justify-between items-center">
              <p className="font-thin text-sm">팔로잉</p>
              <p className="font-bold">19</p>
            </div>
          </div>
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
        </div>
        <div className="w-[750px] ml-[20px] border min-h-[800px] rounded-[5px] p-6">
          {renderActiveComponent()}
        </div>
      </div>
    </>
  );
};

export default Profile;
