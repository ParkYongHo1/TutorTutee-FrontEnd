import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { useSelector } from "react-redux";

const LiveCam = ({ roomId, hostInfo, hostMemberNum }) => {
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const audioStreamRef = useRef(null);
  const socketRef = useRef(null);
  const memberNum = useSelector((state) => state.member.member.memberNum);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("연결 중...");
  const isHost = hostMemberNum === memberNum;
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [screenShareActive, setScreenShareActive] = useState(false);

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
      // 오디오 스트림 해제
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
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
          // 화면 공유가 활성화되지 않았으면 다시 시도
          if (!screenShareActive) {
            await startScreenShare();
          }
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
      iceServers: [
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        {
          urls: "turn:openrelay.metered.ca:80",
          username: "openrelayproject",
          credential: "openrelayproject",
        },
      ],
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
                  // 자동 재생 정책으로 인한 실패일 수 있음
                  // 사용자 인터랙션 후 다시 시도
                  const playOnInteraction = () => {
                    remoteVideoRef.current.play().catch(console.error);
                    document.removeEventListener("click", playOnInteraction);
                  };
                  document.addEventListener("click", playOnInteraction);
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

        // 연결이 끊어졌을 때 재연결 시도
        if (
          peerConnectionRef.current.connectionState === "disconnected" ||
          peerConnectionRef.current.connectionState === "failed"
        ) {
          if (isHost) {
            console.log("연결이 끊어졌습니다. 재연결 시도...");
            setTimeout(() => {
              startScreenShare().then(() => createAndSendOffer());
            }, 2000);
          }
        }
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

      // 이미 존재하는 트랙 제거
      if (peerConnectionRef.current) {
        const senders = peerConnectionRef.current.getSenders();
        senders.forEach((sender) => {
          peerConnectionRef.current.removeTrack(sender);
        });
      }

      // 화면 공유 미디어 스트림 획득
      const displayMediaOptions = {
        video: {
          cursor: "always",
          displaySurface: "monitor",
        },
        audio: true, // 시스템 오디오 캡처 시도
      };

      // 화면 공유 미디어 스트림 획득
      const displayStream = await navigator.mediaDevices.getDisplayMedia(
        displayMediaOptions
      );

      // 이전 스트림 정리
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      localStreamRef.current = displayStream;
      console.log("화면 공유 스트림 획득됨:", displayStream);
      setScreenShareActive(true);

      // 화면 공유가 중지될 때 이벤트 처리
      displayStream.getVideoTracks()[0].addEventListener("ended", () => {
        console.log("화면 공유가 중지되었습니다.");
        setScreenShareActive(false);
        setConnectionStatus("화면 공유 중지됨");

        // 다시 시작할 수 있는 UI 표시 등의 작업 가능
      });

      // 오디오 처리를 위한 추가 확인
      const hasAudioTrack = displayStream.getAudioTracks().length > 0;
      console.log("화면 공유에 오디오 트랙이 있나요?", hasAudioTrack);

      // 화면 공유 트랙을 피어 연결에 추가
      displayStream.getTracks().forEach((track) => {
        peerConnectionRef.current.addTrack(track, displayStream);
        console.log("화면 공유 트랙 추가됨:", track.kind, track.label);
      });

      if (!hasAudioTrack && audioEnabled) {
        try {
          // 시스템 오디오가 없는 경우 마이크 오디오 추가
          console.log("시스템 오디오가 없습니다. 마이크 오디오 시도...");

          // 이전 오디오 스트림 정리
          if (audioStreamRef.current) {
            audioStreamRef.current.getTracks().forEach((track) => track.stop());
          }

          const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
          });
          audioStreamRef.current = audioStream;

          // 오디오 트랙을 피어 연결에 추가
          audioStream.getAudioTracks().forEach((track) => {
            peerConnectionRef.current.addTrack(track, audioStream);
            console.log("마이크 오디오 트랙 추가됨:", track.kind, track.label);
          });
        } catch (audioError) {
          console.error("마이크 오디오 획득 실패:", audioError);
        }
      }

      // 생성자는 자신의 화면 공유 비디오를 큰 화면에도 표시
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = displayStream;
        console.log("생성자: 화면 공유 스트림 설정됨");
        setConnectionStatus("화면 공유 중");
      }

      return true;
    } catch (error) {
      console.error("화면 공유 실패:", error);
      setConnectionStatus("화면 공유 실패: " + error.message);
      setScreenShareActive(false);
      return false;
    }
  };

  // 오디오 토글 함수
  const toggleAudio = async () => {
    try {
      const newAudioState = !audioEnabled;
      setAudioEnabled(newAudioState);
      console.log("오디오 상태 변경:", newAudioState ? "켜짐" : "꺼짐");

      // 기존 오디오 트랙 처리
      if (audioStreamRef.current) {
        audioStreamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = newAudioState;
          console.log(
            `기존 마이크 트랙 ${newAudioState ? "활성화" : "비활성화"}:`,
            track.label
          );
        });
      }

      // 화면 공유의 오디오 트랙 처리
      if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = newAudioState;
          console.log(
            `화면 공유 오디오 트랙 ${newAudioState ? "활성화" : "비활성화"}:`,
            track.label
          );
        });
      }

      // 오디오 없는 경우 새로 생성
      if (
        newAudioState &&
        !audioStreamRef.current &&
        !localStreamRef.current?.getAudioTracks().length
      ) {
        console.log("오디오 스트림 새로 생성 시도");
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        audioStreamRef.current = audioStream;

        // 오디오 트랙을 추가
        audioStream.getAudioTracks().forEach((track) => {
          peerConnectionRef.current.addTrack(track, audioStream);
          console.log("새 오디오 트랙 추가됨:", track.kind, track.label);
        });

        // 재협상 시작
        await createAndSendOffer();
      }
    } catch (error) {
      console.error("오디오 토글 실패:", error);
      setConnectionStatus(
        `오디오 ${audioEnabled ? "활성화" : "비활성화"} 실패: ${error.message}`
      );
    }
  };

  // 화면 공유 재시작 함수
  const restartScreenShare = async () => {
    if (!isHost) return;

    setConnectionStatus("화면 공유 재시작 중...");
    const success = await startScreenShare();
    if (success) {
      await createAndSendOffer();
    }
  };

  // Offer 생성 및 전송 함수
  const createAndSendOffer = async () => {
    try {
      console.log("Offer 생성 시작");
      const offer = await peerConnectionRef.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
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
      return true;
    } catch (error) {
      console.error("Offer 생성 중 오류:", error);
      setConnectionStatus("Offer 생성 실패: " + error.message);
      return false;
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

        {/* 컨트롤 패널 (호스트만 표시) */}
        {isHost && (
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white p-3 rounded flex items-center space-x-4">
            {/* 오디오 토글 버튼 */}
            <button
              onClick={toggleAudio}
              className={`flex items-center justify-center p-2 rounded-full ${
                audioEnabled
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {audioEnabled ? "오디오 켜짐" : "오디오 꺼짐"}
            </button>

            {/* 화면 공유 재시작 버튼 */}
            {!screenShareActive && (
              <button
                onClick={restartScreenShare}
                className="flex items-center justify-center p-2 rounded-full bg-blue-500 hover:bg-blue-600"
              >
                화면 공유 시작
              </button>
            )}
          </div>
        )}

        {/* 연결 상태 정보 */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-2 rounded">
          {connectionStatus}
        </div>

        {/* 자동 재생 메시지 (참여자만 표시) */}
        {!isHost && (
          <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-2 rounded">
            화면이 보이지 않으면 화면을 클릭하세요
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveCam;
