import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SearchUser from "./SearchUser";
import SearchUserItem from "./SearchUserItem";
import { searchList } from "../../services/profileServices";
import NonSearchList from "./NonSearchList";

const SearchUserList = ({ memberNum }) => {
  const access = useSelector((state) => state.member.access);
  const navigate = useNavigate();
  const [searchUser, setSearchUser] = useState([]);
  const [searchNickname, setSearchNickname] = useState("");
  const [flag, setFlag] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true); // 🔹 처음 로드인지 체크

  // 🔹 뒤로 가기 시 기존 검색 상태 유지
  useEffect(() => {
    const navigationType =
      window.performance.getEntriesByType("navigation")[0]?.type;

    if (navigationType === "reload" || navigationType === "navigate") {
      // 🔹 새로고침 또는 처음 방문 시 검색 초기화
      sessionStorage.removeItem("searchNickname");
      sessionStorage.removeItem("searchUser");
      sessionStorage.removeItem("flag");
      setSearchNickname("");
      setSearchUser([]);
      setFlag(false);
    } else {
      // 🔹 뒤로 가기 시 검색 상태 유지
      const savedSearchNickname = sessionStorage.getItem("searchNickname");
      const savedSearchUser = sessionStorage.getItem("searchUser");
      const savedFlag = sessionStorage.getItem("flag");

      if (savedSearchNickname) setSearchNickname(savedSearchNickname);
      if (savedSearchUser) setSearchUser(JSON.parse(savedSearchUser));
      if (savedFlag) setFlag(JSON.parse(savedFlag));

      setIsFirstLoad(false); // 🔹 처음 로드가 끝났음을 표시
    }
  }, []);

  // 🔹 검색어 변경 시 검색 결과 저장
  useEffect(() => {
    if (searchNickname.trim() !== "") {
      sessionStorage.setItem("searchNickname", searchNickname);
    }
  }, [searchNickname]);

  // 🔹 검색 결과 변경 시 sessionStorage 저장
  useEffect(() => {
    if (searchUser.length > 0) {
      sessionStorage.setItem("searchUser", JSON.stringify(searchUser));
    }
  }, [searchUser]);

  // 🔹 flag 변경 시 sessionStorage 저장
  useEffect(() => {
    sessionStorage.setItem("flag", JSON.stringify(flag));
  }, [flag]);

  // 🔹 검색어가 변경되었을 때만 API 요청 실행
  useEffect(() => {
    if (searchNickname.trim() === "" || isFirstLoad) {
      setIsFirstLoad(false); // 🔹 API 요청 방지 후 초기화
      return;
    }

    const loadSearchUserList = async () => {
      try {
        const response = await searchList(access, searchNickname);

        setFlag(response.data.flag);
        setSearchUser(response.data.memberList);

        // 🔹 검색 결과 sessionStorage에 저장
        sessionStorage.setItem("searchNickname", searchNickname);
        sessionStorage.setItem(
          "searchUser",
          JSON.stringify(response.data.memberList)
        );
        sessionStorage.setItem("flag", JSON.stringify(response.data.flag));
      } catch (error) {
        if (
          error.response?.data?.message === "리프레시 토큰이 만료되었습니다."
        ) {
          navigate("/");
        } else {
          alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
      }
    };

    loadSearchUserList();
  }, [searchNickname, access, navigate, isFirstLoad]);

  return (
    <>
      <SearchUser memberNum={memberNum} setSearchNickname={setSearchNickname} />
      <div className="mx-auto max-w-[1020px] grid grid-cols-3 gap-10 place-items-center p-5 overflow-y-auto max-h-[600px] scrollable">
        {searchUser.length === 0 ? (
          <div className="col-span-3">
            <NonSearchList searchNickname={searchNickname} />
          </div>
        ) : (
          searchUser.map((user, index) => (
            <SearchUserItem
              key={index}
              searchUser={user}
              memberNum={memberNum}
            />
          ))
        )}
      </div>
    </>
  );
};

export default SearchUserList;
