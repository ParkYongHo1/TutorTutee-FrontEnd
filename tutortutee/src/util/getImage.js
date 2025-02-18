import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { logout, setMemberInfoChange } from "../slices/memberSlice";
import { useNavigate } from "react-router-dom";

const useUploadImage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const access = useSelector((state) => state.member.access);
  const getImage = async (image) => {
    const validMimeTypes = ["image/png", "image/jpeg", "image/svg+xml"];
    const maxSizeMB = 10;

    if (!validMimeTypes.includes(image.type)) {
      alert("프로필 이미지는 png, jpg/jpeg,svg 파일만 가능합니다.");
      return;
    }
    if (image.size > maxSizeMB * 1024 * 1024) {
      alert("프로필 이미지는 10MB 이하의 파일만 가능합니다.");
      return;
    }

    try {
      const formData = {
        profileImg: image,
      };

      let response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/profile/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${access}`,
          },
        }
      );
      const uploadUrl = response.data.profileImg;
      dispatch(setMemberInfoChange({ profileImg: uploadUrl }));
    } catch (error) {
      if (error.response?.data?.message === "리프레시 토큰이 만료되었습니다.") {
        dispatch(logout());
        navigate("/");
      } else {
        alert("오류가 발생했습니다. 잠시후 다시 시도해주세요.");
      }
    }
  };

  return { getImage };
};

export default useUploadImage;
