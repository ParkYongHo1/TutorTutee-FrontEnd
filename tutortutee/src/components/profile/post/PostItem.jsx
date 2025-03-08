import { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ProfileAction from "./ProfileAction";
import PostLike from "./PostLike";
import { useSelector } from "react-redux";
import formatDate from "../../../util/getDate";
import DOMPurify from "dompurify";
const PostItem = ({ notice, onDelete, onLikeClick, onDisLikeClick }) => {
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
            <p className="text-sm font-bold">{notice.noticeWriter}</p>
            <p className="text-[10px] text-gray--500">
              {formatDate(notice.noticeDate)}
            </p>
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
            {isDropdownOpen && (
              <ProfileAction noticeNum={notice.noticeNum} onDelete={onDelete} />
            )}
          </div>
        </div>
        <p
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(notice.noticeContent),
          }}
        />
        <PostLike
          notice={notice}
          onLikeClick={onLikeClick}
          onDisLikeClick={onDisLikeClick}
        />
      </div>
    </>
  );
};
export default PostItem;
