import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const alarmList = async (access, observer) => {
  return await axios.get(`${BASE_URL}/alim/list?observer=${observer}`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });
};

export const alarmDelete = async (access, alarmNum) => {
  await axios.delete(`${BASE_URL}/alim/delete?alimNum=${alarmNum}`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });
  alert("해당 알림을 삭제했습니다.");
  return true;
};

export const alarmDeleteAll = async (access) => {
  await axios.delete(`${process.env.REACT_APP_BASE_URL}/alim/deleteAll`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });
  alert("정상적으로 삭제되었습니다.");
  return true;
};
