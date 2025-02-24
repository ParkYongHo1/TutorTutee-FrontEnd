import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../slices/memberSlice";
import { useNavigate } from "react-router-dom";

const SearchFollower = ({ memberNum, setSearchFollower }) => {
  const [searchNickname, setSearchNickname] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const access = useSelector((state) => state.member.access);
  const timerRef = useRef(null);

  useEffect(() => {
    const loadFollowerList = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/profile/searchFollower?searchName=${searchNickname}&memberNum=${memberNum}&observer=0`,
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );
        setSearchFollower(response.data.followList);
      } catch (error) {
        console.log("searchError");

        if (
          error.response?.data?.message === "리프레시 토큰이 만료되었습니다."
        ) {
          dispatch(logout());
          navigate("/");
        } else {
          alert("오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        }
      }
    };

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (searchNickname.length > 0) {
      timerRef.current = setTimeout(() => {
        loadFollowerList();
      }, 1000);
    } else {
      loadFollowerList();
    }

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [
    dispatch,
    navigate,
    searchNickname,
    access,
    memberNum,
    setSearchFollower,
  ]);

  const handleSearchChange = (event) => {
    setSearchNickname(event.target.value);
  };

  return (
    <>
      <div className="flex mb-[12px] items-center ">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="닉네임을 입력해주세요."
            className="w-full px-10 h-[30px] "
            value={searchNickname}
            onChange={handleSearchChange}
          />
          <LazyLoadImage
            src={`${process.env.PUBLIC_URL}/image/profile/search.svg`}
            alt="검색"
            className="max-w-full cursor-pointer absolute top-0 left-[0px]"
            width={30}
            height={30}
          />
        </div>
      </div>
    </>
  );
};

export default SearchFollower;
