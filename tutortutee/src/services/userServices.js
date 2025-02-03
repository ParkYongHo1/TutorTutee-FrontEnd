import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const findPassword = async (memberId) => {
  const formData = {
    memberId,
  };

  return await axios.post(`${BASE_URL}/member/findPassword`, formData);
};

export const findId = async (email) => {
  const formData = {
    email,
  };
  return await axios.post(`${BASE_URL}/member/findId`, formData);
};

export const sendEmailVerification = async (email) => {
  const formData = { email };
  return await axios.post(`${BASE_URL}/member/sendEmail`, formData);
};
