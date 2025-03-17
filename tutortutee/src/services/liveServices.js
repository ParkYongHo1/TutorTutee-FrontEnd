import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const liveMemberUpdate = async (access, roomId) => {
  await axios.patch(
    `${BASE_URL}/room/updateInitStatus?roomId=${roomId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    }
  );
  return true;
};

export const deleteRoom = async (access, roomId) => {
  return await axios.delete(`${BASE_URL}/room/delete?roomId=${roomId}`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });
};
