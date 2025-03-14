import { useEffect, useRef } from "react";

const LiveCam = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);

  useEffect(() => {}, []);

  return (
    <div className="flex flex-col items-center justify-center w-[65vw] h-[100vh] bg-blue-50">
      {/* <iframe
        width="100%"
        height="100%"
        src="https://www.youtube.com/embed/AnqkPWH3A6I"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe> */}
    </div>
  );
};

export default LiveCam;
