import { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ProfileAction from "./ProfileAction";
import PostLike from "./PostLike";
import { useSelector } from "react-redux";

const PostItem = () => {
  const member = useSelector((state) => state.member.member);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (event.target.closest(".dropdown")) return;
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="scrollable pb-2 flex items-center max-h-[200px] w-full mb-[16px] overflow-x-auto gap-[24px]">
        <div className="flex gap-[24px] ">
          {Array(6)
            .fill()
            .map((_, index) => (
              <div key={index}>
                <div className="w-[100px] h-[100px]">
                  <LazyLoadImage
                    src={`${process.env.PUBLIC_URL}/image/default/profile.svg`}
                    alt="프로필"
                    className="max-w-full p-1 border rounded-full border-2 border-purple"
                    width={100}
                    height={100}
                  />
                </div>
                <p className="text-center text-xs mt-[4px]">닉네임</p>
              </div>
            ))}
        </div>
      </div>
      <hr className="mb-[24px]" />
      <div className="overflow-y-auto max-h-[600px] scrollable px-2">
        {Array(6)
          .fill()
          .map((_, index) => (
            <div
              key={index}
              className=" flex border w-[100%] m-auto rounded-[5px] p-3 mb-[12px]"
            >
              <div className="w-[8%] h-[40px]">
                <LazyLoadImage
                  src={`${process.env.PUBLIC_URL}/image/default/profile.svg`}
                  alt="프로필"
                  className="max-w-full p-1 border rounded-full mr-2"
                  width={40}
                  height={40}
                />
              </div>
              <div className="w-[100%]">
                <div className="flex items-center mb-[4px] h-[30px] justify-between">
                  <div className="flex items-center gap-[4px]">
                    <p className="text-sm font-bold">{member.nickname}</p>
                    <p className="text-[10px] text-gray--500">방금전</p>
                  </div>
                  <div
                    className="cursor-pointer relative dropdown"
                    onClick={toggleDropdown}
                  >
                    <LazyLoadImage
                      src={`${process.env.PUBLIC_URL}/image/profile/more.svg`}
                      alt="더보기"
                      width={20}
                      height={20}
                    />
                    {isDropdownOpen && <ProfileAction />}
                  </div>
                </div>
                <p>
                  자기 계발을 위한 온라인 강의 추천으로는 유용한 학습 플랫폼과
                  강좌를 소개합니다. Coursera, Udemy, LinkedIn Learning과 같은
                  플랫폼은 다양한 분야의 강좌를 제공하여 자신의 관심사와 목표에
                  맞는 학습을 할 수 있습니다. 예를 들어, 프로그래밍, 마케팅,
                  디자인 등 다양한 주제의 강좌가 준비되어 있으며, 전문가들의
                  강의를 통해 실질적인 지식을 습득할 수 있습니다. 온라인 강의를
                  통해 시간과 장소에 구애받지 않고 자기 계발을 지속할 수
                  있습니다.
                </p>
                <PostLike />
              </div>
            </div>
          ))}
      </div>
    </>
  );
};
export default PostItem;
