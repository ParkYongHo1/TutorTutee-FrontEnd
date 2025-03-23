import React, { useEffect, useRef } from "react";

const LiveCam = () => {
  const localVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    const startVideoChat = async () => {
      localStreamRef.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localVideoRef.current.srcObject = localStreamRef.current;

      peerConnectionRef.current = new RTCPeerConnection();

      localStreamRef.current.getTracks().forEach((track) => {
        peerConnectionRef.current.addTrack(track, localStreamRef.current);
      });

      // 시그널링을 위한 코드 추가 필요 (예: WebSocket 또는 다른 방법)
      // offer와 answer를 생성하고 교환하는 과정이 필요합니다.
    };

    startVideoChat();

    // 컴포넌트가 언마운트 될 때 스트림을 종료합니다.
    return () => {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      peerConnectionRef.current.close();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-[65vw] h-[100vh] bg-blue-50">
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );
};

export default LiveCam;
