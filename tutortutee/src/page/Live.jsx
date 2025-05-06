import { useParams } from "react-router-dom";

import LiveChat from "../components/Live/LiveChat/LiveChat";
import LiveCam from "../components/Live/LiveCam/LiveCam";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { loadMember } from "../services/roomServices";
const Live = () => {
  const { roomId } = useParams();
  const [isOff, setIsOff] = useState("");
  const access = useSelector((state) => state.member.access);
  const [liveMember, setLiveMember] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hostInfo, setHostInfo] = useState({});
  const [hostMemberNum, setHostMemberNum] = useState(0);
  useEffect(() => {
    const loadLiveMember = async () => {
      try {
        const response = await loadMember(access, roomId);
        setLiveMember(response.data.participantList);
        setHostInfo(response.data.participantList[0]);
        setHostMemberNum(response.data.hostMemberNum);
      } catch (error) {
        console.log(error);
      }
    };
    loadLiveMember();
  }, [access, roomId]);
  return (
    <div className=" w-[1700px] m-auto ">
      <div className="flex items-center">
        <LiveCam
          roomId={roomId}
          hostInfo={hostInfo}
          hostMemberNum={hostMemberNum}
        />
        <LiveChat roomId={roomId} setIsOff={setIsOff} isOff={isOff} />
      </div>
    </div>
  );
};

export default Live;
