import { useState, useRef, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const maxHeight = 120;
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(
        scrollHeight,
        maxHeight
      )}px`;
      textareaRef.current.style.overflowY =
        scrollHeight > maxHeight ? "auto" : "hidden";
    }
  }, [message]);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validMimeTypes = ["image/png", "image/jpeg", "image/svg+xml"];
    if (!validMimeTypes.includes(file.type)) {
      alert("이미지 파일만 업로드 가능합니다. (png, jpg/jpeg, svg)");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      onSendMessage(null, reader.result);
    };
  };

  return (
    <div className="p-3">
      <div className="relative flex items-center bg-gray-100 p-2 rounded-lg">
        <button
          className="mr-2 transition-opacity cursor-pointer hover:opacity-60"
          onClick={() => fileInputRef.current.click()}
        >
          <LazyLoadImage
            src={`${process.env.PUBLIC_URL}/image/live/upload.svg`}
            alt="업로드 버튼"
            className="w-8 h-8 object-cover rounded-full opacity-70"
          />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/png, image/jpeg, image/svg+xml"
          onChange={handleFileChange}
        />

        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full max-h-32 resize-none border p-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="메시지를 입력하세요..."
          rows="1"
        />

        <button
          className={`ml-3 mr-1 transition-opacity ${
            message.trim() ? "cursor-pointer hover:opacity-60" : "opacity-70"
          }`}
          onClick={handleSendMessage}
          disabled={!message.trim()}
        >
          <LazyLoadImage
            src={`${process.env.PUBLIC_URL}/image/live/${
              message.trim() ? "send_able.svg" : "send_disable.svg"
            }`}
            alt="전송 버튼"
            className="w-6 h-6 object-cover"
          />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
