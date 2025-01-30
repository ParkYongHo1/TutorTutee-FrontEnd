import { LazyLoadImage } from "react-lazy-load-image-component";
import { useEffect, useState } from "react";
import HeaderAction from "./HeaderAction";

const LoginHeader = () => {
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
  console.log();

  return (
    <div className="flex w-[1020px] h-[110px] items-center justify-between m-auto relative">
      <div>
        <LazyLoadImage
          src={`${process.env.PUBLIC_URL}/image/default/logo.png`}
          alt="로고"
          className="max-w-full"
          width={200}
          height={50}
        />
      </div>
      <div className="flex w-[200px] gap-[30px] items-center ">
        <LazyLoadImage
          src={`${process.env.PUBLIC_URL}/image/profile/search.svg`}
          alt="검색"
          className="max-w-full cursor-pointer"
          width={30}
          height={30}
        />
        <div className="cursor-pointer flex items-center">
          <LazyLoadImage
            src={`${process.env.PUBLIC_URL}/image/profile/video.svg`}
            alt="LIVE"
            className="max-w-full m-auto"
            width={25}
            height={25}
          />
          <p className="font-bold ml-1">LIVE</p>
        </div>
        <div
          className="border rounded-full cursor-pointer ml-2 relative dropdown"
          onClick={toggleDropdown}
        >
          <LazyLoadImage
            src={`${process.env.PUBLIC_URL}/image/default/profile.svg`}
            alt="프로필"
            className="max-w-full p-1"
            width={40}
            height={40}
          />
          {isDropdownOpen && <HeaderAction />}
        </div>
      </div>
    </div>
  );
};

export default LoginHeader;
