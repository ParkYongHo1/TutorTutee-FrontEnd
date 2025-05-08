import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { followerList } from "../../services/profileServices";
import NonFollowList from "../profile/NonFollowList";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { alarmSend } from "../../services/alarmServices";
import { logout } from "../../slices/memberSlice";
import { useNavigate } from "react-router-dom";

const LiveModal = ({ setIsLiveModalOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedMembers, setSelectedMembers] = useState([]);
  const access = useSelector((state) => state.member.access);
  const nickname = useSelector((state) => state.member.member.nickname);
  const memberNum = useSelector((state) => state.member.member.memberNum);
  const [observer, setObserver] = useState(0);
  const followerCount = useSelector(
    (state) => state.member.member.followerCount
  );
  const [follower, setFollower] = useState([]);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    const loadFollowerList = async () => {
      try {
        const response = await followerList(access, memberNum, observer);
        setFlag(response.data.flag);
        setFollower((prev) => [...prev, ...response.data.followList]);
      } catch (error) {
        if (
          error.response?.data?.message === "리프레시 토큰이 만료되었습니다."
        ) {
          dispatch(logout());
          navigate(`/`);
        } else {
          alert("오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        }
      }
    };
    loadFollowerList();
  }, [access, memberNum, observer, dispatch, navigate]);

  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollHeight - scrollTop <= clientHeight + 1) {
      if (
        !flag &&
        (observer === 0 ||
          (scrollHeight - scrollTop <= clientHeight + 1 && observer > 0))
      ) {
        setObserver((prevObserver) => prevObserver + 1);
      }
    }
  };

  const handleBackgroundClick = (event) => {
    event.stopPropagation();
  };

  const handleAddMember = (member) => {
    if (!selectedMembers.some((m) => m.memberNum === member.memberNum)) {
      setSelectedMembers((prev) => [...prev, member]);
    }
  };
  const handleDeleteMember = (memberNum) => {
    setSelectedMembers((prev) =>
      prev.filter((follower) => follower.memberNum !== memberNum)
    );
  };

  const handleSendAlarm = async () => {
    try {
      const participantList = selectedMembers.map((member) => member.memberNum);
      const response = await alarmSend(access, participantList);
      alert("알림이 전송되었습니다.");
      const newWindow = window.open(
        `https://tutor-tutee.shop/app/live/${response.data.roomId}`,
        "_blank"
      );
      if (newWindow) {
        newWindow.focus();
      } else {
        alert("팝업 차단기가 활성화되어 있습니다. 팝업을 허용해주세요.");
      }

      setIsLiveModalOpen(false);
    } catch (error) {
      if (error.response?.data?.message === "리프레시 토큰이 만료되었습니다.") {
        dispatch(logout());
        navigate(`/`);
      } else {
        alert("오류가 발생했습니다. 잠시후 다시 시도해주세요.");
      }
    }
  };
  const handleModalClose = () => {
    setIsLiveModalOpen(false);
  };
  return (
    <>
      <div
        className="absolute z-10 top-0 left-0  w-[100vw] h-[100vh] bg-gray--500 bg-opacity-80 flex items-center justify-center"
        onClick={handleBackgroundClick}
      >
        <div className="bg-white border w-[650px] h-[900px] p-4 rounded-[10px]">
          <div className="h-[100px]">
            <p className="text-2xl font-bold text-blue--500">
              {nickname}
              <span className="text-black">님의 초대알림</span>
            </p>
            <p className="text-gray--500 text-xs my-[12px]">
              팔로워를 선택하여 초대 알림을 보내보세요!
            </p>
            <p className="mb-[20px] font-semibold">
              <span>팔로워</span>
              &nbsp;
              <span className="text-blue--300">{followerCount}</span>명
            </p>
          </div>
          <div
            className="flex flex-col overflow-y-auto w-[100%] max-h-[300px] scrollable mt-[12px]"
            onScroll={handleScroll}
          >
            {follower.length === 0 ? (
              <div className="flex flex-col items-center justify-center m-auto">
                <LazyLoadImage
                  src={`${process.env.PUBLIC_URL}/image/find/fail.svg`}
                  alt="팔로워 아이콘"
                  className=""
                  width={150}
                  height={150}
                />
                <p className="text-lg font-bold text-center mt-6">
                  <span className="text-blue-500">팔로우</span>하고 있는 사람이
                  없습니다.
                </p>
              </div>
            ) : (
              follower.map((follower, index) => (
                <div key={index}>
                  <div
                    className={`w-[100%] my-[5px] flex items-center justify-between h-[80px] hover:bg-gray--100 cursor-pointer ${
                      selectedMembers.some(
                        (m) => m.memberNum === follower.memberNum
                      )
                        ? "bg-gray--100"
                        : ""
                    }`}
                    onClick={() => handleAddMember(follower)}
                  >
                    <div className="flex-1 flex items-center gap-[20px]">
                      <div className="w-[50px] h-[50px]">
                        <LazyLoadImage
                          src={
                            follower.followProfileImg ||
                            `${process.env.PUBLIC_URL}/image/default/profile.svg`
                          }
                          alt="프로필"
                          className="w-full h-full object-cover fill border rounded-full"
                          width={50}
                          height={50}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          {follower.followNickname}
                        </p>
                        <p className="text-xs">{follower.introduction}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <hr className="my-[20px]" />
          <p className="mb-[20px] font-semibold">
            알림 받을 팔로워{" "}
            <span className="text-blue--400 text-bold">
              {selectedMembers.length}
            </span>
            명
          </p>

          <div className="flex flex-col min-h-[300px] overflow-y-auto w-[100%] max-h-[300px] scrollable">
            {selectedMembers.length === 0 ? (
              <div className="flex flex-col items-center justify-center m-auto">
                <LazyLoadImage
                  src={`${process.env.PUBLIC_URL}/image/find/fail.svg`}
                  alt="팔로워 아이콘"
                  className=""
                  width={150}
                  height={150}
                />
                <p className="text-lg font-bold text-center mt-6">
                  선택된<span className="text-blue-500"> 팔로워</span>가
                  없습니다.
                </p>
              </div>
            ) : (
              selectedMembers.map((member, index) => (
                <div key={index}>
                  <div
                    className="w-[100%] flex items-center justify-between h-[80px] hover:bg-gray--100 cursor-pointer"
                    onClick={() => handleDeleteMember(member.memberNum)}
                  >
                    <div className="flex-1 flex items-center gap-[20px]">
                      <div className="w-[50px] h-[50px]">
                        <LazyLoadImage
                          src={
                            member.followProfileImg ||
                            `${process.env.PUBLIC_URL}/image/default/profile.svg`
                          }
                          alt="프로필"
                          className="w-full h-full object-cover fill border rounded-full"
                          width={50}
                          height={50}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          {member.followNickname}
                        </p>
                        <p className="text-xs">{member.introduction}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex flex-column justify-center gap-[20px] my-[20px] items-end w-[100%]">
            <button
              className="border p-3 rounded-[5px] w-[200px] font-bold text-white bg-blue--500 cursor-pointer"
              onClick={handleSendAlarm}
            >
              전송하기
            </button>
            <button
              className="border p-3 rounded-[5px] w-[200px]"
              onClick={handleModalClose}
            >
              취소하기
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LiveModal;
