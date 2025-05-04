import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { logout, setMemberInfoChange } from "../slices/memberSlice";
import { useNavigate } from "react-router-dom";

const useUploadImage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const access = useSelector((state) => state.member.access);

  const uploadImage = async (image) => {
    const formData = new FormData();
    formData.append("image", image); // "image"라는 키에 파일 추가
    console.log(formData);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/chattings/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${access}`,
          },
        }
      );
      return response.data.imageUrl; // 반환된 이미지 URL
    } catch (error) {
      if (error.response?.data?.message === "리프레시 토큰이 만료되었습니다.") {
        dispatch(logout());
        navigate("/");
      } else {
        alert("오류가 발생했습니다. 잠시후 다시 시도해주세요.");
      }
    }
    return null;
  };

  return { uploadImage };
};

export default useUploadImage;
