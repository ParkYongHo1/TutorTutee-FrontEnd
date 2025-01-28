import { LazyLoadImage } from "react-lazy-load-image-component";

const PasswordVaild = ({
  isPasswordValid1,
  isPasswordValid2,
  isPasswordValid3,
}) => {
  return (
    <div className="mt-[12px] mb-[24px]">
      <div className="flex gap-[12px] items-center mb-[8px]">
        <LazyLoadImage
          src={
            isPasswordValid2
              ? `${process.env.PUBLIC_URL}/image/signup/success.svg`
              : `${process.env.PUBLIC_URL}/image/signup/fail.svg`
          }
        />
        <p
          className={`text-gray--500 text-sm font-bold ${
            isPasswordValid2 ? "text-green-500" : ""
          }`}
        >
          영문 대소문자를 포함해주세요.
        </p>
      </div>
      <div className="flex gap-[12px] items-center mb-[8px]">
        <LazyLoadImage
          src={
            isPasswordValid3
              ? `${process.env.PUBLIC_URL}/image/signup/success.svg`
              : `${process.env.PUBLIC_URL}/image/signup/fail.svg`
          }
        />
        <p
          className={`text-gray--500 text-sm font-bold ${
            isPasswordValid3 ? "text-green-500" : ""
          }`}
        >
          특수문자(!*@&#^.)을 포함해주세요.
        </p>
      </div>
      <div className="flex gap-[12px] items-center">
        <LazyLoadImage
          src={
            isPasswordValid1
              ? `${process.env.PUBLIC_URL}/image/signup/success.svg`
              : `${process.env.PUBLIC_URL}/image/signup/fail.svg`
          }
        />
        <p
          className={`text-gray--500 text-sm font-bold ${
            isPasswordValid1 ? "text-green-500" : ""
          }`}
        >
          8글자 이상 입력해주세요.
        </p>
      </div>
    </div>
  );
};
export default PasswordVaild;
