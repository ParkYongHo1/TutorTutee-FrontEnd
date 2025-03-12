import LiveCam from "../components/Live/LiveCam/LiveCam";
import LiveChat from "../components/Live/LiveChat/LiveChat";
import LiveHeader from "../layout/header/LiveHeader";

const Live = () => {
  return (
    <div className="flex flex-col items-center">
      <LiveHeader />
      <div className="flex items-center">
        <LiveCam />
        <LiveChat />
      </div>
    </div>
  );
};

export default Live;
