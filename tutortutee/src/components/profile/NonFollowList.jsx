import { LazyLoadImage } from "react-lazy-load-image-component";

const NonFollowList = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen m-auto">
      <LazyLoadImage
        src={`${process.env.PUBLIC_URL}/image/find/fail.svg`}
        alt="팔로워 아이콘"
        className=""
        width={150}
        height={150}
      />
      <p className="text-lg font-bold text-center mt-6">
        <span className="text-blue-500">팔로우</span>하고 있는 사람이 없습니다.
      </p>
    </div>
  );
};

export default NonFollowList;
