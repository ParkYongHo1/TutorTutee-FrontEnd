import { useParams } from "react-router-dom";
import LiveCam from "../components/live/liveCam/LiveCam";
import LiveChat from "../components/live/liveChat/LiveChat";
import LiveHeader from "../layout/header/LiveHeader";

const Live = () => {
  const { roomId } = useParams();
  return (
    <div className=" w-[1700px] m-auto ">
      <div className="flex items-center">
        <LiveCam />
        <LiveChat />
      </div>
    </div>
  );
};

export default Live;
