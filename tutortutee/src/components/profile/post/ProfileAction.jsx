import { LazyLoadImage } from "react-lazy-load-image-component";

const ProfileAction = () => {
  return (
    <>
      <div className="absolute w-[150px] z-10 border border-gray-300 bg-white shadow-lg text-start right-[0px] top-[25px] rounded">
        <div className="w-[90%] rounded-[5px] m-auto flex items-center py-1 object-contain px-2 mt-2 hover:bg-gray--100 mb-[12px]">
          <LazyLoadImage
            src={`${process.env.PUBLIC_URL}/image/profile/editPost.svg`}
            alt="게시글 수정"
            width={24}
            height={24}
          />
          <p className="cursor-pointer  p-2 text-xs font-medium">수정</p>
        </div>
        <div className="w-[90%] rounded-[5px] m-auto flex items-center py-1 object-contain px-2 hover:bg-gray--100 mb-[12px]">
          <LazyLoadImage
            src={`${process.env.PUBLIC_URL}/image/profile/deletePost.svg`}
            alt="게시글 삭제"
            width={24}
            height={24}
          />
          <p className="cursor-pointer  p-2 text-xs font-medium">삭제</p>
        </div>
      </div>
    </>
  );
};
export default ProfileAction;
