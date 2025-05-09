import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useDispatch, useSelector } from "react-redux";
import useUploadImage from "../../util/getImage";
import {
  changeIntroduction,
  changeNickname,
} from "../../services/profileServices";
import { logout, setMemberInfoChange } from "../../slices/memberSlice";
import { useNavigate } from "react-router-dom";

const ChangeInfo = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const member = useSelector((state) => state.member.member);
  const access = useSelector((state) => state.member.access);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getImage } = useUploadImage();
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (event.target.closest(".dropdown")) return;
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const { register, watch, reset } = useForm();
  const introduction = watch("introduction") || "";
  const nickname = watch("nickname") || "";
  const handleImageChange = async (type) => {
    if (type === "change") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/png,image/jpeg";

      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          await getImage(file);
        }
      };

      input.click();
    } else if (type === "default") {
      const defaultImageUrl = `${process.env.PUBLIC_URL}/image/default/profile.svg`;
      const response = await fetch(defaultImageUrl);
      const blob = await response.blob();
      const file = new File([blob], "profile.svg", { type: blob.type });
      await getImage(file);
    }
  };
  const handleIntroduction = async () => {
    try {
      await changeIntroduction(access, introduction);
      dispatch(setMemberInfoChange({ introduction: introduction }));
      reset({ introduction: "" });
    } catch (error) {
      if (error.response?.data?.message === "리프레시 토큰이 만료되었습니다.") {
        dispatch(logout());
        navigate("/");
      } else {
        alert("오류가 발생했습니다. 잠시후 다시 시도해주세요.");
      }
    }
  };
  const handleNickname = async () => {
    try {
      await changeNickname(access, nickname);
      dispatch(setMemberInfoChange({ nickname: nickname }));
      reset({ nickname: "" });
    } catch (error) {
      if (error.response?.data?.message === "리프레시 토큰이 만료되었습니다.") {
        dispatch(logout());
        navigate("/");
      } else if (error.response?.data.message === "중복된 닉네임입니다.") {
        alert("이미 사용중인 닉네임입니다.");
      } else {
        alert("오류가 발생했습니다. 잠시후 다시 시도해주세요.");
      }
    }
  };
  return (
    <>
      <div className="text-2xl font-bold mb-[24px]">공개 프로필</div>
      <hr />

      <div className="flex justify-between">
        <div className="w-[100%]">
          <p className="font-bold my-[12px]">닉네임</p>
          <input
            type="text"
            placeholder={`${member.nickname}`}
            {...register("nickname")}
            className="w-[80%] px-4 border border-gray--100 rounded-[5px] h-[50px]"
          />
          <div className="flex gap-[12px]">
            <button
              disabled={nickname.length === 0}
              onClick={handleNickname}
              className={`${
                nickname.length === 0
                  ? "border-none bg-gray--200 cursor-not-allowed"
                  : "bg-blue--500 border border-blue-500"
              } block h-[40px]  rounded-[5px] text-white w-[100px] my-[12px] font-bold`}
            >
              변경
            </button>
            <button
              disabled={nickname.length === 0}
              className={`${
                nickname.length === 0
                  ? "border-none bg-gray--200 cursor-not-allowed text-white"
                  : "bg-white border text-blue--500 border "
              } block h-[40px] rounded-[5px] font-bold w-[100px] my-[12px]`}
            >
              취소
            </button>
          </div>
          <p className="text-sm my-[8px] text-gray--600">
            - 닉네임은 한글,숫자,영어만 입력가능합니다.
          </p>
          <p className="text-sm my-[8px] text-gray--600">
            - 최대 12글자 입력 가능합니다.
          </p>
        </div>
        <div>
          <p className=" font-bold my-[12px]">프로필 사진</p>
          <div
            className="w-[200px] h-[200px] mt-[12px] ml-[12px] relative dropdown cursor-pointer"
            onClick={toggleDropdown}
          >
            <LazyLoadImage
              src={
                member.profileImg ||
                `${process.env.PUBLIC_URL}/image/default/profile.svg`
              }
              alt="프로필이미지"
              className="p-1 w-full h-full object-cover fill border rounded-full"
              width={200}
              height={200}
            />
            <div className="absolute top-[150px] z-10 bg-white rounded-full w-[50px] h-[50px]">
              <LazyLoadImage
                src={`${process.env.PUBLIC_URL}/image/profile/editProfile.svg`}
                alt="이미지 수정"
                className="p-1 w-full h-full object-cover fill border rounded-full"
                width={50}
                height={50}
              />

              {isDropdownOpen && (
                <div className="absolute w-[200px] z-20 border border-gray-300 bg-white shadow-lg text-start left-[0px] top-[55px] rounded">
                  <div className=" px-1 py-2 w-[90%] m-auto">
                    <button
                      className="text-xs text-black font-bold cursor-pointer my-[12px] hover:underline"
                      onClick={() => handleImageChange("change")}
                    >
                      이미지 변경
                    </button>
                    <hr />
                    <button
                      className="text-xs text-black font-bold cursor-pointer my-[12px] hover:underline"
                      onClick={() => handleImageChange("default")}
                    >
                      기본이미지로 변경
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <p className="font-bold my-[12px]">한줄소개</p>

      <input
        type="text"
        placeholder={`${member.introduction}`}
        {...register("introduction", { required: "내용을 입력해주세요." })}
        maxLength={20}
        className="w-[80%] px-4 border border-gray--100 rounded-[5px] h-[50px]"
      />
      <div className="flex gap-[12px]">
        <button
          disabled={introduction.length === 0}
          onClick={handleIntroduction}
          className={`${
            introduction.length === 0
              ? "border-none bg-gray--200 cursor-not-allowed"
              : "bg-blue--500 border border-blue-500"
          } block h-[40px]  rounded-[5px] text-white w-[100px] my-[12px] font-bold`}
        >
          변경
        </button>
        <button
          disabled={introduction.length === 0}
          className={`${
            introduction.length === 0
              ? "border-none bg-gray--200 cursor-not-allowed text-white"
              : "bg-white border text-blue--500 border "
          } block h-[40px] rounded-[5px] font-bold w-[100px] my-[12px]`}
        >
          취소
        </button>
      </div>
      <p className="text-sm my-[8px] text-gray--600">
        - 한줄 소개는 최대 20글자까지 입력 가능합니다.
      </p>
      <p className="font-bold mt-[24px] mb-[12px]">계정 공개 범위</p>
      <form>
        <div className="flex items-center">
          <input
            type="radio"
            id="public"
            value="public"
            {...register("visibility", {
              required: "공개 범위를 선택해주세요.",
            })}
            className="mr-2"
          />
          <label htmlFor="public" className="mr-4 font-bold">
            전체 공개
          </label>

          <input
            type="radio"
            id="private"
            value="private"
            {...register("visibility", {
              required: "공개 범위를 선택해주세요.",
            })}
            className="mr-2"
          />
          <label htmlFor="private" className="font-bold">
            비공개
          </label>
        </div>
        <div className="flex gap-[12px] mt-[12px]">
          <button className="block h-[40px] bg-blue--500 rounded-[5px] text-white w-[100px] my-[12px] font-bold">
            변경
          </button>
          <button className="block h-[40px] bg-white border rounded-[5px] text-blue--500 font-bold w-[100px] my-[12px]">
            취소
          </button>
        </div>
        <p className="text-sm my-[8px] text-gray--600">
          - 계정 공개 범위를 선택해주세요.
        </p>
      </form>
      <hr className="my-[24px]" />
      <p className="text-center my-[12px] font-semibold">
        이 페이지의 모든 필드는 선택 사항이며 언제든지 수정이 가능합니다.
      </p>
    </>
  );
};
export default ChangeInfo;
