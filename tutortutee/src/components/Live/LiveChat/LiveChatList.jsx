import { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ChatInput from "./ChatInput";

const LiveChatList = () => {
  const [messages, setMessages] = useState([
    {
      nickname: "anyanyanyany",
      content: "님이 방에 참여했습니다.",
      type: "TYPE_IN",
      time: "오전 9:24",
    },
    {
      nickname: "jay.x",
      content: "안녕하세요, 회의 시작할게요!",
      type: "TYPE_TEXT",
      time: "오전 9:24",
    },
    {
      nickname: "jay.x",
      content: "안녕하세요, 회의 시작할게요!",
      type: "TYPE_TEXT",
      time: "오전 9:24",
    },
    {
      nickname: "anyanyanyany",
      content: "싫어요",
      type: "TYPE_TEXT",
      time: "오전 9:24",
    },
    {
      nickname: "anyanyanyany",
      content: "님이 방에서 나갔습니다.",
      type: "TYPE_OUT",
      time: "오전 9:25",
    },
  ]);

  const [previewImage, setPreviewImage] = useState(null);

  const handleSendMessage = (text, imageUrl) => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "오후" : "오전";
    const formattedTime = `${ampm} ${hours % 12 || 12}:${minutes
      .toString()
      .padStart(2, "0")}`;

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        nickname: "me",
        content: text || "",
        imageUrl: imageUrl || "",
        type: text ? "TYPE_TEXT" : "TYPE_IMG",
        time: formattedTime,
      },
    ]);
  };

  return (
    <div className="flex flex-col w-full h-full border bg-white rounded-lg shadow-md">
      <div className="flex-grow overflow-auto p-3 border-b space-y-1">
        {messages.map((msg, index) => {
          const prevMsg = messages[index - 1];
          const nextMsg = messages[index + 1];

          const isFirstInGroup =
            !prevMsg ||
            prevMsg.nickname !== msg.nickname ||
            prevMsg.time !== msg.time;
          const isLastInGroup =
            !nextMsg ||
            nextMsg.nickname !== msg.nickname ||
            nextMsg.time !== msg.time;

          if (msg.type === "TYPE_IN" || msg.type === "TYPE_OUT") {
            return (
              <div key={index} className="flex justify-center py-4">
                <span className="block text-center text-xs text-gray-500 bg-gray-50 rounded-lg py-1 w-[60%]">
                  <span className="font-semibold">{msg.nickname}</span>
                  {msg.content}
                </span>
              </div>
            );
          }

          return (
            <div
              key={index}
              className={`flex ${
                msg.nickname === "me" ? "justify-end" : "items-start"
              } ${isLastInGroup ? "pb-2" : ""} ${
                isFirstInGroup ? "pt-2" : ""
              } space-x-2`}
            >
              {msg.nickname !== "me" && (
                <div
                  className={`w-8 ${isFirstInGroup ? "visible" : "invisible"}`}
                >
                  {isFirstInGroup && (
                    <LazyLoadImage
                      src={`${process.env.PUBLIC_URL}/image/default/profile.svg`}
                      alt="프로필"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                </div>
              )}

              <div className="flex flex-col">
                {msg.nickname !== "me" && isFirstInGroup && (
                  <span className="text-xs text-gray-500 font-semibold mb-1">
                    {msg.nickname}
                  </span>
                )}

                <div className="flex items-end">
                  {msg.nickname === "me" && isLastInGroup && (
                    <span className="text-xs text-gray-400 mr-2">
                      {msg.time}
                    </span>
                  )}

                  {msg.type === "TYPE_TEXT" ? (
                    <div
                      className={`p-2 rounded-lg max-w-xs ${
                        msg.nickname === "me"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-black"
                      } whitespace-pre-wrap`}
                    >
                      {msg.content}
                    </div>
                  ) : (
                    <LazyLoadImage
                      src={msg.imageUrl}
                      alt="업로드된 이미지"
                      className="w-32 h-32 object-cover rounded-lg cursor-pointer"
                      onClick={() => setPreviewImage(msg.imageUrl)}
                    />
                  )}

                  {msg.nickname !== "me" && isLastInGroup && (
                    <span className="text-xs text-gray-400 ml-2">
                      {msg.time}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ChatInput onSendMessage={handleSendMessage} />

      {previewImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="확대된 이미지"
            className="max-w-full max-h-full rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default LiveChatList;
