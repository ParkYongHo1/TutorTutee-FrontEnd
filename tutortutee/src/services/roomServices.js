import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const loadMember = async (access, roomId) => {
  return await axios.get(`${BASE_URL}/room/member?roomId=${roomId}`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });
};
