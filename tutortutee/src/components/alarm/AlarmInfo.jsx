import axios from "axios";

import { useSelector } from "react-redux";
import DefaultAlarm from "./DefaultAlarm";
import { useEffect } from "react";

const AlarmInfo = ({ alarm }) => {
  const access = useSelector((state) => state.member.access);
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
        console.log(error);
      }
    };
    handleLinkClick();
  }, []);

  const alarmLink =
    alarm.type === "comment" || alarm.type === "reply"
      ? `/community/1`
      : alarm.type === "commerce"
      ? "/mypage/myorder"
      : alarm.type === "chat"
      ? `/chat/2`
      : "";

  return (
    <>
      <DefaultAlarm alarm={alarm} alarmLink={alarmLink} />
    </>
  );
};
export default AlarmInfo;
