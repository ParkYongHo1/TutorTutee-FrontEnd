import { useParams } from "react-router-dom";
import LiveCam from "../components/live/liveCam/LiveCam";
import LiveChat from "../components/live/liveChat/LiveChat";
import { useState } from "react";

const Live = () => {
  const { roomId } = useParams();
  const [isOff, setIsOff] = useState("");
  return (
    <div className=" w-[1700px] m-auto ">
      <div className="flex items-center">
        <LiveCam />
        <LiveChat roomId={roomId} setIsOff={setIsOff} isOff={isOff} />
      </div>
    </div>
  );
};

export default Live;
