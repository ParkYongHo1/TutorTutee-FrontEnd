import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { useSelector } from "react-redux";

const LiveCam = ({ roomId, hostInfo, hostMemberNum }) => {
  const remoteVideoRef = useRef(null);
  const localVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const socketRef = useRef(null);
  const memberNum = useSelector((state) => state.member.member.memberNum);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("연결 중...");
  const isHost = hostMemberNum === memberNum;
  const [showCamera, setShowCamera] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [isBroadcastEnded, setIsBroadcastEnded] = useState(false);
  useEffect(() => {
    console.log("컴포넌트가 마운트됨");

    // 소켓 연결 및 PeerConnection 생성
    const connectAndSetup = async () => {
      try {
        // 소켓 연결
        socketRef.current = new SockJS("https://tutor-tutee.shop/signaling");

        // PeerConnection 생성
        await createPeerConnection();

        // 소켓 이벤트 핸들러 설정
        setupSocketHandlers();
      } catch (error) {
        console.error("초기 설정 중 오류 발생:", error);
        setConnectionStatus("연결 실패: " + error.message);
      }
    };

    connectAndSetup();

    return () => {
      console.log("정리 중...");
      // 미디어 스트림 해제
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      // 카메라 스트림 해제
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
      // 피어 연결 종료
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      // 소켓 연결 종료
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [roomId, hostInfo, memberNum, hostMemberNum, isHost]);

  // 소켓 이벤트 핸들러 설정 함수
  const setupSocketHandlers = () => {
    socketRef.current.onopen = () => {
      console.log("신호 서버에 연결됨");
      setIsConnected(true);
      setConnectionStatus("서버에 연결됨");
      console.log("방 ID:", roomId);
      console.log("호스트 번호:", hostMemberNum);

      // 방 생성자인 경우
      if (isHost) {
        console.log("방 생성자입니다");
        socketRef.current.send(
          JSON.stringify({
            type: "create_room",
            roomId,
          })
        );
        // 방 생성시 바로 화면 공유 시작
        startScreenShare();
      } else {
        // 참여자인 경우
        console.log("참여자입니다");
        socketRef.current.send(
          JSON.stringify({
            type: "join_room",
            roomId,
          })
        );
        setConnectionStatus("방에 참여 요청 전송됨");
      }
    };

    socketRef.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      console.log("서버로부터 받은 메시지:", data);

      // 새로운 참여자가 방에 들어올 때
      if (data.type === "new_member") {
        console.log("새로운 참여자가 방에 들어옴");
        setConnectionStatus("새 참여자 감지됨");

        // 방 생성자인 경우 Offer 생성 시작
        if (isHost) {
          await createAndSendOffer(); // Offer 생성 및 전송
        }
      }

      // Offer 수신 (참여자)
      if (data.type === "offer") {
        console.log("Offer 수신됨:", data.offer);
        setConnectionStatus("Offer 수신됨, Answer 생성 중...");

        try {
          // 원격 설명 설정 (Offer)
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(data.offer)
          );
          // Answer 생성
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          // Answer 전송
          sendMessage({
            type: "answer",
            roomId,
            answer,
          });
          console.log("Answer 전송됨:", answer);
          setConnectionStatus("Answer 전송됨, 연결 대기 중...");
        } catch (error) {
          console.error("Offer 처리 중 오류:", error);
          setConnectionStatus("Offer 처리 실패: " + error.message);
        }
      }

      // Answer 수신 (방 생성자)
      if (data.type === "answer") {
        console.log("Answer 수신됨:", data.answer);
        setConnectionStatus("Answer 수신됨, 연결 완료 중...");

        try {
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(data.answer)
          );
          setConnectionStatus("P2P 연결 설정 완료");
        } catch (error) {
          console.error("Answer 처리 중 오류:", error);
          setConnectionStatus("Answer 처리 실패: " + error.message);
        }
      }

      // ICE Candidate 처리
      if (data.type === "candidate" && data.candidate) {
        try {
          const candidate = new RTCIceCandidate(data.candidate);
          await peerConnectionRef.current.addIceCandidate(candidate);
          console.log("ICE Candidate 추가됨");
        } catch (error) {
          console.error("ICE Candidate 추가 중 오류:", error);
          setConnectionStatus("ICE Candidate 추가 실패");
        }
      }

      if (data.type === "leave") {
        console.log("방송이 종료되었습니다");
        setConnectionStatus("방송이 종료되었습니다");

        // 비디오 스트림 제거하여 검은 화면 표시
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = null;
        }

        // 연결 정리
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach((track) => track.stop());
        }
        if (cameraStream) {
          cameraStream.getTracks().forEach((track) => track.stop());
        }
        if (peerConnectionRef.current) {
          peerConnectionRef.current.close();
        }

        // 종료 메시지 표시 상태 설정
        setIsBroadcastEnded(true);
      }
    };

    socketRef.current.onerror = (error) => {
      console.error("소켓 오류:", error);
      setConnectionStatus("서버 연결 오류");
      setIsConnected(false);
    };
  };

  // PeerConnection 생성 함수
  const createPeerConnection = async () => {
    const configuration = {
      iceServers: [{ urls: "stun:stun1.l.google.com:19302" }],
    };

    try {
      peerConnectionRef.current = new RTCPeerConnection(configuration);
      console.log("새로운 RTCPeerConnection 생성됨");

      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          sendMessage({
            type: "candidate",
            roomId,
            candidate: event.candidate,
          });
          console.log("ICE candidate 전송됨");
        }
      };

      peerConnectionRef.current.ontrack = (event) => {
        console.log("ontrack 이벤트 발생:", event);
        if (event.streams && event.streams[0]) {
          console.log("원격 스트림 수신됨:", event.streams[0]);

          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
            console.log("원격 비디오 스트림 설정됨");
            setConnectionStatus("원격 비디오 스트림 수신 중");

            // 디버깅을 위한 이벤트 리스너 추가
            remoteVideoRef.current.onloadedmetadata = () => {
              console.log("원격 비디오 메타데이터 로드됨");
              remoteVideoRef.current
                .play()
                .then(() => {
                  console.log("비디오 재생 시작됨");
                  setConnectionStatus("스트리밍 중");
                })
                .catch((e) => {
                  console.error("비디오 재생 실패:", e);
                  setConnectionStatus("비디오 재생 실패: " + e.message);
                });
            };
          } else {
            console.error("remoteVideoRef가 null입니다");
            setConnectionStatus("비디오 요소 없음");
          }
        } else {
          console.warn("스트림이 없는 track 이벤트 발생");
          setConnectionStatus("빈 스트림 수신됨");
        }
      };

      peerConnectionRef.current.onconnectionstatechange = (event) => {
        console.log(
          "연결 상태 변경:",
          peerConnectionRef.current.connectionState
        );
        setConnectionStatus(
          "연결 상태: " + peerConnectionRef.current.connectionState
        );
      };

      peerConnectionRef.current.onicecandidateerror = (event) => {
        console.error("ICE candidate 오류:", event);
      };

      peerConnectionRef.current.oniceconnectionstatechange = (event) => {
        console.log(
          "ICE 연결 상태 변경:",
          peerConnectionRef.current.iceConnectionState
        );
      };

      return true;
    } catch (error) {
      console.error("PeerConnection 생성 중 오류:", error);
      setConnectionStatus("PeerConnection 생성 실패");
      return false;
    }
  };

  // 화면 공유 시작 함수 (방 생성자용)
  const startScreenShare = async () => {
    try {
      console.log("화면 공유 시작 시도");
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = displayStream;
      console.log("화면 공유 스트림 획득됨:", displayStream);

      // 생성자는 자신의 화면 공유 비디오를 큰 화면에도 표시
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = displayStream;
        console.log("생성자: 화면 공유 스트림 설정됨");
        setConnectionStatus("화면 공유 중");
      }

      // 트랙을 피어 연결에 추가
      displayStream.getTracks().forEach((track) => {
        const sender = peerConnectionRef.current.addTrack(track, displayStream);
        console.log("화면 공유 트랙 추가됨:", track.kind);
      });
    } catch (error) {
      console.error("화면 공유 실패:", error);
      setConnectionStatus("화면 공유 실패: " + error.message);
    }
  };

  // 웹캠 시작 함수
  const startCamera = async () => {
    try {
      console.log("카메라 시작 시도");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false, // 오디오는 화면 공유에서만 사용
      });

      setCameraStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        console.log("카메라 스트림 설정됨");
      }

      setCameraEnabled(true);

      // 호스트인 경우 화면 공유와 카메라 전환
      if (isHost && showCamera) {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;

          // 기존 화면 공유 트랙 제거
          if (peerConnectionRef.current && localStreamRef.current) {
            const senders = peerConnectionRef.current.getSenders();
            senders.forEach((sender) => {
              peerConnectionRef.current.removeTrack(sender);
            });

            // 새 카메라 트랙 추가
            stream.getTracks().forEach((track) => {
              peerConnectionRef.current.addTrack(track, stream);
            });

            // 재협상 시작
            createAndSendOffer();
          }
        }
      }
    } catch (error) {
      console.error("카메라 시작 실패:", error);
      setConnectionStatus("카메라 시작 실패: " + error.message);
    }
  };

  // 카메라 중지 함수
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => {
        track.stop();
      });

      setCameraEnabled(false);

      // 호스트인 경우 화면 공유로 다시 전환
      if (isHost && !showCamera) {
        if (remoteVideoRef.current && localStreamRef.current) {
          remoteVideoRef.current.srcObject = localStreamRef.current;

          // 기존 카메라 트랙 제거
          const senders = peerConnectionRef.current.getSenders();
          senders.forEach((sender) => {
            peerConnectionRef.current.removeTrack(sender);
          });

          // 화면 공유 트랙 다시 추가
          localStreamRef.current.getTracks().forEach((track) => {
            peerConnectionRef.current.addTrack(track, localStreamRef.current);
          });

          // 재협상 시작
          createAndSendOffer();
        }
      }
    }
  };

  // 화면/카메라 전환 함수 (호스트용)
  const toggleDisplayMode = async () => {
    const newShowCamera = !showCamera;
    setShowCamera(newShowCamera);

    if (newShowCamera) {
      // 카메라 모드로 전환
      if (!cameraEnabled) {
        await startCamera();
      } else if (cameraStream && remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = cameraStream;

        // 기존 화면 공유 트랙 제거
        if (peerConnectionRef.current && localStreamRef.current) {
          const senders = peerConnectionRef.current.getSenders();
          senders.forEach((sender) => {
            peerConnectionRef.current.removeTrack(sender);
          });

          // 새 카메라 트랙 추가
          cameraStream.getTracks().forEach((track) => {
            peerConnectionRef.current.addTrack(track, cameraStream);
          });

          // 재협상 시작
          createAndSendOffer();
        }
      }
    } else {
      // 화면 공유 모드로 전환
      if (remoteVideoRef.current && localStreamRef.current) {
        remoteVideoRef.current.srcObject = localStreamRef.current;

        // 기존 카메라 트랙 제거
        if (peerConnectionRef.current && cameraStream) {
          const senders = peerConnectionRef.current.getSenders();
          senders.forEach((sender) => {
            peerConnectionRef.current.removeTrack(sender);
          });

          // 화면 공유 트랙 다시 추가
          localStreamRef.current.getTracks().forEach((track) => {
            peerConnectionRef.current.addTrack(track, localStreamRef.current);
          });

          // 재협상 시작
          createAndSendOffer();
        }
      }
    }
  };

  // 방송 종료 함수 (호스트용)
  const endBroadcast = () => {
    if (isHost && socketRef.current) {
      sendMessage({
        type: "leave",
        roomId,
      });

      console.log("방송 종료 요청 전송됨");
      setConnectionStatus("방송 종료 중...");

      // 스트림 정리
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    }
  };

  // Offer 생성 및 전송 함수
  const createAndSendOffer = async () => {
    try {
      console.log("Offer 생성 시작");
      const offer = await peerConnectionRef.current.createOffer();
      console.log("Offer 생성됨:", offer);
      await peerConnectionRef.current.setLocalDescription(offer);
      console.log("LocalDescription 설정됨");

      sendMessage({
        type: "offer",
        roomId,
        offer,
      });
      console.log("Offer 전송됨");
      setConnectionStatus("Offer 전송됨, Answer 대기 중...");
    } catch (error) {
      console.error("Offer 생성 중 오류:", error);
      setConnectionStatus("Offer 생성 실패: " + error.message);
    }
  };

  // 메시지 전송 함수 (연결 상태 확인)
  const sendMessage = (message) => {
    if (socketRef.current && socketRef.current.readyState === SockJS.OPEN) {
      socketRef.current.send(JSON.stringify(message));
      return true;
    } else {
      console.warn("소켓이 열려있지 않아 메시지를 보낼 수 없습니다.");
      setConnectionStatus("서버 연결 없음, 메시지 전송 불가");
      return false;
    }
  };

  // 참여자용 카메라 토글 버튼
  const toggleParticipantCamera = async () => {
    if (!cameraEnabled) {
      await startCamera();
    } else {
      stopCamera();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-[65vw] h-[100vh] bg-blue-50">
      <div className="w-full h-full relative">
        {/* 원격 비디오 (전체 화면으로 표시) */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* 로컬 비디오 (참여자용, 오른쪽 하단에 작게 표시) */}
        {!isHost && (
          <div className="absolute bottom-4 right-4 w-1/4 h-1/4">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover rounded-lg border-2 border-white ${
                cameraEnabled ? "block" : "hidden"
              }`}
            />
          </div>
        )}

        {/* 컨트롤 패널 */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 p-2 rounded-lg flex gap-2">
          {/* 호스트: 화면/카메라 전환 버튼 */}
          {isHost && (
            <button
              onClick={toggleDisplayMode}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              {showCamera ? "화면 공유로 전환" : "카메라로 전환"}
            </button>
          )}

          {/* 참여자: 카메라 켜기/끄기 버튼 */}
          {!isHost && (
            <button
              onClick={toggleParticipantCamera}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              {cameraEnabled ? "카메라 끄기" : "카메라 켜기"}
            </button>
          )}

          {/* 호스트: 방송 종료 버튼 */}
          {isHost && (
            <button
              onClick={endBroadcast}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              방송 종료
            </button>
          )}
        </div>

        {/* 연결 상태 디버깅 정보 */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded">
          {connectionStatus}
        </div>
        {/* 방송 종료 메시지 */}
        {isBroadcastEnded && (
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            <div className="text-white text-2xl font-bold">
              방송이 종료되었습니다
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveCam;
