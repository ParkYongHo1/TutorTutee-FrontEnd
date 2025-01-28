import { LazyLoadImage } from "react-lazy-load-image-component";
const SocialSignup = () => {
  return (
    <>
      <h2 className="member-sns__title flex items-center font-bold w-full mt-[12px] mb-[12px]">
        &nbsp;SNS 계정으로 회원가입&nbsp;
      </h2>
      <div className="flex gap-[10px] items-center justify-center w-full">
        <button
          className="relative w-[230px] h-[40px]"
          //   onClick={() => openPopup()}
        >
          <LazyLoadImage
            className="cursor-pointer"
            src={`${process.env.PUBLIC_URL}/image/signup/naver.png`}
            alt="네이버로 회원가입"
            width={230}
            height={40}
          />
        </button>
        <button className="relative w-[250px] h-[40px]">
          <LazyLoadImage
            className="cursor-pointer"
            src={`${process.env.PUBLIC_URL}/image/signup/kakao.png`}
            alt="카카오로 회원가입"
            width={250}
            height={50}
          />
        </button>
      </div>
    </>
  );
};
export default SocialSignup;
