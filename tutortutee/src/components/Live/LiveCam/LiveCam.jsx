import React, { useEffect, useRef } from "react";
import SockJS from "sockjs-client"; // SockJS 클라이언트
import { useSelector } from "react-redux";

const LiveCam = ({ roomId, hostInfo }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const socketRef = useRef(null);
  const memberNum = useSelector((state) => state.member.member.memberNum);

  useEffect(() => {
    socketRef.current = new SockJS("https://tutor-tutee.shop/signaling");

    const startVideoChat = async () => {
      localStreamRef.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }

      peerConnectionRef.current = new RTCPeerConnection();

      localStreamRef.current.getTracks().forEach((track) => {
        peerConnectionRef.current.addTrack(track, localStreamRef.current);
      });

      peerConnectionRef.current.onicecandidate = (event) => {
        console.log("teset");

        if (event.candidate) {
          const messageType =
            hostInfo.memberNum === memberNum ? "create_room" : "join_room";
          socketRef.current.send(
            JSON.stringify({
              type: messageType,
              candidate: event.candidate,
              roomId,
            })
          );
        }
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

      peerConnectionRef.current.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };
    };

    startVideoChat();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      socketRef.current.close();
    };
  }, [roomId, hostInfo, memberNum]);

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
        style={{ width: "10%", height: "auto" }}
      />
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        style={{ width: "10%", height: "auto" }}
      />
    </div>
  );
};

export default LiveCam;
