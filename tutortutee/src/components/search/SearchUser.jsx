import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const SearchUser = ({ memberNum, setSearchNickname }) => {
  const [nickname, setNickname] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const access = useSelector((state) => state.member.access);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setNickname(value);
    setSearchNickname(value);
  };

  return (
    <div className="flex w-[1020px] h-[110px] items-center justify-between m-auto relative">
      <Link to="/">
        <LazyLoadImage
          src={`${process.env.PUBLIC_URL}/image/default/logo.png`}
          alt="로고"
          className="max-w-full mr-20"
          width={200}
          height={50}
        />
      </Link>
      <div className="relative w-full flex items-center">
        <input
          type="text"
          placeholder="닉네임을 입력해주세요."
          className="w-full px-5 h-[50px] bg-gray-500/10 rounded-lg"
          value={nickname}
          onChange={handleSearchChange}
        />
        <LazyLoadImage
          src={`${process.env.PUBLIC_URL}/image/profile/search.svg`}
          alt="검색"
          className="max-w-full cursor-pointer absolute right-[15px]"
          width={30}
          height={30}
        />
      </div>
    </div>
  );
};

export default SearchUser;
