import { LazyLoadImage } from "react-lazy-load-image-component";

const NonNoticeList = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[600px] m-auto">
      <LazyLoadImage
        src={`${process.env.PUBLIC_URL}/image/find/fail.svg`}
        alt="팔로워 아이콘"
        className=""
        width={150}
        height={150}
      />
      <p className="text-lg font-bold text-center mt-6">
        작성된<span className="text-blue-500">공지글</span>이 없습니다.
      </p>
    </div>
  );
};
export default NonNoticeList;
