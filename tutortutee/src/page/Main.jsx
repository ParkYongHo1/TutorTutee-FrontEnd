import { useState } from "react";
import { useSelector } from "react-redux";
import { LazyLoadImage } from "react-lazy-load-image-component";
import useUploadImage from "../util/getImage";
import { Link } from "react-router-dom";

const Main = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const profileImg = useSelector((state) => state.member.member.profileImg);
  const { getImage } = useUploadImage();
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file)); // 이미지 미리보기 생성
    }
  };

  const handleUpload = async () => {
    if (selectedImage) {
      await getImage(selectedImage); // 이미지 업로드 함수 호출
      setImagePreview(null); // 업로드 후 미리보기 초기화
      setSelectedImage(null); // 선택된 이미지 초기화
    } else {
      alert("업로드할 이미지를 선택해 주세요.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="mb-4">이미지 업로드 테스트</h1>
      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
        className="mb-4"
      />
      {imagePreview && (
        <img
          src={imagePreview}
          alt="미리보기"
          className="mb-4 border border-gray-300 rounded"
          style={{ maxWidth: "300px", maxHeight: "300px" }} // 미리보기 크기 조정
        />
      )}
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        이미지 업로드
      </button>
      <LazyLoadImage
        src={
          profileImg || `${process.env.PUBLIC_URL}/image/default/profile.svg`
        }
      />
      <Link to="/login">로그인바로가기</Link>
      <Link to="/signup">회원가입바로가기</Link>
      <Link to="/find">아이디 비밀번호 찾기 바로가기</Link>
      <Link to="/live" target="_blank">
        라이브 새 창 열기
      </Link>
    </div>
  );
};

export default Main;
