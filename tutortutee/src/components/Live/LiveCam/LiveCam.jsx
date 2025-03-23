import React, { useEffect, useRef } from "react";
import SockJS from "sockjs-client"; // SockJS 클라이언트
import { useSelector } from "react-redux";

const LiveCam = ({ roomId, hostInfo }) => {
  const localVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const access = useSelector((state) => state.member.access);
  const socketRef = useRef(null);
  const memberNum = useSelector((state) => state.member.member.memberNum);
  useEffect(() => {
    socketRef.current = new SockJS("https://tutor-tutee.shop/signaling");

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
      if (hostInfo.memberNum === memberNum) {
        peerConnectionRef.current.onicecandidate = (event) => {
          if (event.candidate) {
            socketRef.current.send(
              JSON.stringify({
                type: "create_room",
                candidate: event.candidate,
                roomId,
              })
            );
          }
        };
      } else {
        peerConnectionRef.current.onicecandidate = (event) => {
          if (event.candidate) {
            socketRef.current.send(
              JSON.stringify({
                type: "join_room",
                candidate: event.candidate,
                roomId,
              })
            );
          }
        };
      }

      peerConnectionRef.current.ontrack = (event) => {
        const remoteVideo = document.createElement("video");
        remoteVideo.srcObject = event.streams[0];
        remoteVideo.autoplay = true;
        remoteVideo.playsInline = true;
        document.body.append(remoteVideo);
      };

      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      socketRef.current.send(
        JSON.stringify({
          type: "offer",
          offer,
          roomId,
        })
      );
    };

    startVideoChat();

    return () => {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      peerConnectionRef.current.close();
      socketRef.current.close();
    };
  }, [roomId]);

  useEffect(() => {
    socketRef.current.onopen = () => {
      console.log("Connected to signaling server");
    };

    socketRef.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "offer") {
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(data.offer)
        );
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        socketRef.current.send(
          JSON.stringify({
            type: "answer",
            answer,
            roomId,
          })
        );
      }

      if (data.type === "icecandidate" && data.candidate) {
        const candidate = new RTCIceCandidate(data.candidate);
        peerConnectionRef.current.addIceCandidate(candidate);
      }
    };

    return () => {
      socketRef.current.onmessage = null;
    };
  }, [roomId]);

  return (
    <div className="flex flex-col items-center justify-center w-[65vw] h-[100vh] bg-blue-50">
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        style={{ width: "1%", height: "auto" }}
      />
    </div>
  );
};

export default LiveCam;
