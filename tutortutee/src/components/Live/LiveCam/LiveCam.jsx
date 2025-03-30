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
      console.log("신호 서버에 연결됨");
    };

    socketRef.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      console.log(data);

      if (data.type === "new_member" && hostInfo.memberNum !== memberNum) {
        if (!peerConnectionRef.current) {
          peerConnectionRef.current = new RTCPeerConnection();
          localStreamRef.current.getTracks().forEach((track) => {
            peerConnectionRef.current.addTrack(track, localStreamRef.current);
          });
        }

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
        if (hostMemberNum === memberNum) {
          socketRef.current.send(
            JSON.stringify({
              type: "create_room",
              candidate: event.candidate,
              roomId,
            })
          );
        } else {
          socketRef.current.send(
            JSON.stringify({
              type: "join_room",
              candidate: event.candidate,
              roomId,
            })
          );
        }
      };

      if (hostMemberNum === memberNum) {
        console.log("Offer 전송");
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
  }, [roomId, hostInfo, memberNum, hostMemberNum]);

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
