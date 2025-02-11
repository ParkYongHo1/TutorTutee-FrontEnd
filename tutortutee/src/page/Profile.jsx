import { LazyLoadImage } from "react-lazy-load-image-component";
import PostItem from "../components/profile/PostItem";
import { useSelector } from "react-redux";

const Profile = () => {
  const member = useSelector((state) => state.member.member);
  console.log(member.profileImg);

  return (
    <>
      <div className="w-[1020px] m-auto gap-[20px] flex ">
        <div className="mb-[12px] w-[250px] h-[250px]">
          <LazyLoadImage
            src={
              member.profileImg ||
              `${process.env.PUBLIC_URL}/image/profile/writePost.svg`
            }
            alt="프로필"
            className="max-w-full p-1 border rounded-full mb-[24px]"
            width={250}
            height={250}
          />
          <p className="font-bold text-xl">{member.nickname}</p>
          <p className="font-thin text-xs mt-[12px] min-h-[20px]">
            {member.introduction}
          </p>
          <button className="bg-gray-200 hover:bg-gray--300 font-thin w-full my-[12px] py-2 text-sm rounded-[5px]">
            게시글 작성
          </button>
          <hr className="my-[12px]" />
          <div className="flex items-center cursor-pointer mt-[24px] mb-[16px] hover:text-blue--500">
            <LazyLoadImage
              src={
                member.profileImg ||
                `${process.env.PUBLIC_URL}/image/profile/writePost.svg`
              }
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
          <div className="flex items-center cursor-pointer mb-[16px] hover:text-blue--500">
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
          <div className="flex items-center cursor-pointer hover:text-blue--500">
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
        </div>
        <div className="w-[750px] ml-[20px] border min-h-[800px] rounded-[5px] p-6">
          <PostItem />
        </div>
      </div>
    </>
  );
};
export default Profile;
