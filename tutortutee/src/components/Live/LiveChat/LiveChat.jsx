import { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { loadMember } from "../../../services/roomServices";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import MemberModal from "../../modal/MemberModal";
import LiveChatList from "./LiveChatList";

const LiveChat = ({ roomId, isOff, setIsOff }) => {
  const access = useSelector((state) => state.member.access);
  const [liveMember, setLiveMember] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hostInfo, setHostInfo] = useState({});
  useEffect(() => {
    const loadLiveMember = async () => {
      try {
        const response = await loadMember(access, roomId);
        setLiveMember(response.data.participantList);
        setHostInfo(response.data.participantList[0]);
      } catch (error) {
        console.log(error);
      }
    };
    loadLiveMember();
  }, [access, roomId]);
  const handleMemberModal = () => {
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

  const handleChangeInitStatus = (memberNum) => {
    setLiveMember((prev) => {
      prev.map((member) =>
        member.memberNum === memberNum
          ? { ...member, initStatus: !member.initStatus }
          : member
      );
    });
  };

  return (
    <div className="flex flex-col w-[35vw] h-[100vh] px-3">
      <div className="min-h-[10vh] flex justify-between items-center">
        <div className="flex justify-between gap-[15px] items-center">
          <div className="w-[80px] h-[80px] ">
            <LazyLoadImage
              src={`${process.env.PUBLIC_URL}/image/default/profile.svg`}
              alt="프로필"
              className="w-full h-full object-cover fill border rounded-[10%]"
              width={80}
              height={80}
            />
          </div>
          <div>
            <div>
              <p className="text-lg text-blue--500 font-bold">
                {hostInfo.nickname}&nbsp;
                <span className="text-lg text-black font-semibold">
                  님의 LIVE
                </span>
              </p>
            </div>
            <div className=" relative dropdown flex gap-[8px] items-center font-bold w-[30px] h-[30px]">
              <LazyLoadImage
                src={`${process.env.PUBLIC_URL}/image/live/people.svg`}
                alt="프로필"
                className="w-full h-full object-cover fill cursor-pointer"
                width={30}
                height={30}
                onClick={handleMemberModal}
              />
              <p>{liveMember.length}</p>
              {isDropdownOpen && (
                <MemberModal
                  liveMember={liveMember}
                  hostInfo={hostInfo}
                  roomId={roomId}
                  setIsOff={setIsOff}
                  onUpdate={handleChangeInitStatus}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="min-h-[90vh]">
        <LiveChatList />
      </div>
    </div>
  );
};

export default LiveChat;
