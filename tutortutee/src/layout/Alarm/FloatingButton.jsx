import { useCallback, useEffect, useRef, useState } from "react";
import useSSE from "../../hooks/useSSE";
import { useDispatch, useSelector } from "react-redux";
import { LazyLoadImage } from "react-lazy-load-image-component";
import AlarmHeader from "../../components/alarm/AlarmHeader";
import AlarmActiveAction from "../../components/alarm/AlarmActiveAction";
import AlarmInfo from "../../components/alarm/AlarmInfo";
import { logout } from "../../slices/memberSlice";
import { alarmList } from "../../services/alarmServices";
import { useNavigate } from "react-router-dom";
import AlarmModal from "../../components/modal/AlarmModal";
export default function Floating() {
  const [alarms, setAlarms] = useState([]);
  const access = useSelector((state) => state.member.access);
  const isLoggedIn = useSelector((state) => state.member.isLoggedIn);
  const dispatch = useDispatch();
  const popupRef = useRef(null);
  const [hasNotification, setHasNotification] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeTab, setActiveTab] = useState("전체");
  const [observer, setObserver] = useState(0);
  const [flag, setFlag] = useState(false);
  const navigate = useNavigate();
  const [newAlarm, setNewAlarm] = useState({});
  const createEventSource = useCallback((data) => {
    if (!data.read) {
      {
        setIsModalOpen(true);
        setNewAlarm(data);
        setHasNotification(true);
      }
    }
  }, []);

  useSSE(createEventSource);

  const handlePopup = () => {
    if (isPopupVisible) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsPopupVisible(false);
        setIsAnimating(false);
      }, 500);
    } else {
      setHasNotification(false);
      setIsPopupVisible(true);
    }
  };

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setIsPopupVisible(false);
    }
  };

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
  useEffect(() => {
    const loadMore = async () => {
      try {
        const response = await alarmList(access, observer);
        setFlag(response.data.flag);
        setAlarms((prev) => [...prev, ...response.data.alimList]);
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
    loadMore();
  }, [access, observer, dispatch, navigate]);

  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollHeight - scrollTop <= clientHeight + 1) {
      if (
        !flag &&
        (observer === 0 ||
          (scrollHeight - scrollTop <= clientHeight + 1 && observer > 0))
      ) {
        setObserver((prevObserver) => prevObserver + 1);
      }
    }
  };

  const handleDelete = (alarmNum) => {
    setAlarms((prev) => prev.filter((alarm) => alarm.alimNum !== alarmNum));
  };
  const handleDeleteAll = () => {
    setAlarms([]);
  };
  const filteredAlarms = alarms.filter((alarm) => {
    if (activeTab === "전체") return true;

    return alarm.alimType === activeTab;
  });
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

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
              {hasNotification && (
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
                  onDeleteAll={handleDeleteAll}
                />
                <div
                  onScroll={handleScroll}
                  className="scrollable max-h-[600px] min-h-[600px] overflow-y-auto"
                >
                  {filteredAlarms.length === 0 ? (
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
                    filteredAlarms.map((alarm, index) => (
                      <AlarmInfo
                        key={index}
                        alarm={alarm}
                        onDelete={handleDelete}
                      />
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}
      <div>
        {isModalOpen && (
          <AlarmModal
            isOpen={isModalOpen}
            onConfirm={handleModalClose}
            alarm={newAlarm}
          />
        )}
      </div>
    </>
  );
}
