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
    console.log("컴포넌트가 마운트됨");

    socketRef.current = new SockJS("https://tutor-tutee.shop/signaling");

    socketRef.current.onopen = () => {
      console.log("신호 서버에 연결됨");
    };

    socketRef.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      console.log("서버로부터 받은 메시지:", data);

      // 새로운 참여자가 방에 들어올 때
      if (data.type === "new_member") {
        console.log("새로운 참여자가 방에 들어옴:", memberNum);
        if (!peerConnectionRef.current) {
          peerConnectionRef.current = new RTCPeerConnection();
          console.log("새로운 RTCPeerConnection 생성됨");

          // ICE Candidate 처리
          peerConnectionRef.current.onicecandidate = (event) => {
            if (event.candidate) {
              socketRef.current.send(
                JSON.stringify({
                  type: "icecandidate",
                  candidate: event.candidate,
                  roomId,
                })
              );
            }
          };

          // ontrack 이벤트 핸들러 설정
          peerConnectionRef.current.ontrack = (event) => {
            if (event.streams && event.streams[0]) {
              remoteVideoRef.current.srcObject = event.streams[0];
              console.log("원격 비디오 스트림 설정됨");
            }
          };
        }
      }

      // 생성자의 Offer 수신
      if (data.type === "offer") {
        console.log("Offer 수신됨:", data.offer);
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(data.offer)
        );

        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        console.log("답변 전송됨:", answer);
        socketRef.current.send(
          JSON.stringify({
            type: "answer",
            answer,
            roomId,
          })
        );
      }

      // ICE Candidate 처리
      if (data.type === "icecandidate" && data.candidate) {
        const candidate = new RTCIceCandidate(data.candidate);
        await peerConnectionRef.current.addIceCandidate(candidate);
        console.log("ICE Candidate 추가됨:", candidate);
      }
    };

    const startVideoChat = async () => {
      console.log("hostMemberNum:", hostMemberNum, "memberNum:", memberNum);

      // 방 생성자일 경우
      if (hostMemberNum === memberNum) {
        console.log("방 생성자의 비디오 스트림 요청 중...");
        try {
          localStreamRef.current = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

          if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStreamRef.current; // 자신의 비디오 설정
            console.log("로컬 비디오 스트림 설정됨");
          }

          peerConnectionRef.current = new RTCPeerConnection();
          localStreamRef.current.getTracks().forEach((track) => {
            peerConnectionRef.current.addTrack(track, localStreamRef.current);
            console.log("로컬 트랙 추가됨:", track);
          });

          console.log("Offer 생성 중...");
          const offer = await peerConnectionRef.current.createOffer();
          await peerConnectionRef.current.setLocalDescription(offer);
          console.log("Offer 전송됨:", offer);
          socketRef.current.send(
            JSON.stringify({
              type: "offer",
              offer,
              roomId,
            })
          );
        } catch (error) {
          console.error("getUserMedia 호출 실패:", error);
        }
      }
    };

    // 비디오 채팅 시작
    startVideoChat();

    return () => {
      console.log("정리 중...");
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        console.log("로컬 스트림 정리됨");
      }
      socketRef.current.close();
      console.log("소켓 연결 종료됨");
    };
  }, [roomId, hostInfo, memberNum, hostMemberNum]);

  return (
    <div className="flex flex-col items-center justify-center w-[65vw] h-[100vh] bg-blue-50">
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        style={{ width: "100%", height: "auto" }}
      />
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );
};

export default LiveCam;
