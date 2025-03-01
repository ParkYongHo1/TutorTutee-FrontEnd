import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { logout, setMemberInfoChange } from "../../../slices/memberSlice";
import { useNavigate } from "react-router-dom";
import { writeNotice } from "../../../services/profileServices";

const WritePost = () => {
  const [content, setContent] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const access = useSelector((state) => state.member.access);
  const noticeCount = useSelector((state) => state.member.member.noticeCount);
  const handleInputChange = (value) => {
    setContent(value);
  };

  const handleSubmit = async () => {
    try {
      await writeNotice(access, content);
      setContent("");
      dispatch(setMemberInfoChange({ noticeCount: noticeCount + 1 }));
    } catch (error) {
      if (error.response?.data?.message === "리프레시 토큰이 만료되었습니다.") {
        dispatch(logout());
        navigate(`/`);
      } else {
        alert("오류가 발생했습니다. 잠시후 다시 시도해주세요.");
      }
    }
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
