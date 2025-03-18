import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import DefaultAlarm from "./DefaultAlarm";
import { useEffect } from "react";
import { logout, setMemberInfoChange } from "../../slices/memberSlice";
import { useNavigate } from "react-router-dom";

const AlarmInfo = ({ alarm, onDelete }) => {
  const access = useSelector((state) => state.member.access);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const handleLinkClick = async () => {
      try {
        const response = await axios.patch(
          `${process.env.REACT_APP_BASE_URL}/alim/read`,
          {},
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );
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
    handleLinkClick();
  }, [access, dispatch, navigate]);

  const alarmLink =
    alarm.alimType === "TYPE_NOTICE"
      ? `/profile/${alarm.memberNum}`
      : alarm.alimType === "TYPE_LECTURE"
      ? `/live/${alarm.memberNum}`
      : null;

  return (
    <>
      <DefaultAlarm alarm={alarm} onDelete={onDelete} alarmLink={alarmLink} />
    </>
  );
};
export default AlarmInfo;
