import { LazyLoadImage } from "react-lazy-load-image-component";
import ProfileSideDelete from "./ProfileSideDelete";
import { useSelector } from "react-redux";

const ProfileSideTab = ({ member, memberNum, mine, setActiveComponent }) => {
  const handleShowChangeInfo = () => setActiveComponent("changeInfo");
  const handleShowPosts = () => setActiveComponent("posts");
  const handleShowFollowers = () => setActiveComponent("followers");
  const handleShowFollowing = () => setActiveComponent("following");
  const handleWritePost = () => setActiveComponent("writePost");
  const user = useSelector((state) => state.member.member);
  return (
    <>
      {Number(memberNum) === mine.memberNum ? (
        <div
          className="cursor-pointer font-thin w-[250px] my-[12px] py-2 text-sm rounded-[5px] bg-gray-200 hover:bg-gray--300 text-center"
          onClick={handleWritePost}
        >
          게시글 작성
        </div>
      ) : (
        <button className="bg-gray-200 hover:bg-gray--300 font-thin w-full my-[12px] py-2 text-sm rounded-[5px]">
          팔로우 취소
        </button>
      )}
      <hr className="my-[12px]" />
      {Number(memberNum) === mine.memberNum ? (
        <>
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
          <hr className="my-[12px]" />{" "}
        </>
      ) : (
        ""
      )}
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
          <p className="font-bold">
            {Number(memberNum) === mine.memberNum
              ? user.noticeCount
              : member.noticeCount}
          </p>
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
          <p className="font-bold">
            {Number(memberNum) === mine.memberNum
              ? user.followerCount
              : member.followerCount}
          </p>
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
          <p className="font-bold">
            {Number(memberNum) === mine.memberNum
              ? user.followCount
              : member.followCount}
          </p>
        </div>
      </div>
      {Number(memberNum) === mine.memberNum && mine.loginType === 0 ? (
        <ProfileSideDelete />
      ) : (
        ""
      )}
    </>
  );
};
export default ProfileSideTab;
