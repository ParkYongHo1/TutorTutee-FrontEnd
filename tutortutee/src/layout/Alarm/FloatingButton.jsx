// import floating from "/public/image/floating.svg";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { useSelector } from "react-redux";
// import { usePathname } from "next/navigation";
// import AlarmHeader from "../_alarm/AlarmHeader";
// import AlarmActiveAction from "../_alarm/AlarmActiveAction";
// import AlarmInfo from "../_alarm/AlarmInfo";
// import alarmIcon from "/public/image/alarm/alarm.svg";
// import useFetchAlarms from "@/app/hooks/useFetchAlarms";
import { useCallback, useEffect, useRef, useState } from "react";
import useSSE from "../../hooks/useSSE";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { LazyLoadImage } from "react-lazy-load-image-component";
import AlarmHeader from "../../components/alarm/AlarmHeader";
import AlarmActiveAction from "../../components/alarm/AlarmActiveAction";
import AlarmInfo from "../../components/alarm/AlarmInfo";
import { setMemberInfoChange } from "../../slices/memberSlice";

export default function Floating() {
  const [alarms, setAlarms] = useState([]);
  const access = useSelector((state) => state.member.access);
  const isLoggedIn = useSelector((state) => state.member.isLoggedIn);
  const hasNotice = useSelector((state) => state.member.member.hasNotice);
  const dispatch = useDispatch();
  const popupRef = useRef(null);
  const [hasNotification, setHasNotification] = useState(true);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [activeTab, setActiveTab] = useState("전체");

  useEffect(() => {
    const fetchAlarm = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/alim/list?observer=0`,
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );
        setAlarms((prev) => [...prev, ...response.data.alimList]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAlarm();
  }, [access, dispatch]);
  useSSE(setAlarms, hasNotice);

  const handlePopup = async () => {
    if (isPopupVisible) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsPopupVisible(false);
        setIsAnimating(false);
      }, 500);
    } else {
      setHasNotification(false);
      setIsPopupVisible(true);

      try {
        await axios.get(
          `${process.env.REACT_APP_BASE_URL}/alim/send?memberNum=33`,
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setIsPopupVisible(false);
    }
  };

  useEffect(() => {}, [isPopupVisible, isDelete]);

  useEffect(() => {
    if (isPopupVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupVisible]);
  console.log(hasNotice);
  console.log(isLoggedIn);

  return (
    <>
      {isLoggedIn && (
        <>
          <div
            className="fixed w-12 h-12 right-12 bottom-24 drop-shadow-md z-10 cursor-pointer"
            onClick={handlePopup}
          >
            <div className="relative rounded-full w-16 h-16 bg-white flex items-center justify-center">
              <LazyLoadImage
                className="w-10 h-10"
                src={`${process.env.PUBLIC_URL}/image/alarm/alarm.svg`}
                width={40}
                height={40}
                alt="Floating Button"
              />
              {hasNotice && (
                <div className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full border border-white"></div>
              )}
            </div>
          </div>

          {isPopupVisible && (
            <>
              <div
                ref={popupRef}
                className={`fixed right-2 bottom-16 bg-gray-100 z-20 border rounded-lg w-[420px] overflow-y-auto transition-transform transform min-h-[700px] ${
                  isAnimating ? "animate-slide-down" : "animate-slide-up"
                }`}
              >
                <AlarmHeader handlePopup={handlePopup} />
                <AlarmActiveAction
                  setActiveTab={setActiveTab}
                  activeTab={activeTab}
                  setHasNotification={setHasNotification}
                  setIsDelete={setIsDelete}
                />
                <div className="scrollable max-h-[600px] min-h-[600px] overflow-y-auto">
                  {alarms.length === 0 ? (
                    <div className="mx-auto my-auto flex flex-col justify-center items-center">
                      <LazyLoadImage
                        src={`${process.env.PUBLIC_URL}/image/alarm/alarm.svg`}
                        alt="알림 아이콘"
                        width={40}
                        height={40}
                        className="mt-[40%] pb-[30px] mx-auto"
                      />
                      <strong className="text-2xl text-center mb-[20px]">
                        새로운 알림이 없습니다.
                        <br />
                      </strong>
                      다양한 알림을 이곳에서 모아볼 수 있어요.
                    </div>
                  ) : (
                    alarms.map((alarm, index) => (
                      <AlarmInfo key={index} alarm={alarm} />
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
