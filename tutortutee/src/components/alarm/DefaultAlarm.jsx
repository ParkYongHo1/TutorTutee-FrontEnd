import React from "react";
import { Link, useNavigate } from "react-router-dom";
import formatDate from "../../util/getDate";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { ALARM_TYPE, ALARM_TYPE_MESSAGE } from "../../util/constant";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../slices/memberSlice";
import { alarmDelete } from "../../services/alarmServices";
import { liveMemberUpdate } from "../../services/liveServices";

export default function DefaultAlarm({ alarm, onDelete, alarmLink }) {
  console.log(alarm);

  const dispatch = useDispatch();
  const access = useSelector((state) => state.member.access);
  const navigate = useNavigate();
  const handleDelete = async () => {
    try {
      const isDelete = await alarmDelete(access, alarm.alimNum);
      if (isDelete) {
        onDelete(alarm.alimNum);
      }
    } catch (error) {
      if (error.response?.data?.message === "리프레시 토큰이 만료되었습니다.") {
        dispatch(logout());
        navigate("/");
      } else {
        alert("오류가 발생했습니다. 잠시후 다시 시도해주세요.");
      }
    }
  };

  const handleMovePage = async () => {
    try {
      if (alarm.alimType === "TYPE_LECTURE") {
        const response = await liveMemberUpdate(access, alarm.roomId);
        navigate(alarmLink);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className={`w-[380px] min-h-[120px] m-auto mb-3 cursor-pointer`}
      onClick={handleMovePage}
    >
      <div
        className={`${
          alarm.read ? "bg-gray--100" : "bg-white"
        }  p-4 rounded-lg shadow-md w-full `}
      >
        <div className="flex items-center  text-xs justify-between mb-2 ">
          <div
            className={`flex justify-between items-center ${
              alarm.read ? "text-gray--500" : "text-blue--500"
            }`}
          >
            {Object.keys(ALARM_TYPE).find(
              (key) => ALARM_TYPE[key] === alarm.alimType
            )}
          </div>
          <div>
            <LazyLoadImage
              src={`${process.env.PUBLIC_URL}/image/alarm/close.svg`}
              alt="프로필"
              className="w-full h-full object-cover fill cursor-pointer"
              width={100}
              height={100}
              onClick={handleDelete}
            />
          </div>
        </div>
        <div>
          <div
            className={`flex justify-between items-center ${
              alarm.read ? "text-gray--100" : "text-white"
            }}`}
          >
            <div className="flex ">
              <p
                className={`font-bold ${
                  alarm.read ? "text-gray--500" : "text-blue--500"
                }`}
              >
                {alarm.alimMsg}
              </p>
              <span
                className={`${alarm.read ? "text-gray--500" : "text-black"}`}
              >
                님이 &nbsp;
                {Object.keys(ALARM_TYPE_MESSAGE).find(
                  (key) => ALARM_TYPE_MESSAGE[key] === alarm.alimType
                )}
              </span>
            </div>
          </div>
          <div
            className={`text-sm mt-[4px] font-semibold ${
              alarm.read ? "text-gray--500" : "text-black"
            }`}
          >
            {formatDate(alarm.sendTime)}
          </div>
        </div>
      </div>
    </div>
  );
}
