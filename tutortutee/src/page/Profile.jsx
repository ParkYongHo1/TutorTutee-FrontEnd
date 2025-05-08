import { LazyLoadImage } from "react-lazy-load-image-component";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProfileSide from "../components/profile/ProfileSide";
import { profileInfo } from "../services/profileServices";
import { logout } from "../slices/memberSlice";

const Profile = () => {
  const { memberNum } = useParams();
  const mine = useSelector((state) => state.member.member);
  const [member, setMember] = useState({});
  const access = useSelector((state) => state.member.access);
  const [refreshList, setRefreshList] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const loadProfileInfo = async () => {
      try {
        const response = await profileInfo(access, memberNum);
        setMember(response?.data);
      } catch (error) {
        if (
          error.response?.data?.message === "리프레시 토큰이 만료되었습니다."
        ) {
          dispatch(logout());
          navigate("/");
        } else {
          alert("오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        }
      }
    };
    loadProfileInfo();
  }, [memberNum, access, dispatch, navigate, refreshList]);

  return (
    <>
      <div className="w-[1020px] m-auto gap-[20px] flex ">
        <ProfileSide
          member={member}
          memberNum={memberNum}
          mine={mine}
          setRefreshList={setRefreshList}
        />
      </div>
    </>
  );
};

export default Profile;
