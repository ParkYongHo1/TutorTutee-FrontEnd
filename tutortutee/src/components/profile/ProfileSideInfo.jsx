import { useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";

const ProfileSideInfo = ({ member, memberNum, mine, setActiveComponent }) => {
  useEffect(() => {
    setActiveComponent("posts");
  }, [setActiveComponent, memberNum]);

  return (
    <>
      <div className="w-[250px] h-[250px]">
        <LazyLoadImage
          src={
            Number(memberNum) === mine.memberNum
              ? mine.profileImg ||
                `${process.env.PUBLIC_URL}/image/default/profile.svg`
              : member.profileImg ||
                `${process.env.PUBLIC_URL}/image/default/profile.svg`
          }
          alt="프로필"
          className="w-full h-full object-cover fill border rounded-full mb-[24px]"
          width={250}
          height={250}
        />
      </div>
      <p className="font-bold text-xl">
        {Number(memberNum) === mine.memberNum ? mine.nickname : member.nickname}
      </p>
      <p className="font-thin text-xs mt-[12px] min-h-[20px]">
        {Number(memberNum) === mine.memberNum
          ? mine.introduction
          : member.introduction}
      </p>
    </>
  );
};
export default ProfileSideInfo;
