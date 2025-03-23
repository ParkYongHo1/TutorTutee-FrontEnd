import React, { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { useSelector } from "react-redux";

const LiveCam = ({ roomId, hostInfo, hostMemberNum }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const socketRef = useRef(null);
  const memberNum = useSelector((state) => state.member.member.memberNum);
  useEffect(() => {
    socketRef.current = new SockJS("https://tutor-tutee.shop/signaling");

    socketRef.current.onopen = () => {
      console.log("Connected to signaling server");
    };

    socketRef.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      console.log(data);

      if (data.type === "new_member" && hostInfo.memberNum !== memberNum) {
        console.log("참여자");

        // 참여자가 연결될 때 peerConnection이 초기화되었는지 확인
        if (!peerConnectionRef.current) {
          peerConnectionRef.current = new RTCPeerConnection();
          // 로컬 트랙 추가
          localStreamRef.current.getTracks().forEach((track) => {
            peerConnectionRef.current.addTrack(track, localStreamRef.current);
          });
        }

        // Offer 처리
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
        await peerConnectionRef.current.addIceCandidate(candidate);
      }
    };

    // 비디오 채팅 시작
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
        if (event.candidate) {
          const messageType =
            hostMemberNum === memberNum ? "create_room" : "join_room";
          socketRef.current.send(
            JSON.stringify({
              type: messageType,
              candidate: event.candidate,
              roomId,
            })
          );
        }
      };

      if (hostMemberNum === memberNum) {
        console.log("offer send");
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        socketRef.current.send(
          JSON.stringify({
            type: "offer",
            offer,
            roomId,
          })
        );
      }

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
      socketRef.current.close();
    };
  }, [roomId, hostInfo, memberNum]);
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
