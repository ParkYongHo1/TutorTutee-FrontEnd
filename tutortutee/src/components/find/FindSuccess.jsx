import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";

const FindSuccess = () => {
  return (
    <>
      <div className="relative h-[450px]">
        <div className="w-[500px] h-[15px] bg-gray-400 border-t-[2px] rounded-[20px] mb-[20px] shadow-inner "></div>
        <div
          className="z-10 bg-white h-[400px] w-[400px] border-t-[2px] border-b-[2px] absolute top-[0px] left-[50px] shadow-inner"
          style={{ borderTopStyle: "solid", borderBottomStyle: "dashed" }}
        >
          <div className="w-full  h-full mt-[20%] text-center">
            <LazyLoadImage
              src={`${process.env.PUBLIC_URL}/image/find/success.svg`}
              alt="성공 아이콘"
              className="m-auto "
              width={90}
              height={90}
            />
            <p className="font-bold text-2xl mt-[10%]">아이디 찾기 성공</p>
            <hr className="w-[80%] m-auto my-[5%] border border-[2px]" />
            <div className="flex gap-[20px] w-full justify-center items-center">
              <p className="text-2xl font-bold text-blue--500">아이디</p>
              <p className="text-2xl font-bold text-blue--500">te****34</p>
            </div>
          </div>
        </div>
      </div>
      <Link
        to="/login"
        className="bg-black text-white h-[60px] mb-[12px] text-lg w-full font-bold text-center flex items-center justify-center"
      >
        로그인 하러가기
      </Link>
      <Link
        to="/"
        className="bg-white text-black border-[2px] h-[60px] text-lg w-full font-bold text-center flex items-center justify-center"
      >
        메인으로
      </Link>
    </>
  );
};

export default FindSuccess;
