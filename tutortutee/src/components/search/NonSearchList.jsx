import { LazyLoadImage } from "react-lazy-load-image-component";

const NonSearchList = ({ searchNickname }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      {searchNickname.trim() !== "" ? (
        <>
          <LazyLoadImage
            src={`${process.env.PUBLIC_URL}/image/search/nonUser.svg`}
            alt="유저 없음"
            className=""
            width={120}
            height={120}
          />
          <p className="text-base font-bold text-center mt-6">
            <span className="text-blue-500">일치하는 사용자</span>가 없습니다.
          </p>
        </>
      ) : (
        <>
          <LazyLoadImage
            src={`${process.env.PUBLIC_URL}/image/search/searchUser.svg`}
            alt="유저 검색"
            className=""
            width={120}
            height={120}
          />
          <p className="text-base font-bold text-center mt-6">
            찾고싶은 사용자의 <span className="text-blue-500">닉네임</span>을
            검색하세요.
          </p>
        </>
      )}
    </div>
  );
};

export default NonSearchList;
