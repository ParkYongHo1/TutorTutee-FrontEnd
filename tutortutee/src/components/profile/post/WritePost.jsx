import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const WritePost = () => {
  const [content, setContent] = useState("");

  const handleInputChange = (value) => {
    const cleanValue = value.replace(/<[^>]*>/g, "");
    setContent(cleanValue);
  };

  const handleSubmit = () => {
    console.log("게시글 내용:", content);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white">
      <div className="text-2xl font-bold mb-4">공지글 작성</div>
      <hr className="mb-4" />
      <p className="my-4 font-semibold text-lg">공지글 내용</p>
      <ReactQuill
        className="h-[500px]"
        value={content}
        onChange={handleInputChange}
        placeholder="공지글 내용을 작성해주세요"
        modules={{
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            ["clean"],
          ],
        }}
      />
      <button
        className={`${
          content.length < 1 ? "bg-gray-200 cursor-not-allowed" : "bg-blue-500"
        } text-white mt-[60px] h-[60px] w-full font-semibold`}
        onClick={handleSubmit}
        disabled={content.length < 1}
      >
        공지글 작성
      </button>
    </div>
  );
};

export default WritePost;
