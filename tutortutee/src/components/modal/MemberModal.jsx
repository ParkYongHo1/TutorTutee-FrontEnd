import { LazyLoadImage } from "react-lazy-load-image-component";
import { ALARM_TYPE_MESSAGE } from "../../util/constant";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { deleteRoom, liveMemberUpdate } from "../../services/liveServices";
import { useNavigate } from "react-router-dom";
import { logout } from "../../slices/memberSlice";

const MemberModal = ({
  liveMember,
  hostInfo,
  roomId,
  setIsOff,
  onUpdate,
  stompClientRef,
}) => {
  const memberNum = useSelector((state) => state.member.member.memberNum);
  const member = useSelector((state) => state.member.member);
  const access = useSelector((state) => state.member.access);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onChangeMember = async () => {
    try {
      // 먼저 STOMP 메시지 전송
      if (stompClientRef.current) {
        stompClientRef.current.publish({
          destination: `/pub/${roomId}/messages`,
          body: JSON.stringify({
            roomId: roomId,
            nickname: member.nickname,
            content: "",
            profileImg: member.profileImg,
            type: "TYPE_OUT", // 퇴장 메시지 타입
          }),
        });
      }
      console.log("test");

      // API 호출은 메시지 전송 후에 진행
      const isUpdate = await liveMemberUpdate(access, roomId);
      if (isUpdate) {
        onUpdate(memberNum);
      }
      navigate(`/profile/${memberNum}`);
    } catch (error) {
      // 기존 에러 처리 코드
      if (error.response?.data?.message === "리프레시 토큰이 만료되었습니다.") {
        dispatch(logout());
      } else {
        alert("오류가 발생했습니다. 잠시후 다시 시도해주세요.");
      }
    }
  };
  const onDeleteRoom = async () => {
    try {
      const response = await deleteRoom(access, roomId);
      setIsOff(response.data.message);
      alert("LIVE가 종료되었습니다.");
      navigate(`/profile/${memberNum}`);
    } catch (error) {
      if (error.response?.data?.message === "리프레시 토큰이 만료되었습니다.") {
        dispatch(logout());
        navigate("/");
      } else {
        alert("오류가 발생했습니다. 잠시후 다시 시도해주세요.");
      }
    }
  };

  return (
    <>
      <div className="absolute w-[250px] z-20 border border-gray-300 bg-white shadow-lg text-start left-[-100px] top-[50px] rounded">
        <div className="px-2 mt-[12px]">튜터</div>
        <div className="flex items-center p-2">
          <div className="flex items-center flex-1">
            <div className="w-[40px] h-[40px] mr-2">
              <LazyLoadImage
                src={
                  hostInfo.profileImg ||
                  `${process.env.PUBLIC_URL}/image/default/profile.svg`
                }
                alt="프로필"
                className={`w-full h-full object-cover fill border rounded-full`}
                width={40}
                height={40}
              />
            </div>
            <p
              className={`text-blue--500" : "text-black"
               text-xs font-bold`}
            >
              {hostInfo.nickname}
            </p>
          </div>

          <div className="text-xs border text-center px-2 py-1 text-white bg-blue--500">
            튜터
          </div>
        </div>

        <hr className="w-[90%] m-auto mb-[4px] " />
        <div className="px-2 mt-[12px]">튜티</div>

        {liveMember?.map((item, index) => {
          if (index === 0) return null;

          return (
            <div key={index} className="flex items-center mb-[8px]">
              <div className="flex items-center p-2 flex-1">
                <div className="flex items-center flex-1">
                  <div className="w-[40px] h-[40px] mr-2">
                    <LazyLoadImage
                      src={
                        item.profileImg ||
                        `${process.env.PUBLIC_URL}/image/default/profile.svg`
                      }
                      alt="프로필"
                      className={`w-full h-full object-cover fill border rounded-full`}
                      width={40}
                      height={40}
                    />
                  </div>
                  <p className={`text-black text-xs font-bold`}>
                    {item.nickname}
                  </p>
                </div>

                <div
                  className={`${
                    item.initStatus ? "bg-green--500" : "bg-red--500"
                  } text-xs border text-center rounded-full w-[20px] h-[20px] mr-3`}
                ></div>
              </div>
            </div>
          );
        })}
        <button className="w-full bg-red-100 h-[50px] text-red--500 font-semibold">
          {hostInfo.memberNum === memberNum ? (
            <p onClick={onDeleteRoom}>LIVE 종료</p>
          ) : (
            <p onClick={onChangeMember}>나가기</p>
          )}
        </button>
      </div>
    </>
  );
};
export default MemberModal;
