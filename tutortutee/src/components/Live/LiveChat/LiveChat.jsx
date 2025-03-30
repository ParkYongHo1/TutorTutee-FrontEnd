import { useEffect, useState, useRef } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { loadMember } from "../../../services/roomServices";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import MemberModal from "../../modal/MemberModal";
import LiveChatList from "./LiveChatList";
import { Client, Stomp } from "@stomp/stompjs";
import { chattingList } from "../../../services/liveServices";
import * as SockJS from "sockjs-client";
import axios from "axios";

const LiveChat = ({ roomId, isOff, setIsOff }) => {
  const access = useSelector((state) => state.member.access);
  const me = useSelector((state) => state.member.member);
  const [liveMember, setLiveMember] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hostInfo, setHostInfo] = useState({});
  const [messages, setMessages] = useState([]); // 채팅 메시지 상태 추가
  const stompClientRef = useRef(null); // STOMP 클라이언트 관리

  useEffect(() => {
    if (!stompClientRef.current) {
      const socket = new SockJS("https://tutor-tutee.shop/chattings");
      const stompClient = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${access}`,
        },
        onConnect: (frame) => {
          stompClient.subscribe(
            `/sub/${roomId}`,
            (messageOutput) => {
              const newMessage = JSON.parse(messageOutput.body);

              setMessages((prevMessages) => {
                if (newMessage.type === "TYPE_IN") {
                  const hasJoinMessage = prevMessages.some(
                    (msg) =>
                      msg.type === "TYPE_IN" &&
                      msg.nickname === newMessage.nickname
                  );
                  return hasJoinMessage
                    ? prevMessages
                    : [...prevMessages, newMessage];
                }
                return [...prevMessages, newMessage];
              });
            },
            { Authorization: `Bearer ${access}` }
          );

          stompClientRef.current = stompClient;
        },
      });

      stompClient.activate();
    }

    fetchMessages();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
      }
    };
  }, [roomId]);

  // 기존 채팅 메시지 로딩 (API 호출)
  const fetchMessages = async () => {
    try {
      const response = await chattingList(access, roomId);

      setMessages((prevMessages) => {
        const newMessages = response.data.chattingList.filter((newMsg) => {
          if (newMsg.type === "TYPE_IN" || newMsg.type === "TYPE_OUT") {
            return !prevMessages.some(
              (msg) =>
                msg.nickname === newMsg.nickname && msg.type === newMsg.type
            );
          }
          return true;
        });

        return [...prevMessages, ...newMessages];
      });
      console.log(messages);
    } catch (error) {
      console.log("채팅 메시지 불러오기 실패", error);
    }
  };

  // 메시지 전송 함수
  const sendMessage = async (formData) => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      try {
        // 이미지 업로드
        const imageResponse = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/chattings/image`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${access}`,
            },
          }
        );

        // 이미지 URL을 포함한 메시지 전송
        const messageObj = {
          roomId: roomId,
          nickname: me.nickname,
          content: formData.get("message"), // 메시지 텍스트
          imageUrl: imageResponse.data.imageUrl, // 업로드된 이미지 URL
          profileImg: me.profileImg,
          type: imageResponse.data.imageUrl ? "TYPE_IMG" : "TYPE_TEXT",
        };

        stompClientRef.current.publish({
          destination: `/pub/${roomId}/messages`,
          headers: { Authorization: `Bearer ${access}` },
          body: JSON.stringify(messageObj),
        });
      } catch (error) {
        console.error("메시지 전송 실패:", error);
      }
    } else {
      console.error("STOMP 클라이언트가 활성화되지 않음");
    }
  };

  useEffect(() => {
    const loadLiveMember = async () => {
      try {
        const response = await loadMember(access, roomId);

        setLiveMember(response.data.participantList);
        setHostInfo(response.data.participantList[0]);
      } catch (error) {
        console.log(error);
      }
    };
    loadLiveMember();
  }, [access, roomId]);

  const handleMemberModal = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (event.target.closest(".dropdown")) return;
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleChangeInitStatus = (memberNum) => {
    setLiveMember((prev) => {
      prev.map((member) =>
        member.memberNum === memberNum
          ? { ...member, initStatus: !member.initStatus }
          : member
      );
    });
  };

  return (
    <div className="flex flex-col w-[35vw] h-[100vh] px-3">
      <div className="min-h-[10vh] flex justify-between items-center">
        <div className="flex justify-between gap-[15px] items-center">
          <div className="w-[80px] h-[80px] ">
            <LazyLoadImage
              src={`${process.env.PUBLIC_URL}/image/default/profile.svg`}
              alt="프로필"
              className="w-full h-full object-cover fill border rounded-[10%]"
              width={80}
              height={80}
            />
          </div>
          <div>
            <div>
              <p className="text-lg text-blue--500 font-bold">
                {hostInfo.nickname}&nbsp;
                <span className="text-lg text-black font-semibold">
                  님의 LIVE
                </span>
              </p>
            </div>
            <div className=" relative dropdown flex gap-[8px] items-center font-bold w-[30px] h-[30px]">
              <LazyLoadImage
                src={`${process.env.PUBLIC_URL}/image/live/people.svg`}
                alt="프로필"
                className="w-full h-full object-cover fill cursor-pointer"
                width={30}
                height={30}
                onClick={handleMemberModal}
              />
              <p>{liveMember.length}</p>
              {isDropdownOpen && (
                <MemberModal
                  liveMember={liveMember}
                  hostInfo={hostInfo}
                  roomId={roomId}
                  setIsOff={setIsOff}
                  onUpdate={handleChangeInitStatus}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="min-h-[90vh]">
        <LiveChatList messages={messages} onSendMessage={sendMessage} me={me} />
      </div>
    </div>
  );
};

export default LiveChat;
