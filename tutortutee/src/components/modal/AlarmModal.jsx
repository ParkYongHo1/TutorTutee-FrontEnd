import { LazyLoadImage } from "react-lazy-load-image-component";
import { ALARM_TYPE_MESSAGE } from "../../util/constant";

const AlarmModal = ({ isOpen, onConfirm, alarm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed w-[350px] right-24 top-12 drop-shadow-md z-10 cursor-pointer ">
      <div className="w-[400px] h-[200px] font-bold bg-white rounded-[5px] text-black border mt-[50px] relative">
        <div className="absolute top-[-5px] left-[150px] w-[100px] h-[10px] bg-white z-[20]"></div>
        <div className="absolute flex items-center justify-center text-white top-[-40px] right-[145px] w-6 h-6 bg-red-500 rounded-full z-[26]">
          <p className="text-center ">1</p>
        </div>
        <LazyLoadImage
          src={`${process.env.PUBLIC_URL}/image/alarm/new.svg`}
          alt="새로운 알림 아이콘"
          className="m-auto absolute top-[-45px] left-[150px] z-[25] "
          width={100}
          height={100}
        />

        <div className="w-full p-6 mt-[20px]">
          <p className="text-lg text-center my-[10px]">
            새로운 알림이 도착했습니다.
          </p>
          <div className="flex h-[50px] bg-blue--100 mb-2">
            <p className="w-[10px] bg-blue--300"></p>
            <div className="flex items-center px-2">
              <p className={`font-semibold`}>{alarm.alimMsg}</p>
              <span className="text-sm">
                님이 &nbsp;
                {Object.keys(ALARM_TYPE_MESSAGE).find(
                  (key) => ALARM_TYPE_MESSAGE[key] === alarm.alimType
                )}
              </span>
            </div>
          </div>
          <div className="flex justify-end w-full text-end">
            <button
              onClick={onConfirm}
              className="bg-blue--500 text-white p-2 w-[100px] text-sm"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AlarmModal;
