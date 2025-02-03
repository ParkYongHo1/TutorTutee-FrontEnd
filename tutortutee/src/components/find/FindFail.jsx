import { LazyLoadImage } from "react-lazy-load-image-component";

const FindFail = () => {
  return (
    <div className="relative h-[500px]">
      <div className="h-[15px] bg-gray-400 border-[2px] rounded-[20px] mb-[20px] shadow-inner "></div>
      <div
        className="z-10 bg-white h-[400px] w-[400px] border-t-[2px] border-b-[2px] absolute top-[0px] left-[50px] shadow-inner"
        style={{ borderTopStyle: "solid", borderBottomStyle: "dashed" }}
      >
        {" "}
        <div className="w-full  h-full mt-[20%] text-center">
          <LazyLoadImage
            src={`${process.env.PUBLIC_URL}/image/find/fail.svg`}
            alt="실패 아이콘"
            className="m-auto"
            width={90}
            height={90}
          />
          <p className="font-bold text-2xl mt-[10%]">아이디 찾기 실패</p>
          <hr className="w-[80%] m-auto my-[5%] border border-[2px]" />
          <p className="text-2xl font-bold text-blue--500">
            일치하는 계정 정보가 없습니다
          </p>
        </div>
      </div>
    </div>
  );
};
export default FindFail;
