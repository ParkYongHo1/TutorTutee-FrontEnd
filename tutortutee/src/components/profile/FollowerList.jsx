import { LazyLoadImage } from "react-lazy-load-image-component";

const FollowerList = () => {
  return (
    <>
      <p className="text-sm font-bold mb-[12px]">검색</p>
      <div className="flex mb-[12px] items-center ">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="닉네임을 입력해주세요."
            className="w-full px-10 h-[30px] "
          />
          <LazyLoadImage
            src={`${process.env.PUBLIC_URL}/image/profile/search.svg`}
            alt="검색"
            className="max-w-full cursor-pointer absolute top-0 left-[0px]"
            width={30}
            height={30}
          />
        </div>
      </div>
      <hr />

      <input type="text w-[500px] h-[50px] border" />
      <div className="text-sm font-bold">팔로워</div>
      <hr className="my-[12px]" />
      <div className="flex flex-col items-center overflow-y-auto max-h-[600px] scrollable">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="flex mt-[12px] items-center w-full">
            <div className="w-[100px] h-[100px]">
              <LazyLoadImage
                src={`${process.env.PUBLIC_URL}/image/default/profile.svg`}
                alt="프로필"
                className="w-full h-full object-cover fill border rounded-full mb-[24px]"
                width={100}
                height={100}
              />
            </div>
            <div className="w-[400px] mx-[24px]">
              <p className="text-lg font-bold">닉네임</p>
              <p className="text-sm mt-[8px]">안녕하세요</p>
            </div>
            <div>
              <button className="bg-blue-500 text-white font-bold w-[120px] h-[40px] rounded-[5px]">
                맞팔로우
              </button>
            </div>
            <div className="w-[20px] h-[20px] mx-[20px] cursor-pointer">
              <LazyLoadImage
                src={`${process.env.PUBLIC_URL}/image/default/cancel.svg`}
                alt="프로필"
                className=""
                width={20}
                height={20}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default FollowerList;
