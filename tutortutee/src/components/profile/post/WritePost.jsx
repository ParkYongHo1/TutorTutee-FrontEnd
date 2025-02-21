import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // 기본 스타일

const WritePost = () => {
  const [content, setContent] = useState("");
  const maxLength = 300;

  const handleInputChange = (value) => {
    if (value.length <= maxLength) {
      setContent(value);
    }
  };

  const handleSubmit = () => {
    // 게시글 작성 로직을 여기에 추가
    console.log("게시글 내용:", content);
    // 예: API 호출 등
  };

  return (
    <div className="max-w-2xl mx-auto bg-white">
      <div className="text-2xl font-bold mb-4">공지글 작성</div>
      <hr className="mb-4" />
      <p className="my-4 font-semibold text-lg">공지글 내용</p>
      <ReactQuill
        className="h-[150px]"
        value={content}
        onChange={handleInputChange}
        placeholder="300자 이내로 작성해주세요."
        modules={{
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
          ],
        }}
      ></ReactQuill>

      <button
        className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200"
        onClick={handleSubmit}
        disabled={content.length === 0}
      >
        게시글 작성
      </button>
      <div className="mt-6">
        <h2 className="text-xl font-bold">미리보기</h2>
        <div className="p-2 border border-gray-300 rounded-md p-2 h-[150px] overflow-y-auto">
          <div
            dangerouslySetInnerHTML={{ __html: content }}
            className="prose"
          />
        </div>
      </div>
    </div>
  );
};

export default WritePost;
