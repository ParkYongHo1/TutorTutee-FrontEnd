import { LazyLoadImage } from "react-lazy-load-image-component";
import { useState } from "react";
import { useForm } from "react-hook-form";

import FindId from "../components/find/FindId";
import FindPassword from "../components/find/FindPassword";
import FindTap from "../components/find/FindTap";

const FindInfo = () => {
  const {
    register,
    watch,
    handleSubmit,
    trigger,
    resetField,
    formState: { errors },
  } = useForm();
  const [isTap, setIsTap] = useState("id");
  const [isCodeMatch, setIsCodeMatch] = useState(false);
  const id = watch("memberId") || "";
  const isIdMatch = id.length >= 8 && /[a-zA-Z]/.test(id) && /\d/.test(id);

  const handleTabChange = (tab) => {
    setIsTap(tab);
    if (tab === "id") {
      resetField("email");
      resetField("emailCode");
      setIsCodeMatch(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-[500px] m-auto h-screen">
      <LazyLoadImage
        src={`${process.env.PUBLIC_URL}/image/default/logo.png`}
        alt="로고"
        className="max-w-full mb-[50px]"
        width={300}
      />
      <FindTap handleTabChange={handleTabChange} isTap={isTap} />
      {isTap === "id" ? (
        <FindId
          register={register}
          errors={errors}
          trigger={trigger}
          watch={watch}
          isCodeMatch={isCodeMatch}
          setIsCodeMatch={setIsCodeMatch}
          handleSubmit={handleSubmit}
        />
      ) : (
        <FindPassword
          register={register}
          id={id}
          isIdMatch={isIdMatch}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default FindInfo;
