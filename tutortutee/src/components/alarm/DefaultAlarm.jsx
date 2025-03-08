import React from "react";
import { Link } from "react-router-dom";
import formatDate from "../../util/getDate";
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function DefaultAlarm({ alarm, alarmLink }) {
  return (
    <div className={`w-[380px] min-h-[120px] m-auto mb-3`}>
      <div className={`bg-white p-4 rounded-lg shadow-md w-full`}>
        <div className="flex items-center  text-xs justify-between mb-2">
          <div>
            {alarm.alimType === "TYPE_FOLLOW" ? "팔로우" : alarm.writer}
          </div>
          <div>
            <LazyLoadImage
              src={`${process.env.PUBLIC_URL}/image/alarm/close.svg`}
              alt="프로필"
              className="w-full h-full object-cover fill cursor-pointer"
              width={100}
              height={100}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between">
            <div className="flex">
              {alarm.type === "commerce_success" ||
              alarm.type === "commerce_fail" ? (
                <>
                  의&nbsp;<span className="text-blue--500"> 공동구매</span>
                  가&nbsp;
                  {alarm.type === "commerce_success" ? (
                    <>
                      <span className="text-blue--500 font-bold">성공</span>
                      했습니다.
                    </>
                  ) : (
                    <>
                      <span className="text-red--500 font-bold">실패</span>
                      했습니다.
                    </>
                  )}
                </>
              ) : (
                <>{alarm.alimMsg}</>
              )}
            </div>
          </div>

          <div className="text-sm mt-[4px] font-semibold">
            {formatDate(alarm.sendTime)}
            {alarm.alimNum}
          </div>
        </div>
      </div>
    </div>
  );
}
