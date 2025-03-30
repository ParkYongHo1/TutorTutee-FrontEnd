import { useState, useRef, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ChatInput from "./ChatInput";

const LiveChatList = ({ messages, onSendMessage, me }) => {
  const [previewImage, setPreviewImage] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "오후" : "오전";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${ampm} ${formattedHours}:${formattedMinutes}`;
  };
  console.log(messages);

  return (
    <div className="flex flex-col w-full h-full border bg-white rounded-lg shadow-md">
      <div className="flex-grow overflow-auto p-3 border-b space-y-1">
        {messages.map((msg, index) => {
          const prevMsg = messages[index - 1];
          const nextMsg = messages[index + 1];

          const isFirstInGroup =
            !prevMsg ||
            prevMsg.nickname !== msg.nickname ||
            prevMsg.sendTime !== msg.sendTime;
          const isLastInGroup =
            !nextMsg ||
            nextMsg.nickname !== msg.nickname ||
            nextMsg.sendTime !== msg.sendTime;

          if (msg.type === "TYPE_IN" || msg.type === "TYPE_OUT") {
            return (
              <div key={index} className="flex justify-center py-4">
                <span className="block text-center text-xs text-gray-500 bg-gray-50 rounded-lg py-1 w-[60%]">
                  {msg.content}
                </span>
              </div>
            );
          }

          return (
            <div
              key={index}
              className={`flex ${
                msg.nickname === me.nickname ? "justify-end" : "items-start"
              } ${isLastInGroup ? "pb-2" : ""} ${
                isFirstInGroup ? "pt-2" : ""
              } space-x-2`}
            >
              {msg.nickname !== me.nickname && (
                <div
                  className={`w-8 ${isFirstInGroup ? "visible" : "invisible"}`}
                >
                  {isFirstInGroup && (
                    <LazyLoadImage
                      src={
                        msg.profileImg
                          ? msg.profileImg
                          : `${process.env.PUBLIC_URL}/image/default/profile.svg`
                      }
                      alt="프로필"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                </div>
              )}

              <div className="flex flex-col">
                {msg.nickname !== me.nickname && isFirstInGroup && (
                  <span className="text-xs text-gray-500 font-semibold mb-1">
                    {msg.nickname}
                  </span>
                )}

                <div className="flex items-end">
                  {msg.nickname === me.nickname && isLastInGroup && (
                    <span className="text-xs text-gray-400 mr-2">
                      {formatTime(msg.sendTime)}
                    </span>
                  )}

                  {msg.type === "TYPE_TEXT" ? (
                    <div
                      className={`p-2 rounded-lg max-w-xs ${
                        msg.nickname === me.nickname
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
                      onClick={() => setPreviewImage(msg.content)}
                    />
                  )}

                  {msg.nickname !== me.nickname && isLastInGroup && (
                    <span className="text-xs text-gray-400 ml-2">
                      {formatTime(msg.sendTime)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef}></div>
      </div>

      <ChatInput onSendMessage={onSendMessage} />

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
