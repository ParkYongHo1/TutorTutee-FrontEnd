import { LazyLoadImage } from "react-lazy-load-image-component";

const AlarmHeader = ({ handlePopup }) => {
  return (
    <div className="flex items-center justify-between bg-white p-3 rounded-t-lg w-full h-[70px]">
      <div className="font-bold text-xl">알림</div>
      <div className="flex w-[120px] justify-end">
        <button onClick={handlePopup}>
          <LazyLoadImage
            src={`${process.env.PUBLIC_URL}/image/alarm/close.svg`}
            width={30}
            height={30}
            alt="알림창 닫기 버튼"
          />
        </button>
      </div>
    </div>
  );
};

export default AlarmHeader;
