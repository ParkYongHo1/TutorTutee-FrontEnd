import { useDispatch } from "react-redux";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { setMemberInfoChange } from "../slices/memberSlice"; // 액션 임포트

const useUploadImage = () => {
  const dispatch = useDispatch(); // useDispatch 훅 사용

  const getImage = async (image) => {
    const validMimeTypes = ["image/png", "image/jpeg"]; // PNG, JPG, JPEG MIME 타입
    const maxSizeMB = 10; // 10MB

    if (!validMimeTypes.includes(image.type)) {
      alert("프로필 이미지는 png, jpg/jpeg 파일만 가능합니다.");
      return;
    }
    if (image.size > maxSizeMB * 1024 * 1024) {
      alert("프로필 이미지는 10MB 이하의 파일만 가능합니다.");
      return;
    }

    const imageName = uuidv4(); // UUID 생성

    try {
      const formData = new FormData();
      formData.append("image", image); // 이미지 파일 추가
      formData.append("imageName", imageName); // 이미지 이름 추가 (필요한 경우)

      let response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/image/uploadProfileImg`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // 헤더 설정
          },
        }
      );
      console.log(response);

      const uploadUrl = response.data.url; // 업로드된 이미지 URL
      console.log(uploadUrl);

      // Redux 상태 업데이트
      dispatch(setMemberInfoChange({ profileImg: uploadUrl }));
    } catch (error) {
      console.log(error);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return { getImage }; // getImage 반환
};

export default useUploadImage; // 기본 내보내기로 변경
